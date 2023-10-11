export interface WarehouseCheckoutConditionDto {
	id?: string
	ids?: string[]
	ticketCode?: string

	timeSync?: Date | { [P in '$gte' | '$gt' | '$lt' | '$lte']?: Date }
	createTime?: Date | { [P in '$gte' | '$gt' | '$lt' | '$lte']?: Date }
}