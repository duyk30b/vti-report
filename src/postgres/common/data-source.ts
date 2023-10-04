import * as dotenv from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm'

dotenv.config()

const options: DataSourceOptions = {
	type: 'postgres',
	host: process.env.DATABASE_POSTGRES_HOST,
	port: parseInt(process.env.DATABASE_POSTGRES_PORT),
	database: process.env.DATABASE_NAME,
	username: process.env.DATABASE_POSTGRES_USERNAME,
	password: process.env.DATABASE_POSTGRES_PASSWORD,
	entities: ['dist/postgres/entities/**/*.entity.{ts,js}', 'src/postgres/entities/*.entity.{ts,js}'],
	migrations: ['dist/postgres/migrations/*.{ts,js}'],
	migrationsTableName: 'typeorm_migration',
	migrationsTransactionMode: 'each',
	extra: { max: parseInt(process.env.POSTGRES_MAX_POOL) || 20 },
	synchronize: false,
	logging: process.env.NODE_ENV === 'local',
}

export const dataSource = new DataSource(options)
