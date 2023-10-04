import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { KafkaContext, NatsContext } from '@nestjs/microservices'
import { Request, Response } from 'express'
import { I18nContext } from 'nestjs-i18n'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { I18nTranslations } from 'src/generated/i18n.generated'
import { ValidationException } from '../exception-filters/validation-exception.filter'

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
	private logger = new Logger('AccessLogInterceptor')

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const createTime = new Date()
		const className = context.getClass().name
		const funcName = context.getHandler().name
		const [req, res] = context.getArgs()
		const i18n = I18nContext.current<I18nTranslations>()

		const showData = true

		let msgRequest = ''
		if (context.getType() === 'http') {
			const ctx = context.switchToHttp()
			const request: Request = ctx.getRequest()

			const { url, method, body } = request
			if (url?.includes('reports/health')) return next.handle()

			msgRequest = `${method} | ${url} | ${className} | ${funcName}() `
			if (showData) {
				msgRequest += `| ${JSON.stringify(body)} `
			}
		}
		else if (context.getType() === 'rpc') {
			if (res.constructor.name === 'NatsContext') {
				const response: NatsContext = res
				msgRequest = `[NATS] | ${response.getSubject()} | ${className} | ${funcName}() `
				if (showData) {
					msgRequest += `| ${JSON.stringify(req)} `
				}
			}
			if (res.constructor.name === 'KafkaContext') {
				const response: KafkaContext = res
				const topicInfo = {
					topic: response.getTopic(),
					partition: response.getPartition(),
					offset: response.getMessage().offset,
				}
				msgRequest = `[KAFKA] | ${JSON.stringify(topicInfo)} | ${className} | ${funcName}() `
				if (showData) {
					msgRequest += `| ${JSON.stringify(req)} `
				}
			}
		}

		return next.handle().pipe(
			catchError((err) => {
				let errMessage = i18n.translate(err.message)
				if (err instanceof ValidationException) {
					errMessage = errMessage + ' ' + JSON.stringify(err.getErrors())
				}
				this.logger.error(`${msgRequest} | ${Date.now() - createTime.getTime()}ms | Message: ${errMessage}`)
				return throwError(() => err)
			}),
			tap((xx: any) => {
				this.logger.log(`${msgRequest} | ${Date.now() - createTime.getTime()}ms`)
			})
		)
	}
}
