import { ResponsePayload } from '@core/utils/response-payload';
import { SuccessResponse } from '@core/utils/success.response.dto';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportRequest } from '../../requests/report.request';
import { isEmpty } from 'lodash';
import { ReportResponse } from '../../responses/report.response';
import { ExportService } from './export.service';

@Controller('')
export class ExportController {
  constructor(
    @Inject('ExportService')
    private readonly exportService: ExportService,
  ) {}

  @Post('/export')
  @ApiOperation({
    tags: ['export'],
    summary: 'Export file',
    description: 'Export file',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: SuccessResponse,
  })
  getReport(
    @Body() payload: ReportRequest,
  ): Promise<ResponsePayload<ReportResponse>> {
    const { request, responseError } = payload;

    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }

    return this.exportService.getReport(request);
  }
}
