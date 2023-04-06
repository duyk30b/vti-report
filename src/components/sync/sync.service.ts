import { SyncDailyStockRequestDto } from './dto/request/sync-daily-item-stock-warehouse.request.dto';
import { ResponseCodeEnum } from '@core/response-code.enum';
import { ResponseBuilder } from '@core/utils/response-builder';
import { ResponsePayload } from '@core/utils/response-payload';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DailyItemLocatorStockRepository } from '@repositories/daily-item-locator-stock.repository';
import { DailyLotLocatorStockRepository } from '@repositories/daily-lot-locator-stock.repository';
import { DailyWarehouseItemStockRepository } from '@repositories/daily-warehouse-item-stock.repository';
import { ReportOrderItemLotRepository } from '@repositories/report-order-item-lot.repository';
import { ReportOrderItemRepository } from '@repositories/report-order-item.repository';
import { ReportOrderRepository } from '@repositories/report-order.repository';
import { TransactionItemRepository } from '@repositories/transaction-item.repository';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { TransactionRequest } from '@requests/sync-transaction.request';
import { ActionType } from '@enums/export-type.enum';
import {
  Company,
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
import { TransactionItemInterface } from '@schemas/interface/TransactionItem.Interface';
import { isEmpty, keyBy, has, map } from 'lodash';
import { Inventory, SyncInventory } from '@requests/sync-inventory-request';
import {
  InventoryAdjustment,
  InventoryAdjustmentRequest,
} from '@requests/inventory-adjustments.request';
import {
  InventoryQuantityNorms,
  InventoryQuantityNormsRequest,
} from '@requests/inventory-quantity-norms.request';
import { InventoryQuantityNormsInterface } from '@schemas/interface/inventory-quantity-norms';
import { InventoryQuantityNormsRepository } from '@repositories/inventory-quantity-norms.repository';
import { SyncItemWarehouseStockPriceRequestDto } from './dto/request/sync-item-warehouse-stock-price.request.dto';
import { DailyItemWarehouseStockPriceRepository } from '@repositories/daily-item-warehouse-stock-price.repository';
import { sleep } from '@utils/common';
import { DailyItemWarehouseStockPriceInterface } from '@schemas/interface/daily-item-warehouse-stock-price.interface';
import { isNumber } from 'class-validator';
import { ReceiptRequest } from '@requests/receipt.request';
import { ReportReceiptInteface } from '@schemas/interface/report-receipt.interface';
import { ReportReceiptRepository } from '@repositories/report-receipt.repository';
import {
  ItemPlanningQuantitesRequest,
  SyncItemPlanningQuantitiesRequest,
} from '@requests/report-item-planning-quantities.request';
import { ReportItemPlanningQuantitiesInteface } from '@schemas/interface/report-item-planning-quantities.interface';
import { ReportItemPlanningQuantitesRepository } from '@repositories/report-item-planning-quantities.repository';
@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

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

    @Inject('DailyItemWarehouseStockPriceRepository')
    private readonly dailyItemWarehouseStockPriceRepository: DailyItemWarehouseStockPriceRepository,

    @Inject('InventoryQuantityNormsRepository')
    private readonly inventoryQuantityNormsRepository: InventoryQuantityNormsRepository,

    @Inject('ReportReceiptRepository')
    private readonly reportReceiptRepository: ReportReceiptRepository,

    @Inject('ReportItemPlanningQuantitesRepository')
    private readonly reportItemPlanningQuantitesRepository: ReportItemPlanningQuantitesRepository,

    private readonly i18n: I18nRequestScopeService,

    @Inject('UserServiceInterface')
    private readonly userService: UserService,
  ) {}

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
      case ActionType.update:
      case ActionType.confirm:
      case ActionType.reject:
        return this.createSaleOrderExportFromDetail(request.data);
      case ActionType.delete:
        return this.deleteSaleOrderExport(request.data);
      default:
        break;
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.BAD_REQUEST)
      .withMessage(await this.i18n.translate('error.NOT_FOUND'))
      .build();
  }

  async inventoryAdjustments(request: InventoryAdjustmentRequest) {
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
      case ActionType.update:
      case ActionType.confirm:
      case ActionType.reject:
      case ActionType.delete:
        return this.createInventoryAdjustments(request.data);
      default:
        break;
    }
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.BAD_REQUEST)
      .withMessage(await this.i18n.translate('error.NOT_FOUND'))
      .build();
  }

  async InventoryQuantityNorms(request: InventoryQuantityNormsRequest) {
    const company = await this.userService.getCompanies({
      code: request?.syncCode,
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
    const companyInfo = company?.data?.pop();
    switch (request.actionType) {
      case ActionType.create:
        return this.createOrUpdateInventoryQuantityNorms(
          request.data,
          companyInfo,
        );

      case ActionType.update:
        return this.createOrUpdateInventoryQuantityNorms(
          request.data,
          companyInfo,
          true,
        );

      case ActionType.delete:
        return this.deleteInventoryQuantityNorms(request.data, companyInfo);

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
      case ActionType.update:
      case ActionType.confirm:
      case ActionType.reject:
        return this.createOrderFromWarehouseTransferDetailDetail(request.data);
      case ActionType.delete:
        return this.deleteWarehouseTransfer(request.data);
      default:
        break;
    }
  }

  // TODO: đồng bộ kiểm kê chưa chạy được
  async syncInventory(request: SyncInventory) {
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
      case ActionType.update:
      case ActionType.confirm:
      case ActionType.reject:
      case ActionType.delete:
        return this.createItemInventory(request.data);
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
      case ActionType.update:
      case ActionType.confirm:
      case ActionType.reject:
        return this.createOrderFromPurchasedOrderImportDetail(request.data);
      case ActionType.delete:
        return this.deletePurchaseOrderImport(request.data);
      default:
        break;
    }

    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.BAD_REQUEST)
      .withMessage(await this.i18n.translate('error.NOT_FOUND'))
      .build();
  }

  async deletePurchaseOrderImport(request: PurchasedOrderImportRequestDto) {
    try {
      this.logger.log(
        `START DELETE PO IMPORT: ORDER_CODE (${request.code}), COMPANY (${request?.company?.code})`,
      );

      const condition = {
        orderCode: request.code,
        orderType: OrderType.IMPORT,
        companyCode: request?.company?.code,
      };

      const response = await Promise.all([
        this.reportOrderItemLotRepository.deleteAllByCondition(condition),
        this.reportOrderItemRepository.deleteAllByCondition(condition),
        this.reportOrderRepository.deleteAllByCondition(condition),
      ]);

      console.log('RESPONSE DELETE ORDER:', response);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);
      this.logger.error(
        `ERROR DELETE PO IMPORT: ORDER_CODE (${request.code}), COMPANY (${request?.company?.code})`,
      );
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async deleteSaleOrderExport(request: SaleOrderExportResponseDto) {
    try {
      this.logger.log(
        `START DELETE SO EXPORT: ORDER_CODE (${request.code}), COMPANY (${request?.company?.code})`,
      );

      const condition = {
        orderCode: request.code,
        orderType: OrderType.EXPORT,
        companyCode: request?.company?.code,
      };

      const response = await Promise.all([
        this.reportOrderItemLotRepository.deleteAllByCondition(condition),
        this.reportOrderItemRepository.deleteAllByCondition(condition),
        this.reportOrderRepository.deleteAllByCondition(condition),
      ]);

      console.log('RESPONSE DELETE ORDER:', response);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);
      this.logger.error(
        `ERROR DELETE SO EXPORT: ORDER_CODE (${request.code}), COMPANY (${request?.company?.code})`,
      );
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async deleteWarehouseTransfer(request: WarehouseTransferResponseDto) {
    try {
      this.logger.log(
        `START DELETE WAREHOUSE TRANSFER: ORDER_CODE (${request.code}), COMPANY (${request?.company?.code})`,
      );

      const condition = {
        orderCode: request.code,
        orderType: OrderType.TRANSFER,
        companyCode: request?.company?.code,
      };

      const response = await Promise.all([
        this.reportOrderItemLotRepository.deleteAllByCondition(condition),
        this.reportOrderItemRepository.deleteAllByCondition(condition),
        this.reportOrderRepository.deleteAllByCondition(condition),
      ]);

      console.log('RESPONSE DELETE ORDER:', response);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);
      this.logger.error(
        `ERROR DELETE WAREHOUSE TRANSFER: ORDER_CODE (${request.code}), COMPANY (${request?.company?.code})`,
      );
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async createOrderFromWarehouseTransferDetailDetail(
    request: WarehouseTransferResponseDto,
  ) {
    const { company } = request;
    const orderType = OrderType.TRANSFER;
    const orders: ReportOrderInteface[] = [];
    const orderItems: ReportOrderItemInteface[] = [];
    const orderItemLots: ReportOrderItemLotInteface[] = [];
    try {
      const reportOrder: ReportOrderInteface = {
        orderCode: request?.code,
        orderCreatedAt: request?.receiptDate,
        warehouseCode: request?.sourceWarehouse?.code,
        warehouseName: request?.sourceWarehouse?.name,
        orderType: orderType,
        planDate: request?.createdAt,
        status: request?.status,
        completedAt: request?.createdAt,
        ebsNumber: request?.ebsNumber,
        companyCode: company?.code,
        companyName: company?.name,
        companyAddress: company?.address,
        constructionCode: request?.construction?.code || null,
        constructionName: request?.construction?.name || null,
        description: request?.explanation,
      };
      orders.push(reportOrder);

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
          accountDebt: item?.debitAccount,
          accountHave: item.creditAccount,
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
          amount: item.amount ? Number(item.amount) : 0,
        };
        orderItems.push(reportOrderItem);

        for (const lot of item.lots) {
          const reportOrderItemLot: ReportOrderItemLotInteface = {
            ...reportOrderItem,
            lotNumber: lot?.lotNumber?.toUpperCase(),
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
            storageCost: +lot?.price ? lot?.price : 0,
            amount: +lot?.amount ? lot?.amount : 0,
          };

          orderItemLots.push(reportOrderItemLot);
        }
      }
      await Promise.all([
        this.reportOrderRepository.bulkWriteOrderReport(orders),
        this.reportOrderItemRepository.bulkWriteOrderReportItem(orderItems),
        this.reportOrderItemLotRepository.bulkWriteOrderReportItemLot(
          orderItemLots,
        ),
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

  async createItemInventory(request: Inventory) {
    try {
      const orders: ReportOrderInteface[] = [];
      const orderItems: ReportOrderItemInteface[] = [];
      const orderItemLots: ReportOrderItemLotInteface[] = [];

      for (const item of request.itemInventory) {
        const reportOrderItem: ReportOrderItemInteface = {
          orderCode: request?.code,
          warehouseCode: request?.warehouse?.code,
          warehouseName: request?.warehouse?.name,
          companyCode: request?.company?.code,
          companyName: request?.company?.name,
          companyAddress: request?.company?.address,
          orderCreatedAt: request?.orderCreatedAt,
          orderType: OrderType.INVENTORY,
          unit: item?.unit,
          itemName: item?.name,
          itemCode: item?.code,
          planQuantity: item?.planQuantity,
          actualQuantity: item?.actualQuantity,
          storageCost: item.price ? Number(item.price) : 0,
        } as any;
        orderItems.push(reportOrderItem);

        for (const lot of item.lots) {
          const reportOrderItemLot: ReportOrderItemLotInteface = {
            ...reportOrderItem,
            lotNumber: lot?.lotNumber?.toUpperCase(),
            note: request?.note,
            planQuantity: lot?.planQuantity,
            actualQuantity: lot?.actualQuantity,
          } as any;

          orderItemLots.push(reportOrderItemLot);
        }
      }
      await Promise.all([
        this.reportOrderRepository.bulkWriteOrderReport(orders),
        this.reportOrderItemRepository.bulkWriteOrderReportItem(orderItems),
        this.reportOrderItemLotRepository.bulkWriteOrderReportItemLot(
          orderItemLots,
        ),
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
  ) {
    const { company, code } = request;
    const orderType = OrderType.IMPORT;
    try {
      const orders: ReportOrderInteface[] = [];
      const orderItems: ReportOrderItemInteface[] = [];
      const orderItemLots: ReportOrderItemLotInteface[] = [];
      const reportOrder: ReportOrderInteface = {
        orderCode: request?.code,
        orderCreatedAt: request?.receiptDate,
        warehouseCode: request?.warehouse?.code,
        warehouseName: request?.warehouse?.name,
        orderType: orderType,
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

      orders.push(reportOrder);

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
          warehouseExportProposals:
            request?.warehouseExportProposal?.code || null,
          itemName: item?.item?.name,
          itemCode: item?.item?.code,
          planQuantity: item?.quantity,
          actualQuantity: item?.actualQuantity,
          receivedQuantity: item?.receivedQuantity,
          storedQuantity: 0,
          collectedQuantity: 0,
          exportedQuantity: item?.exportableQuantity,
          storageCost:
            item?.price && isNumber(+item?.price) ? Number(item?.price) : 0,
          amount: item?.amount ? Number(item?.amount) : 0,
          ...reportOrder,
          receiptNumber: request.receiptNumber,
        };
        orderItems.push(reportOrderItem);

        for (const lot of item?.lots || []) {
          const reportOrderItemLot: ReportOrderItemLotInteface = {
            ...reportOrderItem,
            lotNumber: lot?.lotNumber?.toUpperCase(),
            explain: request?.explanation,
            note: request?.explanation,
            planQuantity: lot?.quantity,
            actualQuantity: lot?.actualQuantity,
            receivedQuantity: item?.receivedQuantity,
            storedQuantity: 0,
            collectedQuantity: 0,
            exportedQuantity: 0,
            locatorName: null,
            locatorCode: null,
            amount: +lot?.amount ? lot.amount : 0,
          };
          orderItemLots.push(reportOrderItemLot);
        }
      }
      const serializeItemLotRequest = keyBy(orderItemLots, (lot) =>
        [lot.itemCode, lot?.lotNumber?.toUpperCase() || ''].join('-'),
      );

      const reportOrderItemLots =
        await this.reportOrderItemLotRepository.findAllByCondition({
          companyCode: { $eq: company.code },
          orderCode: { $eq: code },
          orderType: { $eq: orderType },
        });
      const removeReportOrderItemLots = reportOrderItemLots.filter(
        (lot) =>
          !has(
            serializeItemLotRequest,
            [lot.itemCode, lot?.lotNumber?.toUpperCase() || ''].join('-'),
          ),
      );

      if (!isEmpty(removeReportOrderItemLots)) {
        await this.reportOrderItemLotRepository.deleteAllByCondition({
          _id: { $in: map(removeReportOrderItemLots, '_id') },
        });
      }
      const response = await Promise.all([
        this.reportOrderRepository.bulkWriteOrderReport(orders),
        this.reportOrderItemRepository.bulkWriteOrderReportItem(orderItems),
        this.reportOrderItemLotRepository.bulkWriteOrderReportItemLot(
          orderItemLots,
        ),
      ]);

      console.log('RESPONSE SYNC ORDER:', response);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      console.log(error);
      this.logger.error(
        `ERROR SYNC PO IMPORT: ORDER_CODE (${request.code}), COMPANY (${company.code})`,
      );
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }

  async createSaleOrderExportFromDetail(request: SaleOrderExportResponseDto) {
    const { company } = request;
    try {
      const orderType = OrderType.EXPORT;
      const orders: ReportOrderInteface[] = [];
      const orderItems: ReportOrderItemInteface[] = [];
      const orderItemLots: ReportOrderItemLotInteface[] = [];

      const reportOrder: ReportOrderInteface = {
        orderCode: request?.code,
        orderCreatedAt: request?.receiptDate,
        warehouseCode: request?.warehouse?.code,
        warehouseName: request?.warehouse?.name,
        orderType: orderType,
        planDate: request?.receiptDate,
        status: request?.status,
        completedAt: request?.receiptDate,
        ebsNumber: request?.ebsNumber,
        companyCode: company?.code,
        companyName: company?.name,
        companyAddress: company?.address,
        constructionCode: request?.construction?.code || null,
        constructionName: request?.construction?.name || null,
        description: request?.explanation,
        transactionNumberCreated: request.transactionNumberCreated,
      };

      orders.push(reportOrder);

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
          warehouseExportProposals:
            request?.warehouseExportProposals?.code || null,
          itemName: item.item?.name,
          itemCode: item?.item?.code,
          planQuantity: item?.quantity,
          actualQuantity: item?.actualQuantity,
          receivedQuantity: 0,
          storedQuantity: 0,
          collectedQuantity: 0,
          exportedQuantity: item?.actualQuantity,
          storageCost: Number(item?.item?.price || 0),
          amount: Number(item?.item?.amount || 0),
          ...reportOrder,
          receiptNumber: request.receiptNumber,
          transactionNumberCreated: request?.transactionNumberCreated,
        };
        orderItems.push(reportOrderItem);

        for (const lot of item.lots) {
          const reportOrderItemLot: ReportOrderItemLotInteface = {
            ...reportOrderItem,
            lotNumber: lot?.lotNumber?.toUpperCase(),
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
            storageCost: Number(lot?.price || 0),
            amount: Number(lot?.amount || 0),
            transactionNumberCreated: request?.transactionNumberCreated,
          };
          orderItemLots.push(reportOrderItemLot);
        }
      }

      await Promise.all([
        this.reportOrderRepository.bulkWriteOrderReport(orders),
        this.reportOrderItemRepository.bulkWriteOrderReportItem(orderItems),
        this.reportOrderItemLotRepository.bulkWriteOrderReportItemLot(
          orderItemLots,
        ),
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

  async createInventoryAdjustments(request: InventoryAdjustment) {
    try {
      const orders: ReportOrderInteface[] = [];
      const orderItems: ReportOrderItemInteface[] = [];
      const orderItemLots: ReportOrderItemLotInteface[] = [];

      const reportOrder: ReportOrderInteface = {
        orderCode: request?.code,
        orderCreatedAt: request?.receiptDate,
        warehouseCode: request?.warehouse?.code,
        warehouseName: request?.warehouse?.name,
        orderType: request.OrderType,
        planDate: request?.receiptDate,
        status: request?.status,
        completedAt: request?.receiptDate,
        companyCode: request?.company?.code,
        companyName: request?.company?.name,
        companyAddress: request?.company?.address,
        constructionCode: request?.construction?.code || null,
        constructionName: request?.construction?.name || null,
        description: request?.explanation,
      } as any;

      orders.push(reportOrder);

      for (const item of request.items) {
        const reportOrderItem: ReportOrderItemInteface = {
          ...reportOrder,
          unit: item?.unit,
          reason: request?.reason?.name,
          departmentReceiptCode: request?.departmentReceipt?.code,
          departmentReceiptName: request?.departmentReceipt?.name,
          account: request?.source?.accountant,
          accountDebt: item?.debitAccount,
          accountHave: item?.creditAccount,
          warehouseExportProposals:
            request?.warehouseExportProposals?.code || null,
          itemName: item?.name,
          itemCode: item?.code,
          planQuantity: item?.planQuantity,
          actualQuantity: item?.actualQuantity,
          storageCost: Number(item?.price || 0),
          receiptNumber: null,
        } as any;
        orderItems.push(reportOrderItem);

        for (const lot of item.lots) {
          const reportOrderItemLot: ReportOrderItemLotInteface = {
            ...reportOrderItem,
            lotNumber: lot?.lotNumber?.toUpperCase(),
            explain: request?.explanation,
            note: request?.explanation,
            planQuantity: lot?.planQuantity,
            actualQuantity: lot?.actualQuantity,
          } as any;

          orderItemLots.push(reportOrderItemLot);
        }
      }

      await Promise.all([
        this.reportOrderRepository.bulkWriteOrderReport(orders),
        this.reportOrderItemRepository.bulkWriteOrderReportItem(orderItems),
        this.reportOrderItemLotRepository.bulkWriteOrderReportItemLot(
          orderItemLots,
        ),
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

  async createOrUpdateInventoryQuantityNorms(
    request: InventoryQuantityNorms[],
    companyInfo: Company,
    isUpdate = false,
  ) {
    try {
      const inventoryQuantityNorms: InventoryQuantityNormsInterface[] = [];
      const inventoryQuantityNormsTobeDelete: any[] = [];
      for (const item of request) {
        const itemInventoryQuantityNorm: InventoryQuantityNormsInterface = {
          companyCode: companyInfo.code,
          warehouseCode: item.warehouseCode,
          warehouseName: item.warehouseName,
          itemCode: item.itemCode,
          itemName: item.itemName,
          unit: item.itemUnit,
          inventoryLimit: item?.inventoryLimit || 0,
          minInventoryLimit: item?.minInventoryLimit || 0,
          reorderPoint: item?.reorderPoint || 0,
          eoq: item?.eoq || 0,
        };
        const itemTobeDelete = {
          companyCode: companyInfo.code,
          warehouseCode: item.warehouseCode,
          itemCode: item.itemCode,
        };
        inventoryQuantityNorms.push(itemInventoryQuantityNorm);
        inventoryQuantityNormsTobeDelete.push(itemTobeDelete);
      }
      const promiseAll = [];
      if (isUpdate) {
        for (const item of inventoryQuantityNormsTobeDelete) {
          promiseAll.push(
            this.inventoryQuantityNormsRepository.deleteAllByCondition(item),
          );
        }
        if (!isEmpty(promiseAll)) {
          await Promise.all(promiseAll);
        }
      }
      await this.inventoryQuantityNormsRepository.createMany(
        inventoryQuantityNorms,
      );
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

  async deleteInventoryQuantityNorms(
    request: InventoryQuantityNorms[],
    company: Company,
  ) {
    try {
      const promiseAll = [];
      for (const item of request) {
        const itemTobeDelete = {
          companyCode: company.code,
          warehouseCode: item.warehouseCode,
          itemCode: item.itemCode,
        };
        promiseAll.push(
          this.inventoryQuantityNormsRepository.deleteAllByCondition(
            itemTobeDelete,
          ),
        );
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
        const temp: TransactionItemInterface = {
          transactionDate: item.transactionDate,
          movementType: item.movementType,
          orderDetailId: item.orderDetailId,
          actionType: item.actionType,
          lotNumber: item?.lotNumber?.toUpperCase(),
          locatorName: item?.locator?.name,
          locatorCode: item?.locator?.code,
          itemName: item.itemName,
          itemCode: item.itemCode,
          unit: item?.itemUnitName,
          planQuantity: item.planQuantity,
          actualQuantity: item.actualQuantity,
          orderCode: item.orderCode,
          warehouseCode: item?.warehouse?.code,
          warehouseName: item?.warehouse?.name,
          orderType: item.orderType,
          companyCode: request?.company?.code,
          companyName: request?.company?.name,
          companyAddress: request?.company?.address,
          manufacturingCountry: item.manufacturingCountry,
        } as any;
        transactionitems.push(temp);
      }
      await this.transactionItemRepository.createMany(transactionitems);
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
    data: SyncDailyStockRequestDto,
  ): Promise<any> {
    const itemStockLocatorEntities = data.itemStockLocatorDaily.map(
      (dailyItemStockLocator) =>
        this.dailyItemLocatorStockRepository.createEntity(
          dailyItemStockLocator,
        ),
    );

    const itemLotStockLocatorEntities = data.itemLotStockLocatorDaily.map(
      (dailyItemStockLocator) =>
        this.dailyLotLocatorStockRepository.createEntity(dailyItemStockLocator),
    );

    const itemStockWarehouseEntities = data.itemStockWarehouseDaily.map(
      (dailyItemStockLocator) =>
        this.dailyWarehouseItemStockRepository.createEntity(
          dailyItemStockLocator,
        ),
    );

    await Promise.all([
      this.dailyItemLocatorStockRepository.createMany(itemStockLocatorEntities),
      this.dailyLotLocatorStockRepository.createMany(
        itemLotStockLocatorEntities,
      ),
      this.dailyWarehouseItemStockRepository.createMany(
        itemStockWarehouseEntities,
      ),
    ]);
    return new ResponseBuilder()
      .withCode(ResponseCodeEnum.SUCCESS)
      .withMessage(await this.i18n.translate('success.SUCCESS'))
      .build();
  }

  async syncItemPrice(
    request: SyncItemWarehouseStockPriceRequestDto,
  ): Promise<any> {
    const { companyCode, data } = request;
    const company = await this.userService.getCompanies({
      code: companyCode,
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
    try {
      const itemPriceDocuments = data.map((itemPrice) => {
        return {
          updateOne: {
            filter: {
              companyCode: companyCode,
              itemCode: itemPrice.itemCode,
              warehouseCode: itemPrice.warehouseCode,
              lotNumber: itemPrice.lotNumber || null,
              reportDate: itemPrice.reportDate,
            },
            update: {
              itemCode: itemPrice?.itemCode,
              warehouseCode: itemPrice?.warehouseCode,
              lotNumber: itemPrice?.lotNumber,
              quantity: itemPrice?.quantity,
              price: itemPrice?.amount,
              amount: itemPrice?.totalAmount,
              reportDate: new Date(itemPrice.reportDate),
              companyCode: companyCode,
              manufacturingCountry: itemPrice?.manufacturingCountry,
            } as DailyItemWarehouseStockPriceInterface,
            upsert: true,
          },
        };
      });
      const limit = 200;
      const page = Math.ceil(itemPriceDocuments.length / limit);
      for (let currentPage = 0; currentPage < page; currentPage++) {
        const dataStart = currentPage * limit;
        const dataEnd = (currentPage + 1) * limit;
        const documents = itemPriceDocuments.slice(dataStart, dataEnd);
        await this.dailyItemWarehouseStockPriceRepository.bulkWrite(documents);
        if (currentPage !== page - 1) {
          await sleep(200);
        }
      }

      console.info('SYNC ITEM PRICE SUCCESS:', new Date());
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    } catch (error) {
      console.error('SYNC ITEM PRICE ERROR:', error);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async syncReceipt(request: ReceiptRequest): Promise<any> {
    const { data } = request;
    const company = await this.userService.getCompanies({
      code: data.syncCode,
    });

    if (
      company?.statusCode !== ResponseCodeEnum.SUCCESS ||
      isEmpty(company.data) ||
      isEmpty(data.syncCode)
    ) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
        .build();
    }
    try {
      const receiptDocuments = data?.dataSync.map((receipt) => {
        return {
          updateOne: {
            filter: {
              code: receipt.code,
              itemCode: receipt.itemCode,
              companyCode: data.syncCode,
            },
            update: {
              code: receipt.code,
              contractNumber: receipt.contractNumber,
              receiptNumber: receipt.receiptNumber,
              status: receipt?.status,
              itemCode: receipt.itemCode,
              itemName: receipt.itemName,
              quantity: receipt?.quantity,
              orderQuantity: receipt?.orderQuantity,
              price: receipt?.price,
              amount: receipt?.amount,
              receiptDate: new Date(receipt.receiptDate),
              companyCode: data.syncCode,
            } as ReportReceiptInteface,
            upsert: true,
          },
        };
      });
      const limit = 200;
      const page = Math.ceil(receiptDocuments.length / limit);
      for (let currentPage = 0; currentPage < page; currentPage++) {
        const dataStart = currentPage * limit;
        const dataEnd = (currentPage + 1) * limit;
        const documents = receiptDocuments.slice(dataStart, dataEnd);
        await this.reportReceiptRepository.bulkWrite(documents);
        if (currentPage !== page - 1) {
          await sleep(200);
        }
      }
      console.info('SYNC RECEIPT SUCCESS:', new Date());
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    } catch (error) {
      console.error('SYNC RECEIPT ERROR:', error);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async syncItemPlanningQuantity(
    request: ItemPlanningQuantitesRequest,
  ): Promise<any> {
    const { data, syncCode } = request;
    const company = await this.userService.getCompanies({
      code: syncCode,
    });

    if (
      company?.statusCode !== ResponseCodeEnum.SUCCESS ||
      isEmpty(company.data) ||
      isEmpty(syncCode)
    ) {
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.COMPANY_NOT_FOUND'))
        .build();
    }
    try {
      switch (request?.actionType) {
        case ActionType.delete:
          return this.deletePlanningQuantity(data, company.data[0]);
        case ActionType.update:
          // eslint-disable-next-line no-case-declarations
          const itemPlanningQuantityDocuments = data.map((ipq) => {
            return {
              updateOne: {
                filter: {
                  itemCode: ipq.itemCode,
                  companyCode: syncCode,
                  lotNumber: ipq.lotNumber,
                  warehouseCode: ipq.warehouseCode,
                  locatorCode: ipq.locatorCode,
                  orderCode: ipq.orderCode,
                  orderType: ipq.orderType,
                },
                update: {
                  itemCode: ipq.itemCode,
                  itemName: ipq.itemName,
                  itemUnit: ipq.itemUnit,
                  companyCode: syncCode,
                  lotNumber: ipq.lotNumber,
                  warehouseCode: ipq.warehouseCode,
                  locatorCode: ipq.locatorCode,
                  orderCode: ipq.orderCode,
                  planQuantity: ipq.planQuantity,
                  quantity: ipq.quantity,
                  orderType: ipq.orderType,
                } as ReportItemPlanningQuantitiesInteface,
                upsert: true,
              },
            };
          });
          // eslint-disable-next-line no-case-declarations
          const limit = 200;
          // eslint-disable-next-line no-case-declarations
          const page = Math.ceil(itemPlanningQuantityDocuments.length / limit);
          for (let currentPage = 0; currentPage < page; currentPage++) {
            const dataStart = currentPage * limit;
            const dataEnd = (currentPage + 1) * limit;
            const documents = itemPlanningQuantityDocuments.slice(
              dataStart,
              dataEnd,
            );
            await this.reportItemPlanningQuantitesRepository.bulkWrite(
              documents,
            );
            if (currentPage !== page - 1) {
              await sleep(200);
            }
          }
          break;
        default:
          break;
      }

      console.info('SYNC ITEM PLANNING QUANTITIES  SUCCESS:', new Date());
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('error.SUCCESS'))
        .build();
    } catch (error) {
      console.error('SYNC ITEM PLANNING QUANTITIES  ERROR:', error);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.INTERNAL_SERVER_ERROR)
        .withMessage(await this.i18n.translate('error.INTERNAL_SERVER_ERROR'))
        .build();
    }
  }

  async deletePlanningQuantity(
    request: SyncItemPlanningQuantitiesRequest[],
    company: Company,
  ) {
    try {
      console.log(company);

      const promiseAll = [];
      for (const item of request) {
        const itemTobeDelete = {
          companyCode: company.code,
          itemCode: item.itemCode,
          lotNumber: item.lotNumber || null,
          warehouseCode: item.warehouseCode,
          locatorCode: item.locatorCode,
          orderCode: item.orderCode,
          orderType: item.orderType,
        };
        console.log('itemTobeDelete ', itemTobeDelete);

        promiseAll.push(
          this.reportItemPlanningQuantitesRepository.deleteByCondition(
            itemTobeDelete,
          ),
        );
      }
      const a = await Promise.all(promiseAll);
      console.log(a);

      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.SUCCESS)
        .withMessage(await this.i18n.translate('success.SUCCESS'))
        .build();
    } catch (error) {
      console.log('SYNC ITEM PLANNING QUANTITIES  ERROR DELETE:', error);
      return new ResponseBuilder()
        .withCode(ResponseCodeEnum.BAD_REQUEST)
        .withMessage(await this.i18n.translate('error.BAD_REQUEST'))
        .build();
    }
  }
}
