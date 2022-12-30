import { Inject, Injectable, Logger } from '@nestjs/common';
import { ReportRequest } from '../../requests/report.request';
import { ReportResponse } from '../../responses/report.response';
import { ReportType } from '@enums/report-type.enum';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { DailyLotLocatorStockRepository } from '@repositories/daily-lot-locator-stock.repository';
import { ReportOrderItemLotRepository } from '@repositories/report-order-item-lot.repository';
import { OrderType } from '@enums/order-type.enum';
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
import { reportItemInventoryBelowSafeWordMapping } from '@mapping/words/report-item-inventory-below-safe.word.mapping';
import { reportOrderTransferIncompletedWordMapping } from '@mapping/words/report-order-transfer-incompleted.word.mapping';
import { reportOrderExportIncompletedWordMapping } from '@mapping/words/report-order-export-incompleted.word.mapping';
import { reportOrderImportIncompletedMapping } from '@mapping/words/report-order-import-incompleted.word.mapping';
import { reportItemImportedButNotPutToPositionMapping } from '@mapping/words/report-item-imported-but-not-put-to-position.word.mapping';
import { reportOrderImportByRequestForItemWordMapping } from '@mapping/words/report-order-import-by-request-for-item.word.mapping';
import { reportInventoryMapping } from '@mapping/words/report-inventory.word.mapping';
import { reportItemInventoryImportedNoQRCodeWordMapping } from '@mapping/words/report-item-inventory-imported-noQR-code.word.mapping';
import { reportOrderExportByRequestForItemWordMapping } from '@mapping/words/report-order-export-by-request-for-item.word.mapping';
import { reportItemInventoryMapping } from '@mapping/words/report-item-inventory.word.mapping';
import { reportSituationImportPeriodMapping } from '@mapping/words/report-situation-import-period.mapping';
import { reportSituationTransferMapping } from '@mapping/words/report-situation-transfer.word.mapping';
import { reportSituationExportPeriodMapping } from '@mapping/words/report-situation-export-period.mapping';
import { reportAgeOfItemsMapping } from '@mapping/words/report-age-of-item-stock.mapping';
import { reportSituationInventoryPeriodMapping } from '@mapping/words/report-situation-inventory-period.mapping';
import { getItemInventoryDataMapping } from '@mapping/common/Item-inventory-mapped';
import { getSituationTransfer } from '@mapping/common/situation-transfer-mapped';
import { getInventoryDataMapping } from '@mapping/common/inventory-mapped';
import { getItemInventoryBelowMinimum } from '@mapping/common/Item-inventory-below-minimum-mapped';
import { getItemInventoryBelowSafe } from '@mapping/common/item-inventory-below-safe';
import { getOrderTransferIncompletedMapped } from '@mapping/common/order-transfer-incompleted-mapped';
import { getOrderExportIncompletedMapped } from '@mapping/common/order-export-incompleted.mapped';
import { getOrderImportIncompletedMapped } from '@mapping/common/order-import-incompleted.mapped';
import { getItemImportedButNotPutToPositionMapped } from '@mapping/common/item-imported-but-not-put-to-position';
import { getItemInventoryImportedNoQRCodeMapping } from '@mapping/common/item-inventory-imported-no-qr-code-mapped';
import { getOrderExportByRequestForItemMapped } from '@mapping/common/report-order-export-by-request-for-item.mapped';
import { getOrderImportByRequestForItemMapped } from '@mapping/common/report-order-import-by-request-for-item.mapped';
import { getSituationInventoryPeriod } from '@mapping/common/report-situation-inventory-period.excel.mapped';
import { getSituationImportPeriod } from '@mapping/common/report-situation-import-period.excel.mapped';
import { getSituationExportPeriodMapped } from '@mapping/common/report-situation-export-period.excel.mapped';
import { getSituationTransferMapped } from '@mapping/common/age-of-item-mapped';
import { TransactionItemRepository } from '@repositories/transaction-item.repository';
import { UserService } from '@components/user/user.service';
import { WarehouseServiceInterface } from '@components/warehouse/interface/warehouse.service.interface';
import { getTimezone } from '@utils/common';
import { FORMAT_DATE } from '@utils/constant';
import { readDecimal } from '@constant/common';
@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);
  constructor(
    @Inject(DailyLotLocatorStockRepository.name)
    private dailyLotLocatorStockRepository: DailyLotLocatorStockRepository,

    @Inject(DailyWarehouseItemStockRepository.name)
    private dailyWarehouseItemStockRepository: DailyWarehouseItemStockRepository,

    @Inject(ReportOrderItemLotRepository.name)
    private reportOrderItemLotRepository: ReportOrderItemLotRepository,

    @Inject(ReportOrderItemRepository.name)
    private reportOrderItemRepository: ReportOrderItemRepository,

    @Inject(TransactionItemRepository.name)
    private transactionItemRepository: TransactionItemRepository,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,

    @Inject('WarehouseServiceInterface')
    private readonly warehouseServiceInterface: WarehouseServiceInterface,

    private readonly i18n: I18nRequestScopeService,
  ) {}

  async getReport(request: ReportRequest): Promise<ReportResponse> {
    let dataReturn;
    try {
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
      return dataReturn;
    } catch (e) {
      console.log(e);
      return { error: e } as any;
    }
  }

  async reportAgeOfItemStock(request: ReportRequest): Promise<ReportResponse> {
    const data =
      await this.dailyLotLocatorStockRepository.getReportAgeOfItemStock(
        request,
      );
    await this.getInfoWarehouse(request, data, true);
    const dataMapped = getSituationTransferMapped(data, this.i18n);
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } = await reportAgeOfItemsExcelMapping(
          request,
          dataMapped,
          this.i18n,
        );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportAgeOfItemsMapping(request, dataMapped, this.i18n);
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
    await this.getInfoWarehouse(request, data, true);
    const dataMapped = getSituationExportPeriodMapped(data, this.i18n);
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportSituationExportPeriodExcelMapping(
            request,
            dataMapped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportSituationExportPeriodMapping(
          request,
          dataMapped,
          this.i18n,
        );
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
    await this.getInfoWarehouse(request, data, true);

    const dataMapped = getSituationImportPeriod(data, this.i18n);

    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportSituationImportPeriodExcelMapping(
            request,
            dataMapped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportSituationImportPeriodMapping(
          request,
          dataMapped,
          this.i18n,
        );
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
    let isEmpty = await this.getInfoWarehouse(request, data, true);
    const dataMaped = getSituationInventoryPeriod(data, this.i18n, isEmpty);
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportSituationInventoryPeriodExcelMapping(
            request,
            dataMaped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportSituationInventoryPeriodMapping(
          request,
          dataMaped,
          this.i18n,
        );
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
    await this.getInfoWarehouse(request, data, true);

    const dataMapped = getSituationTransfer(data, this.i18n);
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportSituationTransferExcelMapping(
            request,
            dataMapped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportSituationTransferMapping(request, dataMapped, this.i18n);
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
    let isEmpty = await this.getInfoWarehouse(request, data);

    const dataMapped = getOrderExportByRequestForItemMapped(
      data,
      this.i18n,
      isEmpty,
    );
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportOrderExportByRequestForItem(
            request,
            dataMapped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportOrderExportByRequestForItemWordMapping(
          request,
          dataMapped,
          this.i18n,
        );
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

    const dataMapped = getItemInventoryImportedNoQRCodeMapping(data, this.i18n);
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportItemInventoryImportedNoQRCodeExcelMapping(
            request,
            dataMapped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportItemInventoryImportedNoQRCodeWordMapping(
          request,
          dataMapped,
          this.i18n,
        );
      default:
        return;
    }
  }

  async reportItemInventory(request: ReportRequest): Promise<ReportResponse> {
    const curDate = getTimezone(undefined, FORMAT_DATE);

    const dailyLotLocatorStock =
      await this.dailyLotLocatorStockRepository.getReportItemInventory(request);

    const transactionItemInCurDate =
      await this.transactionItemRepository.groupByItemLot(request);

    let keyByDailyItem = dailyLotLocatorStock.reduce((prev, cur) => {
      const key = [
        cur?.companyCode,
        cur?.warehouseCode,
        cur?.itemCode,
        cur?.lotNumber,
      ].join('_');
      if (!prev[key]) {
        prev[key] = cur;
      } else {
        const item = prev[key];
        item.storageCost += cur.storageCost;
        item.stockStart += cur.stockStart;
        item.totalStockStart += cur.totalStockStart;
        item.stockEnd += cur.stockEnd;
        item.totalStockEnd += cur.totalStockEnd;
      }
      return prev;
    }, {});
    //case item new in transaction
    if (transactionItemInCurDate.length) {
      for (const transactionItem of transactionItemInCurDate) {
        const key = [
          transactionItem?.companyCode,
          transactionItem?.warehouseCode,
          transactionItem?.itemCode,
          transactionItem?.lotNumber,
        ].join('_');
        if (keyByDailyItem[key]) {
          const dailyItem = keyByDailyItem[key];
          if (request?.dateFrom === curDate && request?.dateTo === curDate) {
            dailyItem.stockEnd += transactionItem?.quantityImportedCurDate || 0;
            dailyItem.stockEnd -= transactionItem?.quantityExportedCurDate || 0;
            dailyItem.totalStockEnd =
              dailyItem.stockEnd * dailyItem.storageCost;

            dailyItem.importIn = transactionItem?.quantityImportedCurDate || 0;
            dailyItem.exportIn = transactionItem?.quantityExportedCurDate || 0;

            dailyItem.totalImportIn =
              dailyItem.storageCost *
                transactionItem?.quantityImportedCurDate || 0;
            dailyItem.totalExportIn =
              dailyItem.storageCost *
                transactionItem?.quantityExportedCurDate || 0;
          } else {
            if (request?.dateFrom === curDate) {
              dailyItem.stockStart +=
                transactionItem?.quantityImportedCurDate || 0;
              dailyItem.stockStart -=
                transactionItem?.quantityExportedCurDate || 0;
              dailyItem.totalStockStart =
                dailyItem.stockStart * dailyItem.storageCost;
            }

            if (request?.dateTo === curDate) {
              dailyItem.stockEnd +=
                transactionItem?.quantityImportedCurDate || 0;
              dailyItem.stockEnd -=
                transactionItem?.quantityExportedCurDate || 0;
              dailyItem.totalStockEnd =
                dailyItem.stockEnd * dailyItem.storageCost;
            }
            dailyItem.importIn = transactionItem?.quantityImported || 0;
            dailyItem.exportIn = transactionItem?.quantityExported || 0;

            dailyItem.totalImportIn =
              dailyItem.storageCost * transactionItem?.quantityImported || 0;
            dailyItem.totalExportIn =
              dailyItem.storageCost * transactionItem?.quantityExported || 0;
          }
        } else if (!keyByDailyItem[key]) {
          if (request?.dateFrom === curDate && request?.dateTo === curDate) {
            transactionItem.stockEnd = 0;
            transactionItem.stockEnd += transactionItem?.quantityImported || 0;
            transactionItem.stockEnd -= transactionItem?.quantityExported || 0;
            transactionItem.totalStockEnd =
              transactionItem.stockEnd * transactionItem.storageCost;
          } else {
            transactionItem.stockEnd = transactionItem?.quantityImported || 0;
            transactionItem.stockEnd -= transactionItem?.quantityExported || 0;
            transactionItem.totalStockEnd =
              transactionItem.stockEnd * transactionItem.storageCost;
          }

          transactionItem.importIn = transactionItem?.quantityImported || 0;
          transactionItem.exportIn = transactionItem?.quantityExported || 0;

          transactionItem.totalImportIn =
            transactionItem.storageCost * transactionItem?.quantityImported ||
            0;
          transactionItem.totalExportIn =
            transactionItem.storageCost * transactionItem?.quantityExported ||
            0;
          keyByDailyItem[key] = transactionItem;
        }
      }
    }
      for(const key in keyByDailyItem) {                      
        keyByDailyItem[key].importIn = readDecimal(keyByDailyItem[key]?.importIn);
        keyByDailyItem[key].exportIn = readDecimal(keyByDailyItem[key]?.exportIn);
        keyByDailyItem[key].storageCost = readDecimal(keyByDailyItem[key]?.storageCost);
        keyByDailyItem[key].stockStart = readDecimal(keyByDailyItem[key]?.stockStart, true);
        keyByDailyItem[key].totalStockStart = readDecimal(keyByDailyItem[key]?.totalStockStart);
        keyByDailyItem[key].stockEnd = readDecimal(keyByDailyItem[key]?.stockEnd, true);
        keyByDailyItem[key].totalStockEnd = readDecimal(keyByDailyItem[key]?.totalStockEnd);
        keyByDailyItem[key].totalExportIn = readDecimal(keyByDailyItem[key]?.totalExportIn);
        keyByDailyItem[key].totalImportIn = readDecimal(keyByDailyItem[key]?.totalImportIn);
      }
    const data = Object.values(keyByDailyItem);

    let isEmpty = await this.getInfoWarehouse(request, data);
    const dataMapping = getItemInventoryDataMapping(data, this.i18n, isEmpty);
    this.logger.error('dataMapping', dataMapping);
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } = await reportItemInventoryExcelMapping(
          request,
          this.i18n,
          dataMapping,
        );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportItemInventoryMapping(request, dataMapping, this.i18n);
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
    const dataMapped = getOrderImportByRequestForItemMapped(data, this.i18n);

    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportOrderImportByRequestForItemExcelMapping(
            request,
            dataMapped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportOrderImportByRequestForItemWordMapping(
          request,
          dataMapped,
          this.i18n,
        );
      default:
        return;
    }
  }

  async reportInventory(request: ReportRequest): Promise<ReportResponse> {
    let data = await this.dailyLotLocatorStockRepository.getReports(request);
    data = await this.transactionItemRepository.updateQuantityItem(
      request,
      data,
    );
    const dataMaped = getInventoryDataMapping(data, this.i18n);
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } = await reportInventoryExcelMapping(
          request,
          dataMaped,
          this.i18n,
        );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportInventoryMapping(request, dataMaped, this.i18n);
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
    await this.getInfoWarehouse(request, data, true);
    const dataMapped = getItemImportedButNotPutToPositionMapped(
      data,
      this.i18n,
    );
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportItemImportedButNotPutToPositionExcelMapping(
            request,
            dataMapped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportItemImportedButNotPutToPositionMapping(
          request,
          dataMapped,
          this.i18n,
        );
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
    let isEmpty = await this.getInfoWarehouse(request, data);

    const dataMapped = getOrderImportIncompletedMapped(
      data,
      this.i18n,
      isEmpty,
    );

    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportOrderImportIncompletedExcelMapping(
            request,
            dataMapped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportOrderImportIncompletedMapping(
          request,
          dataMapped,
          this.i18n,
        );
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
    let isEmpty = await this.getInfoWarehouse(request, data);
    const dataMapped = getOrderExportIncompletedMapped(
      data,
      this.i18n,
      isEmpty,
    );
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportOrderExportIncompletedExcelMapping(
            request,
            dataMapped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportOrderExportIncompletedWordMapping(
          request,
          dataMapped,
          this.i18n,
        );
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
    let isEmpty = await this.getInfoWarehouse(request, data);
    const dataMapped = getOrderTransferIncompletedMapped(
      data,
      this.i18n,
      isEmpty,
    );
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportOrderTransferIncompletedExcelMapping(
            request,
            dataMapped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportOrderTransferIncompletedWordMapping(
          request,
          dataMapped,
          this.i18n,
        );
      default:
        return;
    }
  }

  async reportItemInventoryBelowMinimum(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    let data = await this.dailyWarehouseItemStockRepository.getReports(request);
    data = await this.transactionItemRepository.updateQuantityItem(
      request,
      data,
    );
    let isEmpty = await this.getInfoWarehouse(request, data);

    const dataMapped = getItemInventoryBelowMinimum(data, this.i18n, isEmpty);
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportItemInventoryBelowMinimumExcelMapping(
            request,
            dataMapped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };

      case ExportType.WORD:
        return reportItemInventoryBelowMinimumWordMapping(
          request,
          dataMapped,
          this.i18n,
        );
    }
  }

  async reportItemInventoryBelowSafe(
    request: ReportRequest,
  ): Promise<ReportResponse> {
    let data = await this.dailyWarehouseItemStockRepository.getReports(request);
    data = await this.transactionItemRepository.updateQuantityItem(
      request,
      data,
    );
    let isEmpty = await this.getInfoWarehouse(request, data);
    const dataMaped = getItemInventoryBelowSafe(data, this.i18n, isEmpty);
    switch (request.exportType) {
      case ExportType.EXCEL:
        const { nameFile, dataBase64 } =
          await reportItemInventoryBelowSafeExcelMapping(
            request,
            dataMaped,
            this.i18n,
          );
        return { result: dataBase64, nameFile };
      case ExportType.WORD:
        return reportItemInventoryBelowSafeWordMapping(
          request,
          dataMaped,
          this.i18n,
        );
      default:
        return;
    }
  }

  private async getInfoWarehouse(
    request: ReportRequest,
    data: any,
    parentObject?: boolean,
  ) {
    let isEmpty = false;
    if (!data.length) {
      let company = await this.userService.getCompanies({
        code: request.companyCode,
      });

      let warehouse = '';
      if (request.warehouseCode) {
        const warehouseHq =
          await this.warehouseServiceInterface.getWarehouseByCode(
            request.warehouseCode,
          );
        if (warehouseHq) warehouse = warehouseHq?.name || '';
      }

      company = company?.data?.pop();
      if (parentObject) {
        data.push({
          _id: {
            companyCode: company?.code,
            companyName: company?.name?.toUpperCase() || '',
            companyAddress: company?.address,
            warehouseName: warehouse,
          },
        } as any);
      } else {
        data.push({
          companyCode: company?.code,
          companyName: company?.name?.toUpperCase() || '',
          companyAddress: company?.address,
          warehouseName: warehouse,
        } as any);
      }
      isEmpty = true;
    }
    return isEmpty;
  }
}
