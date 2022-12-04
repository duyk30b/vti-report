import isEmpty from '@core/utils/helper';
import { SuccessResponse } from '@core/utils/success.response.dto';
import { ExportType } from '@enums/export-type.enum';
import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReportRequest } from '@requests/report.request';
import { ExportService } from './export.service';
import * as contentDisposition from 'content-disposition';
import { Response } from 'express';
import { ResponseBuilder } from '@core/utils/response-builder';
import { ResponseCodeEnum } from '@core/response-code.enum';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { Public } from '@core/decorator/set-public.decorator';
@Controller('')
export class ExportController {
  constructor(
    @Inject('ExportService')
    private readonly exportService: ExportService,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  @Public()
  @Get('/export')
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
  async getReport(
    @Res({ passthrough: true }) res: Response,
    @Query() payload: ReportRequest,
  ): Promise<any> {
    const { request, responseError } = payload;
    if (responseError && !isEmpty(responseError)) {
      return responseError;
    }
    const result = await this.exportService.getReport(request);
    if (!result['error']) {
      let nameFile =
        request.exportType === ExportType.EXCEL
          ? result.nameFile + '.xlsx'
          : result.nameFile + '.docx';
      nameFile = encodeURIComponent(nameFile);
      res.header('Content-Disposition', contentDisposition(nameFile));
      res.header('Access-Control-Expose-Headers', '*');
      return new StreamableFile(result.result);
    }
    return new ResponseBuilder<any>()
      .withCode(ResponseCodeEnum.NOT_FOUND)
      .withData(result)
      .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
      .build();
  }
}
