import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export type TExternal = {
	user?: Record<string, any>,
}

export interface RequestExternal extends Request {
	external: TExternal
}

export const External = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request: RequestExternal = ctx.switchToHttp().getRequest()
	return request.external
})
