import { ComparisonType } from 'src/mongo/common/variable'

export interface ItemMovementConditionDto {
	id?: string
	ids?: string[]

	timestampSync?: number | [ComparisonType, number?, number?]
}
