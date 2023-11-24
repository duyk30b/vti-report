import { ComparisonType } from 'src/mongo/common/variable'

export interface ItemConditionDto {
	id?: string
	ids?: string[]

	timestampSync?: number | [ComparisonType, number?, number?]
}

export type ItemOrder = {
	[P in 'id']?: 'ASC' | 'DESC'
}
