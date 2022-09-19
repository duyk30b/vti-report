import { Inject, Injectable } from '@nestjs/common';
import { ReportRequest } from '../../requests/report.request';
import { ReportResponse } from '../../responses/report.response';
import { ReportType } from '@enums/report-type.enum';
import { ResponsePayload } from '@core/utils/response-payload';
import { ResponseBuilder } from '@core/utils/response-builder';
import { ResponseCodeEnum } from '@core/response-code.enum';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DailyLotLocatorStockRepository } from '@repositories/daily-lot-locator-stock.repository';
import { ReportOrderItemLotRepository } from '@repositories/report-order-item-lot.repository';
import { OrderType } from '@enums/order-type.enum';
import { DATE_FOMAT, MONTHS, YEARS } from '@utils/constant';
import * as moment from 'moment';
import { DailyWarehouseItemStockRepository } from '@repositories/daily-warehouse-item-stock.repository';
import { ExportType } from '@enums/export-type.enum';
import { ReportOrderItemRepository } from '@repositories/report-order-item.repository';

@Injectable()
export class ExportService {
  constructor(
    @Inject(DailyLotLocatorStockRepository.name)
    private dailyLotLocatorStockRepository: DailyLotLocatorStockRepository,

    @Inject(DailyWarehouseItemStockRepository.name)
    private dailyWarehouseItemStockRepository: DailyWarehouseItemStockRepository,

    @Inject(ReportOrderItemLotRepository.name)
    private reportOrderItemLotRepository: ReportOrderItemLotRepository,

    @Inject(ReportOrderItemRepository.name)
    private reportOrderItemRepository: ReportOrderItemRepository,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async getReport(
    request: ReportRequest,
  ): Promise<ResponsePayload<ReportResponse>> {
    console.log(112312);

    try {
      let dataReturn;
      switch (request.reportType) {
        case ReportType.ITEM_INVENTORY_BELOW_MINIMUM:
          dataReturn = await this.reportItemInventoryBelowMinimum(request);
          break;

        case ReportType.ITEM_INVENTORY_BELOW_SAFE:
          dataReturn = await this.reportItemInventoryBelowSafe(request);
          break;

        case ReportType.ORDER_TRANSFER_INCOMPLETED:
          dataReturn = await this.reportOrderTransferIncompleted(request);
          break;

        case ReportType.ORDER_EXPORT_INCOMPLETED:
          dataReturn = await this.reportOrderExportIncompleted(request);
          break;

        case ReportType.ORDER_IMPORT_INCOMPLETED:
          dataReturn = await this.reportOrderImportIncompleted(request);
          break;

        case ReportType.ITEM_IMPORTED_BUT_NOT_PUT_TO_POSITION:
          dataReturn = await this.reportItemImportedButNotPutToPosition(
            request,
          );
          break;

        case ReportType.ITEM_INVENTORY:
          dataReturn = await this.reportItemInventory(request); // do later -------------------

          break;

        case ReportType.ORDER_IMPORT_BY_REQUEST_FOR_ITEM:
          dataReturn = await this.reportOrderImportByRequestForItem(request);
          break;

        case ReportType.INVENTORY:
          dataReturn = await this.reportInventory(request);
          break;

        case ReportType.ITEM_INVENTORY_IMPORTED_NO_QR_CODE:
          dataReturn = await this.reportItemInventoryImportedNoQRCode(request);
          break;

        case ReportType.ORDER_EXPORT_BY_REQUEST_FOR_ITEM:
          dataReturn = await this.reportOrderExportByRequestForItem(request);
          break;

        case ReportType.SITUATION_TRANSFER:
          dataReturn = await this.reportSituationTransfer(request);
          break;

        case ReportType.SITUATION_INVENTORY_PERIOD:
          dataReturn = await this.reportSituationInventoryPeriod(request);
          break;

        case ReportType.SITUATION_IMPORT_PERIOD:
          dataReturn = await this.reportSituationImportPeriod(request);
          break;
        case ReportType.SITUATION_EXPORT_PERIOD:
          dataReturn = await this.reportSituationExportPeriod(request);
          break;

        case ReportType.AGE_OF_ITEM_STOCK:
          dataReturn = await this.reportAgeOfItemStock(request); // -----------
          break;

        default:
          dataReturn = null;
          break;
      }

      if (!dataReturn)
        return new ResponseBuilder<any>('data not found!')
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
          .build();
      return new ResponseBuilder<any>(dataReturn)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('success')
        .build();
    } catch (e) {
      console.log(e);

      return new ResponseBuilder<any>(e)
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async reportAgeOfItemStock(request: ReportRequest): Promise<ReportResponse> {
    const sixMonthAgo = moment().subtract(6, MONTHS).format(DATE_FOMAT);
    const oneYearAgo = moment().subtract(1, YEARS).format(DATE_FOMAT);
    const twoYearAgo = moment().subtract(1, YEARS).format(DATE_FOMAT);
    const threeYearAgo = moment().subtract(1, YEARS).format(DATE_FOMAT);
    const fourYearAgo = moment().subtract(1, YEARS).format(DATE_FOMAT);
    const fiveYearAgo = moment().subtract(1, YEARS).format(DATE_FOMAT);

    const [
      dataSixMonth,
      dataSixMonthToOneYear,
      dataOneYearToTwoYear,
      dataTwoYearToTwoYear,
      dataThreeYearToTwoYear,
      dataFourYearToTwoYear,
      dataFiveYear,
    ] = await Promise.all([
      this.dailyLotLocatorStockRepository.getReportAgeOfItemStock(
        request,
        sixMonthAgo,
        null,
      ),
      this.dailyLotLocatorStockRepository.getReportAgeOfItemStock(
        request,
        oneYearAgo,
        sixMonthAgo,
      ),
      this.dailyLotLocatorStockRepository.getReportAgeOfItemStock(
        request,
        twoYearAgo,
        oneYearAgo,
      ),
      this.dailyLotLocatorStockRepository.getReportAgeOfItemStock(
        request,
        threeYearAgo,
        twoYearAgo,
      ),
      this.dailyLotLocatorStockRepository.getReportAgeOfItemStock(
        request,
        fourYearAgo,
        threeYearAgo,
      ),
      this.dailyLotLocatorStockRepository.getReportAgeOfItemStock(
        request,
        fiveYearAgo,
        fourYearAgo,
      ),
      this.dailyLotLocatorStockRepository.getReportAgeOfItemStock(
        request,
        null,
        fiveYearAgo,
      ),
    ]);

    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportSituationExportPeriod(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemLotRepository.getReports(
      request,
      OrderType.EXPORT,
    );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportSituationImportPeriod(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemLotRepository.getReports(
      request,
      OrderType.IMPORT,
    );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportSituationInventoryPeriod(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemLotRepository.getReports(
      request,
      OrderType.INVENTORY,
    );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportSituationTransfer(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemLotRepository.getReports(
      request,
      OrderType.TRANSFER,
    );

    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportOrderExportByRequestForItem(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemRepository.getReports(
      request,
      OrderType.EXPORT,
    );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportItemInventoryImportedNoQRCode(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemLotRepository.getReports(
      request,
      OrderType.IMPORT,
    );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportItemInventory(request: ReportRequest): Promise<ReportResponse> {
    const dataInventoryFrom =
      await this.dailyLotLocatorStockRepository.getReportsByDate(
        request,
        request?.dateFrom,
      );
    const dataInventoryTo =
      await this.dailyLotLocatorStockRepository.getReportsByDate(
        request,
        request?.dateTo,
      );
    const dataImport = await this.reportOrderItemLotRepository.getReports(
      request,
      OrderType.IMPORT,
    );
    const dataExport = await this.reportOrderItemLotRepository.getReports(
      request,
      OrderType.EXPORT,
    );

    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportOrderImportByRequestForItem(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemRepository.getReports(
      request,
      OrderType.IMPORT,
    );

    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportInventory(request: ReportRequest): Promise<ReportResponse> {
    const data = await this.dailyLotLocatorStockRepository.getReports(request);
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportItemImportedButNotPutToPosition(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemLotRepository.getReports(
      request,
      OrderType.IMPORT,
    );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportOrderImportIncompleted(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemLotRepository.getReports(
      request,
      OrderType.IMPORT,
    );

    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportOrderExportIncompleted(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemRepository.getReports(
      request,
      OrderType.EXPORT,
    );

    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportOrderTransferIncompleted(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemRepository.getReports(
      request,
      OrderType.TRANSFER,
    );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportItemInventoryBelowMinimum(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.dailyWarehouseItemStockRepository.getReports(
      request,
    );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportItemInventoryBelowSafe(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.dailyWarehouseItemStockRepository.getReports(
      request,
    );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        return;
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }
}
