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
import { reportItemInventoryBelowMinimumWordMapping } from '@mapping/words/report-item-inventory-below-minium.word.mapping';
import { reportItemInventoryBelowSafeExcelMapping } from '@mapping/excels/report-item-inventory-below-safe.excel.mapping';
import { reportOrderTransferIncompletedExcelMapping } from '@mapping/excels/report-order-transfer-incompleted.excel.mapping';
import { reportOrderImportIncompletedExcelMapping } from '@mapping/excels/report-order-import-incompleted.excel.mapping';
import { reportItemImportedButNotPutToPositionExcelMapping } from '@mapping/excels/report-item-imported-but-not-put-to-position.excel.mapping';
import { reportOrderImportByRequestForItemExcelMapping } from '@mapping/excels/report-order-import-by-request-for-item.excel.mapping';
import { reportInventoryExcelMapping } from '@mapping/excels/report-Inventory.excel.mapping';
import { reportItemInventoryImportedNoQRCodeExcelMapping } from '@mapping/excels/report-item-Inventory-imported-no-qr-code.excel.mapping';
import { reportOrderExportIncompletedExcelMapping } from '@mapping/excels/report-order-export-incompleted.excel.mapping';
import { reportOrderExportByRequestForItem } from '@mapping/excels/report-order-export-by-request-for-item.excel.mapping';
import { reportItemInventoryBelowMinimumExcelMapping } from '@mapping/excels/report-item-inventory-below-minimum.excel.mapping';
import { reportSituationTransferExcelMapping } from '@mapping/excels/report-situation-transfer.excel.mapping';
import { reportSituationInventoryPeriodExcelMapping } from '@mapping/excels/report-situation-inventory-period.excel.mapping';
import { reportSituationImportPeriodExcelMapping } from '@mapping/excels/report-situation-import-period.excel.mapping';
import { reportSituationExportPeriodExcelMapping } from '@mapping/excels/report-situation-export-period.excel.mapping';
import { reportAgeOfItemsExcelMapping } from '@mapping/excels/report-age-of-items.excel.mapping';
import { reportItemInventoryExcelMapping } from '@mapping/excels/report-item-Inventory.excel.mapping';

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
          dataReturn = await this.reportItemInventory(request);

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
          dataReturn = await this.reportAgeOfItemStock(request);
          break;

        default:
          dataReturn = null;
          break;
      }

      if (!dataReturn)
        return new ResponseBuilder<any>()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.NOT_FOUND'))
          .build();
      return new ResponseBuilder<any>(dataReturn)
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage('success')
        .build();
    } catch (e) {
      return new ResponseBuilder<any>(e)
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async reportAgeOfItemStock(request: ReportRequest): Promise<ReportResponse> {
    const data =
      await this.dailyLotLocatorStockRepository.getReportAgeOfItemStock(
        request,
      );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } = await reportAgeOfItemsExcelMapping(
          request,
          data,
          this.i18n,
        );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportSituationExportPeriod(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data =
      await this.reportOrderItemLotRepository.getReportsGroupByWarehouse(
        request,
        OrderType.EXPORT,
      );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportSituationExportPeriodExcelMapping(
            request,
            data,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportSituationImportPeriod(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data =
      await this.reportOrderItemLotRepository.getReportsGroupByWarehouse(
        request,
        OrderType.IMPORT,
      );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportSituationImportPeriodExcelMapping(
            request,
            data,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportSituationInventoryPeriod(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data =
      await this.reportOrderItemLotRepository.getReportsGroupByWarehouse(
        request,
        OrderType.INVENTORY,
      );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportSituationInventoryPeriodExcelMapping(
            request,
            data,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportSituationTransfer(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data =
      await this.reportOrderItemLotRepository.getReportsGroupByWarehouse(
        request,
        OrderType.TRANSFER,
      );
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportSituationTransferExcelMapping(request, data, this.i18n);
        return { result: dataBase64, nameFile };
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
        const { nameFile, dataBase64 } =
          await reportOrderExportByRequestForItem(request, data, this.i18n);
        return { result: dataBase64, nameFile };
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
        const { nameFile, dataBase64 } =
          await reportItemInventoryImportedNoQRCodeExcelMapping(
            request,
            data,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportItemInventory(request: ReportRequest): Promise<ReportResponse> {
    const data =
      await this.dailyLotLocatorStockRepository.getReportItemInventory(request);
    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } = await reportItemInventoryExcelMapping(
          request,
          this.i18n,
          data,
        );
        return { result: dataBase64, nameFile };
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
        const { nameFile, dataBase64 } =
          await reportOrderImportByRequestForItemExcelMapping(
            request,
            data,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
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
        const { nameFile, dataBase64 } = await reportInventoryExcelMapping(
          request,
          data,
          this.i18n,
        );
        return { result: dataBase64, nameFile };
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
        const { nameFile, dataBase64 } =
          await reportItemImportedButNotPutToPositionExcelMapping(
            request,
            data,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }

  async reportOrderImportIncompleted(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    const data = await this.reportOrderItemRepository.getReports(
      request,
      OrderType.IMPORT,
    );

    if (!data.length) return;
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportOrderImportIncompletedExcelMapping(
            request,
            data,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
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
        const { nameFile, dataBase64 } =
          await reportOrderExportIncompletedExcelMapping(
            request,
            data,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
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
        const { nameFile, dataBase64 } =
          await reportOrderTransferIncompletedExcelMapping(
            request,
            data,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
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
        const { nameFile, dataBase64 } =
          await reportItemInventoryBelowMinimumExcelMapping(
            request,
            data,
            this.i18n,
          );
        return { result: dataBase64, nameFile };

      case ExportType.WORD:
        return reportItemInventoryBelowMinimumWordMapping(request, data);
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
        const { nameFile, dataBase64 } =
          await reportItemInventoryBelowSafeExcelMapping(
            request,
            data,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return;
      default:
        return;
    }
  }
}
