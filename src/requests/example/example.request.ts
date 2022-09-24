import { BaseDto } from '@core/dto/base.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ExampleRequest extends BaseDto {
  @IsNotEmpty()
  name: string;
}
