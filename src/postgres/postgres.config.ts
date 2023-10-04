import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'

export const PostgresConfig = registerAs('postgres', (): TypeOrmModuleOptions => ({
	type: 'postgres',
	host: process.env.DATABASE_POSTGRES_HOST,
	port: Number(process.env.DATABASE_POSTGRES_PORT),
	database: process.env.DATABASE_NAME,
	username: process.env.DATABASE_POSTGRES_USERNAME,
	password: process.env.DATABASE_POSTGRES_PASSWORD,
	autoLoadEntities: true,
	logging: process.env.NODE_ENV === 'local' ? 'all' : ['error'],
	synchronize: false,
	extra: { max: parseInt(process.env.DATABASE_MAX_POOL) || 20 },
}))
