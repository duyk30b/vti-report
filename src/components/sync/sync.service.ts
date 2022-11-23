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
import { SyncDailyStockRequest } from '@requests/sync-daily.request';
import { SyncItemStockLocatorByDate } from '@requests/sync-item-stock-locator-by-date';
import { I18nRequestScopeService } from 'nestjs-i18n';
import {
  SyncTransactionRequest,
  TransactionRequest,
} from '@requests/sync-transaction.request';
import { ActionType } from '@enums/export-type.enum';
import {
  PurchasedOrderImportRequestDto,
  SyncPurchasedOrderRequest,
} from '@requests/sync-purchased-order-import.request';
import { ReportOrderInteface } from '@schemas/interface/report-order.interface';
import { OrderType } from '@enums/order-type.enum';
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
import { Orders, SyncOrderRequest } from '@requests/sync-order.request';
import { TransactionItemInterface } from '@schemas/interface/TransactionItem.Interface';
import { isEmpty } from 'lodash';
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
      const company = await this.userService.getCompanies({
        code: request?.dailyWarehouseItems[0]?.syncCode,
      });

      if (
        company?.statusCode !== ResponseCodeEnum.SUCCESS ||
        isEmpty(company.data)
      ) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
          .build();
      }

      const temp = company?.data?.pop();
      for (const item of request?.dailyWarehouseItems) {
        item.companyName = temp.name;
        item.companyCode = temp.code;
        item.companyAddress = temp.address;
      }

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
      code: request?.data?.syncCode,
    });

    if (
      company?.statusCode !== ResponseCodeEnum.SUCCESS ||
      isEmpty(company.data)
    ) {
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
      code: request?.data?.syncCode,
    });

    if (
      company?.statusCode !== ResponseCodeEnum.SUCCESS ||
      isEmpty(company.data)
    ) {
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

  async syncPurchasedOrderImport(
    request: SyncPurchasedOrderRequest,
  ): Promise<any> {
    const company = await this.userService.getCompanies({
      code: request?.data?.syncCode,
    });

    if (
      company?.statusCode !== ResponseCodeEnum.SUCCESS ||
      isEmpty(company.data)
    ) {
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
    try {
      const order: ReportOrderInteface[] = [];
      const orderItem: ReportOrderItemInteface[] = [];
      const orderItemLot: ReportOrderItemLotInteface[] = [];

      const reportOrder: ReportOrderInteface = {
        orderCode: request?.code,
        orderCreatedAt: request?.createdAt,
        warehouseCode: request?.sourceWarehouse?.code,
        warehouseName: request?.sourceWarehouse?.name,
        orderType: OrderType.TRANSFER,
        planDate: request?.createdAt,
        status: request?.status,
        completedAt: request?.createdAt,
        ebsNumber: request?.ebsNumber,
        companyCode: request?.company?.code,
        companyName: request?.company?.name,
        companyAddress: request?.company?.address,
        constructionCode: request?.construction?.code || null,
        constructionName: request?.construction?.name || null,
        description: request?.explanation,
      };

      order.push(reportOrder);
      for (const item of request.warehouseTransferDetails) {
        const reportOrderItem: ReportOrderItemInteface = {
          unit: item?.item?.itemUnit?.name,
          performerName: request?.receiver,
          qrCode: request?.qrCode,
          warehouseTargetCode: request?.destinationWarehouse?.code,
          warehouseTargetName: request?.destinationWarehouse?.name,
          reason: request?.reason?.name,
          contract: null,
          providerCode: null,
          providerName: null,
          departmentReceiptCode: request?.departmentReceipt?.code,
          departmentReceiptName: request?.departmentReceipt?.name,
          account: request?.source?.accountant,
          accountDebt: null,
          accountHave: null,
          warehouseExportProposals: request?.warehouseExportProposals?.code,
          itemName: item?.name,
          itemCode: item?.code,
          planQuantity: item?.planQuantity,
          actualQuantity: item?.actualQuantity,
          receivedQuantity: 0,
          storedQuantity: 0,
          collectedQuantity: 0,
          exportedQuantity: item?.exportedQuantity,
          storageCost: item.price ? Number(item.price) : 0,
          ...reportOrder,
          receiptNumber: '',
        };
        orderItem.push(reportOrderItem);

        for (const lot of item.lots) {
          const reportOrderItemLot: ReportOrderItemLotInteface = {
            ...reportOrderItem,
            lotNumber: lot?.lotNumber?.toLowerCase(),
            explain: request?.explanation,
            note: request?.explanation,
            planQuantity: lot?.planQuantity,
            actualQuantity: lot?.actualQuantity,
            receivedQuantity: 0,
            storedQuantity: 0,
            collectedQuantity: 0,
            exportedQuantity: lot?.exportedQuantity,
            locatorName: null,
            locatorCode: null,
          };

          orderItemLot.push(reportOrderItemLot);
        }
      }

      if (isUpdate) {
        await Promise.all([
          this.reportOrderRepository.deleteAllByConditin({
            orderCode: request.code,
          }),
          this.reportOrderItemRepository.deleteAllByConditin({
            orderCode: request.code,
          }),
          this.reportOrderItemLotRepository.deleteAllByConditin({
            orderCode: request.code,
          }),
        ]);
      }
      await Promise.all([
        this.reportOrderRepository.saveMany(order),
        this.reportOrderItemRepository.saveMany(orderItem),
        this.reportOrderItemLotRepository.saveMany(orderItemLot),
      ]);
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
    try {
      const order: ReportOrderInteface[] = [];
      const orderItem: ReportOrderItemInteface[] = [];
      const orderItemLot: ReportOrderItemLotInteface[] = [];
      const reportOrder: ReportOrderInteface = {
        orderCode: request?.code,
        orderCreatedAt: request?.receiptDate,
        warehouseCode: request?.warehouse?.code,
        warehouseName: request?.warehouse?.name,
        orderType: OrderType.IMPORT,
        planDate: request?.receiptDate,
        status: request?.status,
        completedAt: request?.receiptDate,
        ebsNumber: request?.ebsNumber,
        companyCode: request?.company?.code,
        companyName: request?.company?.name,
        companyAddress: request?.company?.address,
        constructionCode: request?.construction?.code || null,
        constructionName: request?.construction?.name || null,
        description: request?.explanation,
      };

      order.push(reportOrder);

      for (const item of request?.purchasedOrderImportDetails || []) {
        const reportOrderItem: ReportOrderItemInteface = {
          unit: item?.item?.itemUnit,
          performerName: request?.deliver,
          qrCode: request?.qrCode,
          warehouseTargetCode: null,
          warehouseTargetName: null,
          reason: request?.reason?.name,
          contract: request.contractNumber,
          providerCode: request?.vendor?.code,
          providerName: request?.vendor?.name,
          departmentReceiptCode: request?.departmentReceipt?.code,
          departmentReceiptName: request?.departmentReceipt?.name,
          account: request?.source?.accountant,
          accountDebt: item?.debitAccount,
          accountHave: item?.creditAccount,
          warehouseExportProposals: request?.warehouseExportProposal?.code,
          itemName: item?.item?.name,
          itemCode: item?.item?.code,
          planQuantity: item?.quantity,
          actualQuantity: item?.actualQuantity,
          receivedQuantity: item?.receivedQuantity,
          storedQuantity: 0,
          collectedQuantity: 0,
          exportedQuantity: item?.exportableQuantity,
          storageCost: item?.price ? Number(item?.price) : 0,
          ...reportOrder,
          receiptNumber: request.receiptNumber,
        };
        orderItem.push(reportOrderItem);

        for (const lot of item?.lots || []) {
          const reportOrderItemLot: ReportOrderItemLotInteface = {
            ...reportOrderItem,
            lotNumber: lot?.lotNumber?.toLowerCase(),
            explain: request?.explanation,
            note: request?.explanation,
            planQuantity: lot?.quantity,
            actualQuantity: lot?.actualQuantity,
            receivedQuantity: 0,
            storedQuantity: 0,
            collectedQuantity: 0,
            exportedQuantity: 0,
            locatorName: null,
            locatorCode: null,
          };
          orderItemLot.push(reportOrderItemLot);
        }
      }
      if (isUpdate) {
        await Promise.all([
          this.reportOrderRepository.deleteAllByConditin({
            orderCode: request.code,
          }),
          this.reportOrderItemRepository.deleteAllByConditin({
            orderCode: request.code,
          }),
          this.reportOrderItemLotRepository.deleteAllByConditin({
            orderCode: request.code,
          }),
        ]);
      }

      await Promise.all([
        this.reportOrderRepository.saveMany(order),
        this.reportOrderItemRepository.saveMany(orderItem),
        this.reportOrderItemLotRepository.saveMany(orderItemLot),
      ]);
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

  async createSaleOrderExportFromDetail(
    request: SaleOrderExportResponseDto,
    isUpdate = false,
  ) {
    try {
      const order: ReportOrderInteface[] = [];
      const orderItem: ReportOrderItemInteface[] = [];
      const orderItemLot: ReportOrderItemLotInteface[] = [];

      const reportOrder: ReportOrderInteface = {
        orderCode: request?.code,
        orderCreatedAt: request?.receiptDate,
        warehouseCode: request?.warehouse?.code,
        warehouseName: request?.warehouse?.name,
        orderType: OrderType.EXPORT,
        planDate: request?.receiptDate,
        status: request?.status,
        completedAt: request?.receiptDate,
        ebsNumber: request?.ebsNumber,
        companyCode: request?.company?.code,
        companyName: request?.company?.name,
        companyAddress: request?.company?.address,
        constructionCode: request?.construction?.code || null,
        constructionName: request?.construction?.name || null,
        description: null,
      };

      order.push(reportOrder);

      for (const item of request.saleOrderExportDetails) {
        const reportOrderItem: ReportOrderItemInteface = {
          unit: item?.item?.itemUnit,
          performerName: request?.receiver,
          qrCode: request?.qrCode,
          warehouseTargetCode: null,
          warehouseTargetName: null,
          reason: request?.reason?.name,
          contract: null,
          providerCode: null,
          providerName: null,
          departmentReceiptCode: request?.departmentReceipt?.code,
          departmentReceiptName: request?.departmentReceipt?.name,
          account: request?.source?.accountant,
          accountDebt: item?.debitAccount,
          accountHave: item?.creditAccount,
          warehouseExportProposals: request?.warehouseExportProposals?.code,
          itemName: item.item?.name,
          itemCode: item?.item?.code,
          planQuantity: item?.quantity,
          actualQuantity: item?.actualQuantity,
          receivedQuantity: 0,
          storedQuantity: 0,
          collectedQuantity: 0,
          exportedQuantity: item?.actualQuantity,
          storageCost: Number(item?.item?.price || 0),
          ...reportOrder,
          receiptNumber: request.receiptNumber,
        };
        orderItem.push(reportOrderItem);

        for (const lot of item.lots) {
          const reportOrderItemLot: ReportOrderItemLotInteface = {
            ...reportOrderItem,
            lotNumber: lot?.lotNumber?.toLowerCase(),
            explain: request?.explanation,
            note: request?.explanation,
            planQuantity: lot?.planQuantity,
            actualQuantity: lot?.actualQuantity,
            receivedQuantity: 0,
            storedQuantity: 0,
            collectedQuantity: 0,
            exportedQuantity: lot?.actualQuantity,
            locatorName: null,
            locatorCode: null,
          };

          orderItemLot.push(reportOrderItemLot);
        }
      }
      if (isUpdate) {
        await Promise.all([
          this.reportOrderRepository.deleteAllByConditin({
            orderCode: request.code,
          }),
          this.reportOrderItemRepository.deleteAllByConditin({
            orderCode: request.code,
          }),
          this.reportOrderItemLotRepository.deleteAllByConditin({
            orderCode: request.code,
          }),
        ]);
      }

      await Promise.all([
        this.reportOrderRepository.saveMany(order),
        this.reportOrderItemRepository.saveMany(orderItem),
        this.reportOrderItemLotRepository.saveMany(orderItemLot),
      ]);
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
    request: TransactionRequest,
  ): Promise<ResponsePayload<any>> {
    try {
      const company = await this.userService.getCompanies({
        code: request?.data[0]?.syncCode,
      });

      if (
        company?.statusCode !== ResponseCodeEnum.SUCCESS ||
        isEmpty(company.data)
      ) {
        return new ResponseBuilder()
          .withCode(ResponseCodeEnum.BAD_REQUEST)
          .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
          .build();
      }
      request['company'] = company?.data?.pop();
      const transactionitems: TransactionItemInterface[] = [];
      for (const item of request.data) {
        let temp: TransactionItemInterface = {
          transactionDate: item.transactionDate,
          orderDetailId: item.orderDetailId,
          actionType: item.actionType,
          lotNumber: item?.lotNumber?.toLowerCase(),
          reason: undefined,
          explain: undefined,
          note: undefined,
          locatorName: item?.locator?.code,
          locatorCode: item?.locator?.name,
          unit: undefined,
          performerName: undefined,
          qrCode: undefined,
          warehouseTargetCode: undefined,
          warehouseTargetName: undefined,
          contract: undefined,
          providerCode: undefined,
          providerName: undefined,
          departmentReceiptCode: undefined,
          departmentReceiptName: undefined,
          account: undefined,
          accountDebt: undefined,
          accountHave: undefined,
          warehouseExportProposals: undefined,
          itemName: item.itemCode,
          itemCode: item.itemName,
          planQuantity: item.planQuantity,
          actualQuantity: item.actualQuantity,
          receivedQuantity: item.receivedQuantity,
          storedQuantity: item.storedQuantity,
          collectedQuantity: item.collectedQuantity,
          exportedQuantity: item.exportedQuantity,
          storageCost: item.storageCost,
          receiptNumber: undefined,
          orderCode: item.orderCode,
          orderCreatedAt: undefined,
          warehouseCode: item?.warehouse?.code,
          warehouseName: item?.warehouse?.name,
          orderType: item.orderType,
          planDate: undefined,
          status: item.status,
          completedAt: undefined,
          ebsNumber: undefined,
          companyCode: request.company.code,
          companyName: request.company.name,
          companyAddress: request.company.address,
          constructionCode: undefined,
          constructionName: undefined,
          description: undefined,
        };
        if (item?.locator) {
        }
        transactionitems.push(temp);
      }
      await this.transactionItemRepository.create(transactionitems);
      await this.updateLocator(request);
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

  async updateLocator(request: TransactionRequest) {
    const orderItemLotsToBeSaved = [];
    for (const itemRequest of request.data) {
      const orderItemLots =
        await this.reportOrderItemLotRepository.findAllByCondition({
          orderCode: itemRequest.orderCode,
          companyCode: request?.company?.code,
          warehouseCode: itemRequest?.warehouse?.code,
          itemCode: itemRequest.itemCode,
          lotNumber: itemRequest?.lotNumber?.toLowerCase(),
        });
      for (const item of orderItemLots) {
        if (item) {
          item.locatorName = itemRequest?.locator?.code;
          item.locatorCode = itemRequest?.locator?.name;
          orderItemLotsToBeSaved.push(item);
        }
      }
      await this.reportOrderItemLotRepository.saveMany(orderItemLotsToBeSaved);
    }
  }
}
