import { Expose } from 'class-transformer';

export class ReportItemHistoriesResponseDto {
  @Expose()
  reportType: number;

  @Expose()
  tag: string;

  @Expose()
  quantity: number;

  @Expose()
  amount: number;

  @Expose()
  rangeDate: string;
}
