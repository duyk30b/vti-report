import { Injectable } from '@nestjs/common'
import { Workbook, Worksheet } from 'exceljs'
import { timeToText } from 'src/common/helpers'
import { advanceLayoutExcel, cellHeaderStyle } from 'src/common/utils/excel-advance.util'
import { BusinessException } from 'src/core/exception-filters/business-exception.filter'
import { NatsClientUserService } from 'src/modules/nats/service/nats-client-user.service'
import { WarehouseCheckoutRepository } from 'src/mongo/repository/warehouse-checkout/warehouse-checkout.repository'
import { ECheckoutForm, ECheckoutType, WarehouseCheckoutType } from 'src/mongo/repository/warehouse-checkout/warehouse-checkout.schema'
import { ApiReportWarehouseCheckoutQuery } from './api-report-warehouse-checkout.request'

@Injectable()
export class ApiReportWarehouseCheckoutService {
	constructor(
		private readonly warehouseCheckoutRepository: WarehouseCheckoutRepository,
		private readonly natsClientUserService: NatsClientUserService
	) { }

	async createOne() {
		return await this.warehouseCheckoutRepository.insertOne({
			timeSync: new Date(),
			createTime: new Date(),
			startTime: new Date(),
			endTime: new Date(),
			ticketCode: 'XXX222GG',
			checkoutType: ECheckoutType.Periodic,
			checkoutForm: ECheckoutForm.QuantityAndLot,
			recordQuantity: 543,
			checkoutQuantity: 123,
			warehouses: [
				{
					warehouseId: 12,
					warehouseName: 'Kho check test',
					items: [
						{
							itemCode: 'BBTL_X2',
							itemName: 'Bút bi thăng long',
							unit: 'Cái',
							lot: 'L0213',
							manufacturingDate: new Date(),
							recordQuantity: 2,
							recordPrice: 2000,
							recordAmount: 4000,
							checkoutPrice: 2500,
							checkoutQuantity: 3,
							checkoutAmount: 7500,
							checkoutQuality: 0.98,
							excessQuantity: 1,
							excessAmount: 2500,
							shortageQuantity: -1,
							shortageAmount: -2500,
						},
					],
				},
			],
		})
	}

	async exportExcel(query: ApiReportWarehouseCheckoutQuery, userId: number) {
		const { fromTime, toTime, warehouseId, ticketCode } = query

		const warehouseCheckout = await this.warehouseCheckoutRepository.findOneBy({
			ticketCode,
			createTime: {
				$gte: fromTime,
				$lt: toTime,
			},
		})
		if (!warehouseCheckout) {
			throw new BusinessException('error.NotFound')
		}
		if (warehouseId) {
			warehouseCheckout.warehouses = warehouseCheckout.warehouses.filter((w) => w.warehouseId === warehouseId)
		}
		const [user] = await this.natsClientUserService.getUsersByIds({ userIds: [userId] })

		const workbook = this.getWorkbookWarehouseCheckout(warehouseCheckout, {
			fromTime,
			toTime,
			userFullName: user.fullName,
			reportCode: 'W06',
			warehouseTitle: warehouseId ? (warehouseCheckout.warehouses[0]?.warehouseName || '') : 'TẤT CẢ KHO',
			companyName: 'CÔNG TY CỔ PHẦN VTI',
			companyAddress: 'VTI Building, Mễ Trì Hạ, Nam Từ Liêm, Hà Nội',
		})

		const buffer = await workbook.xlsx.writeBuffer()
		return {
			xlsx: buffer,
			filename: `W04_Báo cáo tình hình kiểm kê_${timeToText(fromTime, 'DDMMYYYY')}-${timeToText(toTime, 'DDMMYYYY')}`,
		}
	}

	getWorkbookWarehouseCheckout(data: WarehouseCheckoutType, meta: {
		fromTime: Date,
		toTime: Date,
		reportCode: string,
		userFullName: string,
		warehouseTitle: string,
		companyName: string,
		companyAddress: string
	}): Workbook {
		const dataRows: { style: any, data: any }[] = []
		data.warehouses.forEach((w) => {
			dataRows.push({
				style: { num: { font: { bold: true }, mergeCells: { rowspan: 1, colspan: 17 } } },
				data: [{ num: `Kho: ${w.warehouseId}_${w.warehouseName}`, shortageAmount: '' }],
			})
			dataRows.push({
				style: {
					num: { alignment: { horizontal: 'center' } },
					unit: { alignment: { horizontal: 'center' } },
					lot: { alignment: { horizontal: 'center' } },
					manufacturingDate: { alignment: { horizontal: 'center' }, numFmt: 'dd/mm/yyyy' },
					importDate: { alignment: { horizontal: 'center' }, numFmt: 'dd/mm/yyyy' },
					recordQuantity: { numFmt: '###,##0.00' },
					recordPrice: { numFmt: '###,##0.00' },
					recordAmount: { numFmt: '###,##0' },
				},
				data: w.items.map((item, index) => ({
					num: index + 1,
					itemCode: item.itemCode,
					itemName: item.itemName,
					unit: item.unit,
					lot: item.lot || '',
					manufacturingDate: item.manufacturingDate || '',
					recordQuantity: item.recordQuantity,
					recordPrice: item.recordPrice,
					recordAmount: item.recordAmount,
					checkoutQuantity: item.checkoutQuantity,
					checkoutPrice: item.checkoutPrice,
					checkoutAmount: item.checkoutAmount,
					checkoutQuality: item.checkoutQuality,
					excessAmount: item.excessAmount,
					excessQuantity: item.excessQuantity,
					shortageAmount: item.shortageAmount,
					shortageQuantity: item.shortageQuantity,
				})),
			})
		})
		dataRows.push({
			style: {
				_all: { font: { bold: true } },
				num: { mergeCells: { rowspan: 1, colspan: 6 } },
				recordPrice: { mergeCells: { rowspan: 1, colspan: 2 } },
				checkoutPrice: { mergeCells: { rowspan: 1, colspan: 3 } },
				excessQuantity: { mergeCells: { rowspan: 1, colspan: 4 } },
			},
			data: [
				{
					num: 'TỔNG CỘNG',
					recordQuantity: data.recordQuantity,
					recordPrice: '',
					checkoutQuantity: data.checkoutQuantity,
					excessQuantity: '',
					checkoutPrice: '',
					shortageAmount: '',
				},
			],
		})

		const sheetName = `${meta.reportCode}_${timeToText(meta.fromTime, 'DDMMYYYY')}-${timeToText(meta.toTime, 'DDMMYYYY')}`

		const workbook = advanceLayoutExcel({
			layout: { maxRowsTable: 1000, sheetName },
			headerSheet: (worksheet: Worksheet, index: number) => {
				worksheet.addRow([meta.companyName]).eachCell((cell) => {
					cell.font = { size: 10, bold: true, name: 'Times New Roman' }
				})
				worksheet.addRow([meta.companyAddress]).eachCell((cell) => {
					cell.font = { size: 10, bold: true, name: 'Times New Roman' }
				})
				worksheet.addRow(['BÁO CÁO TÌNH KIỂM KÊ']).eachCell((cell) => {
					cell.font = { size: 14, bold: true, name: 'Times New Roman' }
					cell.alignment = { horizontal: 'center' }
				})
				worksheet.mergeCells(3, 1, 3, 17)
				worksheet.addRow([`Từ ngày: ${timeToText(data.startTime, 'DD/MM/YYYY')} đến ngày: ${timeToText(data.endTime, 'DD/MM/YYYY')}`])
					.eachCell((cell) => {
						cell.font = { size: 10, bold: true, name: 'Times New Roman' }
						cell.alignment = { horizontal: 'center' }
					})
				worksheet.mergeCells(4, 1, 4, 17)
				worksheet.addRow([`Mã lệnh kiểm kê: ${data.ticketCode}`]).eachCell((cell) => {
					cell.font = { size: 9, name: 'Times New Roman' }
				})
				worksheet.addRow([`Tại kho: ${meta.warehouseTitle}`]).eachCell((cell) => {
					cell.font = { size: 9, name: 'Times New Roman' }
				})
				worksheet.addRow([`Loại kiểm kê: ${data.checkoutType} - ${data.checkoutForm}`]).eachCell((cell) => {
					cell.font = { size: 9, name: 'Times New Roman' }
				})
				worksheet.addRow([''])
				worksheet.addRow({
					num: 'STT',
					itemCode: 'Mã sản phẩm',
					itemName: 'Tên sản phẩm',
					unit: 'ĐVT',
					lot: 'Lô',
					manufacturingDate: 'Ngày sản xuất',
					excessQuantity: 'Chênh lệch',
					recordQuantity: 'Theo sổ sách',
					checkoutQuantity: 'Theo kiểm kê',
				}).eachCell(cellHeaderStyle)
				worksheet.mergeCells(9, 14, 9, 17)

				worksheet.addRow({
					excessQuantity: 'Thừa',
					shortageQuantity: 'Thiếu',
				}).eachCell(cellHeaderStyle)
				worksheet.mergeCells(9, 7, 10, 9)
				worksheet.mergeCells(9, 10, 10, 13)
				worksheet.mergeCells(10, 14, 10, 15)
				worksheet.mergeCells(10, 16, 10, 17)

				worksheet.addRow({
					recordQuantity: 'Số lượng',
					recordPrice: 'Đơn giá',
					recordAmount: 'Thành tiền',
					checkoutQuantity: 'Số lượng',
					checkoutPrice: 'Đơn giá',
					checkoutAmount: 'Thành tiền',
					checkoutQuality: 'Chất lượng',
					excessQuantity: 'Số lượng',
					excessAmount: 'Thành tiền',
					shortageQuantity: 'Số lượng',
					shortageAmount: 'Thành tiền',
				}).eachCell(cellHeaderStyle)
				worksheet.mergeCells(9, 1, 11, 1)
				worksheet.mergeCells(9, 2, 11, 2)
				worksheet.mergeCells(9, 3, 11, 3)
				worksheet.mergeCells(9, 4, 11, 4)
				worksheet.mergeCells(9, 5, 11, 5)
				worksheet.mergeCells(9, 6, 11, 6)
			},
			columns: [
				{ key: 'num', width: 10 },
				{ key: 'itemCode', width: 10 },
				{ key: 'itemName', width: 30 },
				{ key: 'unit', width: 10 },
				{ key: 'lot', width: 10 },
				{ key: 'manufacturingDate', width: 10 }, // ngày sản xuất
				{ key: 'recordQuantity', width: 10 },
				{ key: 'recordPrice', width: 10 },
				{ key: 'recordAmount', width: 10 },
				{ key: 'checkoutQuantity', width: 10 },
				{ key: 'checkoutPrice', width: 10 },
				{ key: 'checkoutAmount', width: 10 },
				{ key: 'checkoutQuality', width: 10 },
				{ key: 'excessQuantity', width: 10 },  // số lượng thừa
				{ key: 'excessAmount', width: 10 },
				{ key: 'shortageQuantity', width: 10 }, // số lượng thiếu
				{ key: 'shortageAmount', width: 10 },
			],
			rows: dataRows,
			footerSheet: (worksheet: Worksheet, index: number) => {
				worksheet.addRow([''])
				worksheet
					.addRow([`${meta.reportCode}, ${meta.userFullName}, ngày in: ${timeToText(new Date(), 'DD/MM/YYYY hh:mm:ss')}`])
					.eachCell((cell) => {
						cell.font = { size: 10, bold: true, italic: true, name: 'Times New Roman' }
					})
			},
		})

		return workbook
	}
}
