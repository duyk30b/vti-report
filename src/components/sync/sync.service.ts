import { ResponseCodeEnum } from '@core/response-code.enum';
import { ResponseBuilder } from '@core/utils/response-builder';
import { ResponsePayload } from '@core/utils/response-payload';
import { Inject, Injectable } from '@nestjs/common';
import { DailyItemLocatorStockRepository } from '@repositories/daily-item-locator-stock.repository';
import { DailyLotLocatorStockRepository } from '@repositories/daily-lot-locator-stock.repository';
import { DailyWarehouseItemStockRepository } from '@repositories/daily-warehouse-item-stock.repository';
import { ReportOrderItemLotRepository } from '@repositories/report-order-item-lot.repository';
import { ReportOrderItemRepository } from '@repositories/report-order-item.repository';
import { ReportOrderRepository } from '@repositories/report-order.repository';
import { TransactionItemRepository } from '@repositories/transaction-item.repository';
import {
  SyncDailyReportRequest,
  SyncDailyStockRequest,
} from '@requests/sync-daily.request';
import { SyncItemStockLocatorByDate } from '@requests/sync-item-stock-locator-by-date';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { SyncTransactionRequest } from '@requests/sync-transaction.request';
import mongoose from 'mongoose';
import { ClientSession, startSession, Connection } from 'mongoose';
import { ActionType } from '@enums/export-type.enum';
import { InjectConnection } from '@nestjs/mongoose';
import {
  PurchasedOrderImportRequestDto,
  SyncOrderRequest,
} from '@requests/sync-purchased-order-import.request';
import { ReportOrderInteface } from '@schemas/interface/report-order.interface';
import { OrderType } from '@enums/order-type.enum';
import { OrderStatus } from '@enums/order-status.enum';
import { ReportOrderItemInteface } from '@schemas/interface/report-order-item.interface';
import { ReportOrderItemLotInteface } from '@schemas/interface/report-order-item-lot.interface';
import {
  SaleOrderExportResponseDto,
  SyncSaleOrderExportRequest,
} from '@requests/sync-sale-order-export.request';
import {
  SyncWarehouseTransferRequest,
  WarehouseTransferResponseDto,
} from '@requests/sync-warehouse-transfer-request';
import { UserService } from '@components/user/user.service';
@Injectable()
export class SyncService {
  constructor(
    @Inject('DailyWarehouseItemStockRepository')
    private readonly dailyWarehouseItemStockRepository: DailyWarehouseItemStockRepository,

    @Inject('DailyItemLocatorStockRepository')
    private readonly dailyItemLocatorStockRepository: DailyItemLocatorStockRepository,

    @Inject('DailyLotLocatorStockRepository')
    private readonly dailyLotLocatorStockRepository: DailyLotLocatorStockRepository,

    @Inject('ReportOrderRepository')
    private readonly reportOrderRepository: ReportOrderRepository,

    @Inject('ReportOrderItemRepository')
    private readonly reportOrderItemRepository: ReportOrderItemRepository,

    @Inject('ReportOrderItemLotRepository')
    private readonly reportOrderItemLotRepository: ReportOrderItemLotRepository,

    @Inject('TransactionItemRepository')
    private readonly transactionItemRepository: TransactionItemRepository,

    private readonly i18n: I18nRequestScopeService,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,
  ) {}

  async syncDailyStock(
    request: SyncDailyStockRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      await Promise.all([
        this.dailyWarehouseItemStockRepository.createMany(
          request?.dailyWarehouseItems,
        ),
        this.dailyItemLocatorStockRepository.createMany(
          request?.dailyWarehouseItems,
        ),
        this.dailyLotLocatorStockRepository.createMany(
          request?.dailyWarehouseItems,
        ),
      ]);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (e) {
      console.log(e);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async syncSaleOrderExport(request: SyncSaleOrderExportRequest) {
    const company = await this.userService.getCompanies({
      code: request.data.syncCode,
    });

    if (company.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
        .build();
    }
    request.data['company'] = company?.data?.pop();

    switch (request.actionType) {
      case ActionType.create:
        return this.createSaleOrderExportFromDetail(request.data);
      case ActionType.update:
      case ActionType.confirm:
      case ActionType.reject:
      case ActionType.delete:
        return this.createSaleOrderExportFromDetail(request.data, true);
      default:
        break;
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.BAD_REQUEST)
      .withMessage(await this.i18n.translate('error.NOT_FOUND'))
      .build();
  }

  async syncWarehouseTransfer(request: SyncWarehouseTransferRequest) {
    const company = await this.userService.getCompanies({
      code: request.data.syncCode,
    });

    if (company.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
        .build();
    }
    request.data['company'] = company?.data?.pop();

    switch (request.actionType) {
      case ActionType.create:
        return this.createOrderFromWarehouseTransferDetailDetail(request.data);
      case ActionType.update:
      case ActionType.confirm:
      case ActionType.reject:
      case ActionType.delete:
        return this.createOrderFromWarehouseTransferDetailDetail(
          request.data,
          true,
        );
      default:
        break;
    }
  }

  async syncPurchasedOrderImport(request: SyncOrderRequest): Promise<any> {
    const company = await this.userService.getCompanies({
      code: request.data.syncCode,
    });

    if (company.statusCode !== ResponseCodeEnum.SUCCESS) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
        .build();
    }
    request.data['company'] = company?.data?.pop();
    switch (request.actionType) {
      case ActionType.create:
        return this.createOrderFromPurchasedOrderImportDetail(request.data);
      case ActionType.update:
      case ActionType.confirm:
      case ActionType.reject:
      case ActionType.delete:
        return this.createOrderFromPurchasedOrderImportDetail(
          request.data,
          true,
        );

      default:
        break;
    }

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.BAD_REQUEST)
      .withMessage(await this.i18n.translate('error.NOT_FOUND'))
      .build();
  }

  async createOrderFromWarehouseTransferDetailDetail(
    request: WarehouseTransferResponseDto,
    isUpdate = false,
  ) {
    if (isUpdate) {
      await Promise.all([
        this.reportOrderRepository.deleteAllByConditin({ orderId: request.id }),
        this.reportOrderItemRepository.deleteAllByConditin({
          orderId: request.id,
        }),
        this.reportOrderItemLotRepository.deleteAllByConditin({
          orderId: request.id,
        }),
      ]);
    }
    try {
      const promiseAll: any = [];
      const reportOrder: ReportOrderInteface = {
        orderId: request.id,
        orderCode: request.code,
        orderCreatedAt: request.createdAt,
        warehouseId: request?.sourceWarehouse?.id,
        warehouseCode: request?.sourceWarehouse?.code,
        warehouseName: request?.sourceWarehouse?.name,
        orderType: OrderType.TRANSFER,
        planDate: null,
        status: request.status,
        completedAt: request.createdAt,
        ebsNumber: request?.ebsNumber,
        companyId: request?.company?.id,
        companyName: request?.company?.name,
        companyAddress: request?.company?.address,
        constructionId: request?.constructions?.pop()?.id,
        constructionCode: request?.constructions?.pop()?.code,
        constructionName: request?.constructions?.pop()?.name,
        description: request.explanation,
      };

      promiseAll.push(this.reportOrderRepository.save(reportOrder));

      for (const item of request.itemsExport) {
        const reportOrderItem: ReportOrderItemInteface = {
          unit: item?.item.itemUnit,
          performerId: null,
          performerName: request.receiver,
          qrCode: null,
          warehouseTargetId: request?.destinationWarehouse?.id,
          warehouseTargetCode: request?.destinationWarehouse?.code,
          warehouseTargetName: request?.destinationWarehouse?.name,
          reason: request.reason.name,
          contract: null,
          providerId: null,
          providerCode: null,
          providerName: null,
          departmentReceiptId: request?.departmentReceipt?.id,
          departmentReceiptCode: request?.departmentReceipt?.code,
          departmentReceiptName: request?.departmentReceipt?.name,
          account: request?.source?.accountant,
          accountDebt: null,
          accountHave: null,
          warehouseExportProposals:
            request?.warehouseExportProposals?.pop()?.code,
          itemId: item?.id,
          itemName: item?.name,
          itemCode: item?.code,
          planQuantity: item?.planQuantity,
          actualQuantity: item?.actualQuantity,
          receivedQuantity: 0,
          storedQuantity: 0,
          collectedQuantity: 0,
          exportedQuantity: item?.exportedQuantity,
          storageCost: 0,
          ...reportOrder,
        };
        promiseAll.push(this.reportOrderItemRepository.save(reportOrderItem));

        for (const lot of item.lots) {
          const reportOrderItemLot: ReportOrderItemLotInteface = {
            ...reportOrderItem,
            lotNumber: lot?.lotNumber,
            explain: request?.explanation,
            note: request?.explanation,
            locatorName: null,
            locatorId: null,
            locatorCode: null,
          };
          promiseAll.push(
            this.reportOrderItemLotRepository.save(reportOrderItemLot),
          );
        }
      }

      await Promise.all(promiseAll);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async createOrderFromPurchasedOrderImportDetail(
    request: PurchasedOrderImportRequestDto,
    isUpdate = false,
  ) {
    if (isUpdate) {
      await Promise.all([
        this.reportOrderRepository.deleteAllByConditin({ orderId: request.id }),
        this.reportOrderItemRepository.deleteAllByConditin({
          orderId: request.id,
        }),
        this.reportOrderItemLotRepository.deleteAllByConditin({
          orderId: request.id,
        }),
      ]);
    }
    try {
      const promiseAll: any = [];
      const reportOrder: ReportOrderInteface = {
        orderId: request.id,
        orderCode: request.code,
        orderCreatedAt: request.receiptDate,
        warehouseId: request.warehouse.id,
        warehouseCode: request.warehouse.code,
        warehouseName: request.warehouse.name,
        orderType: OrderType.IMPORT,
        planDate: request.receiptDate,
        status: request.status,
        completedAt: request.receiptDate,
        ebsNumber: request?.ebsNumber,
        companyId: request.company.id,
        companyName: request.company.name,
        companyAddress: request.company.address,
        constructionId: request?.construction?.pop()?.id,
        constructionCode: request?.construction?.pop()?.code,
        constructionName: request?.construction?.pop()?.name,
        description: request.explanation,
      };

      promiseAll.push(this.reportOrderRepository.save(reportOrder));

      for (const item of request.purchasedOrderImportDetails) {
        const reportOrderItem: ReportOrderItemInteface = {
          unit: item?.item?.itemUnit,
          performerId: null,
          performerName: request?.deliver,
          qrCode: null,
          warehouseTargetId: null,
          warehouseTargetCode: null,
          warehouseTargetName: null,
          reason: request.reason.name,
          contract: null,
          providerId: request?.vendor?.id,
          providerCode: request?.vendor?.code,
          providerName: request?.vendor?.name,
          departmentReceiptId: request?.departmentReceipt?.id,
          departmentReceiptCode: request?.departmentReceipt?.code,
          departmentReceiptName: request?.departmentReceipt?.name,
          account: request?.source?.accountant,
          accountDebt: item?.debitAccount,
          accountHave: item?.creditAccount,
          warehouseExportProposals:
            request?.warehouseExportProposals?.pop()?.code,
          itemId: item?.itemId,
          itemName: item?.item?.name,
          itemCode: item?.item?.code,
          planQuantity: item?.quantity,
          actualQuantity: item?.actualQuantity,
          receivedQuantity: item?.receivedQuantity,
          storedQuantity: 0,
          collectedQuantity: 0,
          exportedQuantity: item?.exportableQuantity,
          storageCost: Number(item?.item?.price)
            ? Number(item?.item?.price)
            : 0,
          ...reportOrder,
        };
        promiseAll.push(this.reportOrderItemRepository.save(reportOrderItem));

        for (const lot of item.lots) {
          const reportOrderItemLot: ReportOrderItemLotInteface = {
            ...reportOrderItem,
            lotNumber: lot?.lotNumber,
            explain: request?.explanation,
            note: request?.explanation,
            locatorName: null,
            locatorId: null,
            locatorCode: null,
          };
          promiseAll.push(
            this.reportOrderItemLotRepository.save(reportOrderItemLot),
          );
        }
      }

      await Promise.all(promiseAll);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async createSaleOrderExportFromDetail(
    request: SaleOrderExportResponseDto,
    isUpdate = false,
  ) {
    if (isUpdate) {
      await Promise.all([
        this.reportOrderRepository.deleteAllByConditin({ orderId: request.id }),
        this.reportOrderItemRepository.deleteAllByConditin({
          orderId: request.id,
        }),
        this.reportOrderItemLotRepository.deleteAllByConditin({
          orderId: request.id,
        }),
      ]);
    }

    try {
      const promiseAll: any = [];
      const reportOrder: ReportOrderInteface = {
        orderId: request?.id,
        orderCode: request?.code,
        orderCreatedAt: request?.receiptDate,
        warehouseId: request?.warehouse?.id,
        warehouseCode: request?.warehouse?.code,
        warehouseName: request?.warehouse?.name,
        orderType: OrderType.EXPORT,
        planDate: request.receiptDate,
        status: request.status,
        completedAt: request.receiptDate,
        ebsNumber: request?.ebsNumber,
        companyId: request?.company?.id,
        companyName: request?.company?.name,
        companyAddress: request?.company?.address,
        constructionId: request?.constructions?.pop()?.id
          ? request?.constructions?.pop().id
          : null,
        constructionCode: request?.constructions?.pop()
          ? request?.constructions?.pop().code
          : null,
        constructionName: request?.constructions?.pop()
          ? request?.constructions?.pop().name
          : null,
        description: null,
      };

      promiseAll.push(this.reportOrderRepository.save(reportOrder));

      for (const item of request.itemsSync) {
        const reportOrderItem: ReportOrderItemInteface = {
          unit: item.itemUnit,
          performerId: null,
          performerName: request.receiver,
          qrCode: null,
          warehouseTargetId: null,
          warehouseTargetCode: null,
          warehouseTargetName: null,
          reason: request?.reason?.name,
          contract: null,
          providerId: null,
          providerCode: null,
          providerName: null,
          departmentReceiptId: null,
          departmentReceiptCode: null,
          departmentReceiptName: null,
          account: request?.source?.accountant,
          accountDebt: item?.debitAccount,
          accountHave: item?.creditAccount,
          warehouseExportProposals:
            request?.warehouseExportProposals?.pop()?.code,
          itemId: item.id,
          itemName: item.name,
          itemCode: item.code,
          planQuantity: item.quantity,
          actualQuantity: item.actualQuantity,
          receivedQuantity: 0,
          storedQuantity: 0,
          collectedQuantity: 0,
          exportedQuantity: item.actualQuantity,
          storageCost: Number(item?.item?.price || 0),
          ...reportOrder,
        };
        promiseAll.push(this.reportOrderItemRepository.save(reportOrderItem));

        for (const lot of item.lots) {
          const reportOrderItemLot: ReportOrderItemLotInteface = {
            ...reportOrderItem,
            lotNumber: lot.lotNumber,
            explain: request.explanation,
            note: request.explanation,
            locatorName: null,
            locatorId: null,
            locatorCode: null,
          };
          promiseAll.push(
            this.reportOrderItemLotRepository.save(reportOrderItemLot),
          );
        }
      }

      await Promise.all(promiseAll);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async syncTransaction(
    request: SyncTransactionRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      await this.transactionItemRepository.createOne(request);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (e) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async saveItemStockWarehouseLocatorByDate(
    data: SyncItemStockLocatorByDate[],
  ): Promise<any> {
    const itemStockLocatorEntities = data.map((dailyItemStockLocator) =>
      this.dailyItemLocatorStockRepository.createEntity(dailyItemStockLocator),
    );

    this.dailyItemLocatorStockRepository.create(itemStockLocatorEntities);
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }
}
