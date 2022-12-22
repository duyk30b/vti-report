import { Expose } from 'class-transformer';

export class RangeDate {
  @Expose()
  type: number;

  @Expose()
  tag: string;

  @Expose()
  startDate: string;

  @Expose()
  endDate: string;

  constructor(type: number, tag: string, startDate: string, endDate: string) {
    this.type = type;
    this.tag = tag;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
