export class WarehouseImportCondition {
	id?: number
}

export type WarehouseImportOrder = {
	[P in 'id']?: 'ASC' | 'DESC'
}
