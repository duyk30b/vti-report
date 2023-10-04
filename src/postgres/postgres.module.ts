import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PostgresConfig } from './postgres.config'
// import { WarehouseImportRepository } from './repository/warehouse-import/warehouse-import.repository'

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule.forFeature(PostgresConfig)],
			inject: [PostgresConfig.KEY],
			useFactory: (postgresConfig: ConfigType<typeof PostgresConfig>) => postgresConfig,
		}),
		// TypeOrmModule.forFeature([WarehouseImport]),
	],
	// providers: [WarehouseImportRepository],
	// exports: [WarehouseImportRepository],
})
export class PostgresModule { }
