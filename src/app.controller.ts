import { Public } from '@core/decorator/set-public.decorator';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('/health')
  getHealth(): string {
    return this.appService.getHealth();
  }
}
