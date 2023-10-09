export interface WarehouseTransferConditionDto {
	id?: string
	ids?: string[]

	timeSync?: Date | { [P in '$gte' | '$gt' | '$lt' | '$lte']?: Date }
}