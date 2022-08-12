import { IsInt, IsOptional } from 'class-validator';

export class BaseDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  request: any;

  responseError: any;
}
