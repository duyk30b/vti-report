import { Expose } from 'class-transformer';

export class ExampleResponse {
  @Expose()
  id: number;
}
