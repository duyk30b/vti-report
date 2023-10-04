import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { NoExtraProperties } from 'src/common/helpers/typescript.helper'
import { FindOptionsWhere, InsertResult, Repository } from 'typeorm'
import { WarehouseImportCondition } from './warehouse-import.dto'

// @Injectable()
// export class WarehouseImportRepository {
// 	constructor(@InjectRepository(WarehouseImport) private warehouseImportRepository: Repository<WarehouseImport>) { }

// 	getCondition(condition: WarehouseImportCondition = {}) {
// 		const where: FindOptionsWhere<WarehouseImport> = {}
// 		if (condition.id != null) where.id = condition.id

// 		return where
// 	}

// 	async insertMany<T extends Partial<WarehouseImport>>(dto: NoExtraProperties<Partial<WarehouseImport>, T>[]): Promise<InsertResult> {
// 		const data = this.warehouseImportRepository.create(dto)
// 		return this.warehouseImportRepository.insert(data)
// 	}
// }
