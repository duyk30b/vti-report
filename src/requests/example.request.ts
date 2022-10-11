import { BaseDto } from '@core/dto/base.dto';
import { IsNotEmpty } from 'class-validator';

export class ExampleRequest extends BaseDto {
  @IsNotEmpty()
  name: string;
}
