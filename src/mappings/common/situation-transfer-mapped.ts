import { TableDataSituationTransfer } from '@models/situation-transfer.model';
import { I18nRequestScopeService } from 'nestjs-i18n';
import { ReportInfo } from './Item-inventory-mapped';
import { UserServiceInterface } from '@components/user/interface/user.service.interface';
import { formatAccount } from '@constant/common';

export async function getSituationTransfer(
  data: any[],
  i18n: I18nRequestScopeService,
  userService?: UserServiceInterface,
): Promise<ReportInfo<any>> {

  const codeCompany = data[0]?._id?.companyCode || '';
  const codes: string[] = [];
  codes.push(codeCompany);
  const company = await userService.getListCompanyByCodes(codes);

  const dataMaping: ReportInfo<any> = {
    companyName: company[0]?.name?.toUpperCase() || '',
    companyAddress: company[0]?.address ?? '',
    warehouseName: '',
    dataMapped: null,
  };

  let dataExcell: TableDataSituationTransfer[] = [];
  if (data[0]?.warehouses) {
    dataExcell = data[0]?.warehouses?.map((item) => {
      dataMaping.warehouseName = item.warehouseName;
      formatAccount(item, 29, 29, true, true);
      return {
        warehouseCode:
          i18n.translate('report.WAREHOUSE_GROUP_CODE') +
          [item.warehouseCode, item.warehouseName].join('_'),
        totalPrice: item.totalPrice,
        orders: item.orders,
      };
    });
  }
  dataMaping.dataMapped = dataExcell || [];

  return dataMaping;
}
