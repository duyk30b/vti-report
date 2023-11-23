import { Injectable } from '@nestjs/common'
import { Workbook, Worksheet } from 'exceljs'
import { endOfDay, startOfDay, timeToText } from 'src/common/helpers'
import { advanceLayoutExcel, cellHeaderStyle } from 'src/common/utils/excel-advance.util'
import { NatsClientUserService } from 'src/modules/nats/service/nats-client-user.service'
import { NatsClientWarehouseService } from 'src/modules/nats/service/nats-client-warehouse.service'
import { ItemRepository } from 'src/mongo/repository/item/item.repository'
import { ItemType } from 'src/mongo/repository/item/item.schema'
import { ApiReportItemQuery } from './api-report-item.request'

@Injectable()
export class ApiReportItemService {
	constructor(
		private readonly itemRepository: ItemRepository,
		private readonly natsClientUserService: NatsClientUserService,
		private readonly natsClientWarehouseService: NatsClientWarehouseService
	) {}

	async exportExcel(query: ApiReportItemQuery, userId: number) {
		const { time, warehouseId } = query

		const x = await this.natsClientWarehouseService.getWarehouses({ ids: [48] })
		console.log('🚀 ~ file: api-report-item.service.ts:23 ~ ApiReportItemService ~ exportExcel ~ x:', x)
		return x

		const warehouseGroup = await this.itemRepository.report({
			warehouseId,
			fromTime: startOfDay(time, -420),
			toTime: endOfDay(time, -420),
		})
		const [user] = await this.natsClientUserService.getUsersByIds({ userIds: [userId] })

		const workbook = this.getWorkbookItem(warehouseGroup, {
			time,
			userFullName: user.fullName,
			reportCode: 'W01',
			warehouseTitle: warehouseId ? warehouseGroup[0]?.warehouseName || '' : 'TẤT CẢ KHO',
			companyName: 'CÔNG TY CỔ PHẦN VTI',
			companyAddress: 'VTI Building, Mễ Trì Hạ, Nam Từ Liêm, Hà Nội',
		})

		const buffer = await workbook.xlsx.writeBuffer()
		return {
			xlsx: buffer,
			filename: `W01_Thong ke ton kho_${timeToText(time, 'DDMMYYYY')}`,
		}
	}

	getWorkbookItem(
		data: { warehouseId: number; warehouseName: string; items: ItemType[] }[],
		meta: {
			time: Date
			reportCode: string
			userFullName: string
			warehouseTitle: string
			companyName: string
			companyAddress: string
		}
	): Workbook {
		const dataRows = []
		data.forEach((w) => {
			dataRows.push({
				style: { num: { font: { bold: true }, mergeCells: { colspan: 10 } } },
				data: [{ num: `Kho: ${w.warehouseId}_${w.warehouseName}` }],
			})

			const dataItem: any[] = []
			w.items.forEach((item, index) => {
				item.stocks.forEach((stock) => {
					dataItem.push({
						itemCode: item.itemCode,
						itemName: item.itemName,
						unit: item.unit,
						lot: stock.lot,
						manufacturingDate: stock.manufacturingDate,
						importDate: stock.importDate,
						locatorName: stock.locatorName,
						status: stock.status,
						quantity: stock.quantity,
					})
				})
			})

			dataRows.push({
				style: {
					num: { alignment: { horizontal: 'center' } },
					unit: { alignment: { horizontal: 'center' } },
					lot: { alignment: { horizontal: 'center' } },
					manufacturingDate: { alignment: { horizontal: 'center' }, numFmt: 'dd/mm/yyyy' },
					importDate: { alignment: { horizontal: 'center' }, numFmt: 'dd/mm/yyyy' },
					status: { alignment: { horizontal: 'center' } },
					quantity: { numFmt: '###,##0.00' },
				},
				data: dataItem.map((item, index) => ({
					num: index + 1,
					...item,
				})),
			})
		})

		const sheetName = `${meta.reportCode}_${timeToText(meta.time, 'DDMMYYYY')}`

		const workbook = advanceLayoutExcel({
			layout: { maxRowsTable: 1000, sheetName },
			headerSheet: (worksheet: Worksheet, index: number) => {
				worksheet.addRow([meta.companyName]).eachCell((cell) => {
					cell.font = { size: 10, bold: true, name: 'Times New Roman' }
				})
				worksheet.addRow([meta.companyAddress]).eachCell((cell) => {
					cell.font = { size: 10, bold: true, name: 'Times New Roman' }
				})
				worksheet.addRow(['THỐNG KÊ TỒN KHO']).eachCell((cell) => {
					cell.font = { size: 14, bold: true, name: 'Times New Roman' }
					cell.alignment = { horizontal: 'center' }
				})
				worksheet.mergeCells(3, 1, 3, 10)
				worksheet.addRow([meta.warehouseTitle.toUpperCase()]).eachCell((cell) => {
					cell.font = { size: 12, bold: true, name: 'Times New Roman' }
					cell.alignment = { horizontal: 'center' }
				})
				worksheet.mergeCells(4, 1, 4, 10)
				worksheet.addRow([`Ngày: ${timeToText(meta.time, 'DD/MM/YYYY hh:mm:ss')}`]).eachCell((cell) => {
					cell.font = { size: 10, bold: true, name: 'Times New Roman' }
					cell.alignment = { horizontal: 'center' }
				})
				worksheet.mergeCells(5, 1, 5, 10)
				worksheet
					.addRow({
						num: 'STT',
						itemCode: 'Mã sản phẩm',
						itemName: 'Tên vật tư',
						unit: 'ĐVT',
						lot: 'Lô',
						manufacturingDate: 'Ngày sản xuất',
						importDate: 'Ngày nhập kho',
						locatorName: 'Vị trí',
						status: 'Trạng thái',
						quantity: 'SL Tồn',
					})
					.eachCell(cellHeaderStyle)
			},
			columns: [
				{ key: 'num', width: 10 },
				{ key: 'itemCode', width: 10 },
				{ key: 'itemName', width: 30 },
				{ key: 'unit', width: 10 },
				{ key: 'lot', width: 10 },
				{ key: 'manufacturingDate', width: 10 },
				{ key: 'importDate', width: 10 },
				{ key: 'locatorName', width: 10 },
				{ key: 'status', width: 10 },
				{ key: 'quantity', width: 10 },
			],
			rows: dataRows,
			footerSheet: (worksheet: Worksheet, index: number) => {
				worksheet.addRow([''])
				worksheet
					.addRow([
						`${meta.reportCode}, ${meta.userFullName}, ngày in: ${timeToText(new Date(), 'DD/MM/YYYY hh:mm:ss')}`,
					])
					.eachCell((cell) => {
						cell.font = { size: 10, bold: true, italic: true, name: 'Times New Roman' }
					})
			},
		})

		return workbook
	}
}
