import { ComparisonType } from 'src/mongo/common/variable'

export interface ItemStockDailyConditionDto {
  id?: string
  ids?: string[]

  timestampSync?: number | [ComparisonType, number?, number?]
}

export type ItemStockDailyOrder = {
  [P in 'id']?: 'ASC' | 'DESC'
}
