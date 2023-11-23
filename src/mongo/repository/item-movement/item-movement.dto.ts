export interface ItemMovementConditionDto {
	id?: string
	ids?: string[]

	timeSync?: Date | { [P in '$gte' | '$gt' | '$lt' | '$lte']?: Date }
	documentDate?: Date | { [P in '$gte' | '$gt' | '$lt' | '$lte']?: Date }
}
