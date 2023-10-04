import { BootModule } from '@nestcloud/boot'
import { BOOT, CONSUL } from '@nestcloud/common'
import { ConsulModule } from '@nestcloud/consul'
import { ServiceModule } from '@nestcloud/service'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { HeaderResolver, I18nJsonLoader, I18nModule, QueryResolver } from 'nestjs-i18n'
import * as path from 'path'
import { resolve } from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ApiModule } from './components/api/api.module'
import { NatsEventModule } from './components/nats-event/nats-event.module'
import { TasksScheduleModule } from './components/schedule/tasks-schedule.module'
import { AuthorizationGuard } from './core/guard/authorization.guard'
import { KongGatewayModule } from './modules/kong-gateway/kong-gateway.module'
import { NatsClientModule } from './modules/nats/nats-client.module'
import { MongoDbConnectModule } from './mongo/mongodb-connect.module'
import { KafkaClientModule } from './modules/kafka/kafka-client.module'
import { KafkaEventModule } from './components/kafka-event/kafka-event.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: [`.env.${process.env.NODE_ENV || 'local'}`, '.env'],
			isGlobal: true,
		}),
		I18nModule.forRoot({
			fallbackLanguage: 'vi',
			loader: I18nJsonLoader,
			loaderOptions: {
				path: path.join(__dirname, '/i18n/'),
				watch: true,
			},
			resolvers: [
				{ use: QueryResolver, options: ['lang', 'locale', 'l'] },
				new HeaderResolver(['lang', 'x-lang']),
			],
			typesOutputPath: path.join(__dirname, '../src/generated/i18n.generated.ts'),
		}),
		BootModule.forRoot({ filePath: resolve(__dirname, '../config.yaml') }),
		ConsulModule.forRootAsync({ inject: [BOOT] }),
		ServiceModule.forRootAsync({ inject: [BOOT, CONSUL] }),
		KongGatewayModule.forRootAsync(),
		// PostgresModule,
		MongoDbConnectModule,
		ScheduleModule.forRoot(),
		NatsClientModule,
		KafkaClientModule,
		KafkaEventModule,
		NatsEventModule,
		TasksScheduleModule,
		ApiModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthorizationGuard,
		},
		AppService,
	],
})
export class AppModule { }
