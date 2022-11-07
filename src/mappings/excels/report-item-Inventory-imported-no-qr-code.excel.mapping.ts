import { ReportType } from '@enums/report-type.enum';
import { generateTable } from '@layout/excel/report-excel.layout';
import { ITEM_INVENTORY_IMPORTED_NO_QR_CODE_COLUMN } from '@layout/excel/table-column-excel/Item-inventory-imported-no-qr-code-column';
import { reportGroupByWarehouseTemplateData } from '@layout/excel/table-data-excel/report-group-by-warehouse.template-data';
import { ReportInfo } from '@mapping/common/Item-inventory-mapped';
import { ItemInventoryImportedNoQRCodeModel } from '@models/Item-inventory-imported-no-qr-code.model';
import {
  TableData,
  FormatByKey,
  Alignment,
  ReportModel,
} from '@models/report.model';

import { ReportRequest } from '@requests/report.request';
import { ReportOrderItemLot } from '@schemas/report-order-item-lot.schema';
import { REPORT_INFO } from '@utils/constant';
import { I18nRequestScopeService } from 'nestjs-i18n';

export async function reportItemInventoryImportedNoQRCodeExcelMapping(
  request: ReportRequest,
  data: ReportInfo<TableData<ItemInventoryImportedNoQRCodeModel>[]>,
  i18n: I18nRequestScopeService,
) {
  const formatByKey: FormatByKey<ItemInventoryImportedNoQRCodeModel> = {
    index: Alignment.CENTER,
    orderCode: Alignment.LEFT,
    itemCode: Alignment.LEFT,
    itemName: Alignment.LEFT,
    unit: Alignment.CENTER,
    lotNumber: Alignment.CENTER,
    locatorCode: Alignment.LEFT,
    actualQuantity: Alignment.RIGHT,
    storageCost: Alignment.RIGHT,
    totalPrice: Alignment.RIGHT,
  };

  const model: ReportModel<ItemInventoryImportedNoQRCodeModel> = {
    childCompany: data.companyName,
    addressChildCompany: data.companyAddress,
    tableColumn: ITEM_INVENTORY_IMPORTED_NO_QR_CODE_COLUMN,
    tableData: data.dataMapped,
    header: false,
    aligmentCell: formatByKey,
    key: REPORT_INFO[ReportType[ReportType.ITEM_INVENTORY_IMPORTED_NO_QR_CODE]]
      .key,
    dateFrom: request.dateFrom,
    dateTo: request.dateTo,
    warehouse: request.warehouseCode ? data.warehouseName : null,
  };

  const { dataBase64, nameFile } = await generateTable(
    model,
    reportGroupByWarehouseTemplateData,
    i18n,
  );

  return {
    dataBase64,
    nameFile,
  };
}
