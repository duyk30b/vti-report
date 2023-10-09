import { Injectable } from '@nestjs/common'
import { Workbook, Worksheet } from 'exceljs'
import { timeToText } from 'src/common/helpers'
import { advanceLayoutExcel } from 'src/common/utils/excel-advance.util'
import { NatsClientUserService } from 'src/modules/nats/service/nats-client-user.service'
import { WarehouseImport } from 'src/mongo/repository/warehouse-import/warehouse-import.schema'
import { ApiReportWarehouseExportQuery } from './api-report-warehouse-export.request'
import { WarehouseExportRepository } from 'src/mongo/repository/warehouse-export/warehouse-export.repository'

@Injectable()
export class ApiReportWarehouseExportService {
	constructor(
		private readonly warehouseExportRepository: WarehouseExportRepository,
		private readonly natsClientUserService: NatsClientUserService
	) { }

	async exportExcel(query: ApiReportWarehouseExportQuery, userId: number) {
		const { fromTime, toTime, warehouseId } = query

		const warehouseGroup = await this.warehouseExportRepository.report({
			warehouseId,
			fromTime,
			toTime,
		})
		const [user] = await this.natsClientUserService.getUsersByIds({ userIds: [userId] })

		const workbook = this.getWorkbookWarehouseExport(warehouseGroup, {
			fromTime,
			toTime,
			userFullName: user.fullName,
			reportCode: 'W03',
			warehouseTitle: warehouseId ? (warehouseGroup[0]?.warehouseName || '') : 'TẤT CẢ KHO',
			companyName: 'CÔNG TY CỔ PHẦN VTI',
			companyAddress: 'VTI Building, Mễ Trì Hạ, Nam Từ Liêm, Hà Nội',
		})

		const buffer = await workbook.xlsx.writeBuffer()
		return {
			xlsx: buffer,
			filename: `W03_Báo cáo tình hình nhập kho_${timeToText(fromTime, 'DDMMYYYY')}-${timeToText(toTime, 'DDMMYYYY')}`,
		}
	}

	getWorkbookWarehouseExport(data: {
		warehouseId: number,
		warehouseName: string,
		amount: number,
		templates: { templateCode: string, templateName: string, amount: number, tickets: WarehouseImport[] }[]
	}[], meta: {
		fromTime: Date,
		toTime: Date,
		reportCode: string,
		userFullName: string,
		warehouseTitle: string,
		companyName: string,
		companyAddress: string
	}): Workbook {
		const dataRows = []
		data.forEach((w) => {
			const rowWarehouse = {
				style: {
					_all: { font: { bold: true } },
					num: { mergeCells: { rowspan: 1, colspan: 12 }, alignment: { horizontal: 'left' } },
					amount: { numFmt: '###,##0' },
				},
				data: [{ num: `Kho: ${w.warehouseId}_${w.warehouseName}`, amount: w.amount }],
			}
			dataRows.push(rowWarehouse)
			w.templates.forEach((template) => {
				const rowTemplate = {
					style: {
						_all: { font: { bold: true } },
						num: { mergeCells: { rowspan: 1, colspan: 12 }, alignment: { horizontal: 'left' } },
						amount: { numFmt: '###,##0' },
					},
					data: [{ num: `Loại nghiệp vụ: ${template.templateName}`, amount: template.amount }],
				}
				dataRows.push(rowTemplate)
				template.tickets.forEach((ticket: WarehouseImport, ticketIndex: number) => {
					const rowTicket = {
						style: {
							num: { alignment: { horizontal: 'center' } },
							ticketCode: { font: { bold: true } },
							documentDate: { alignment: { horizontal: 'center' }, numFmt: 'dd/mm/yyyy' },
							description: { mergeCells: { rowspan: 1, colspan: 9 } },
							amount: { font: { bold: true }, numFmt: '###,##0' },
						},
						data: [
							{
								num: ticketIndex + 1,
								ticketCode: ticket.ticketCode,
								documentDate: ticket.documentDate,
								description: ticket.description || '',
								amount: ticket.amount,
							},
						],
					}
					dataRows.push(rowTicket)
					ticket.items.forEach((item) => {
						const rowItem = {
							style: {
								num: { mergeCells: { rowspan: 1, colspan: 3 } },
								description: { font: { bold: true }, mergeCells: { rowspan: 1, colspan: 2 } },
								unit: { alignment: { horizontal: 'center' } },
								lot: { alignment: { horizontal: 'center' } },
								manufacturingDate: { alignment: { horizontal: 'center' }, numFmt: 'dd/mm/yyyy' },
								importDate: { alignment: { horizontal: 'center' }, numFmt: 'dd/mm/yyyy' },
								quantity: { numFmt: '###,##0.00' },
								price: { numFmt: '###,##0.00' },
								amount: { numFmt: '###,##0' },
							},
							data: [
								{
									num: '',
									description: item.itemCode,
									itemName: item.itemName,
									unit: item.unit,
									importDate: item.importDate || '',
									lot: item.lot || '',
									manufacturingDate: item.manufacturingDate || '',
									quantity: item.quantity,
									price: item.price,
									amount: item.amount,
								},
							],
						}
						dataRows.push(rowItem)
					})
				})
			})
		})
		dataRows.push({
			style: {
				num: { font: { bold: true }, alignment: { horizontal: 'center' }, mergeCells: { rowspan: 1, colspan: 12 } },
				amount: { font: { bold: true }, numFmt: '###,##0' },
			},
			data: [{ num: 'TỔNG CỘNG', amount: data.reduce((acc, cur) => acc + cur.amount, 0) }],
		})

		const sheetName = `${meta.reportCode}_${timeToText(meta.fromTime, 'DDMMYYYY')}-${timeToText(meta.toTime, 'DDMMYYYY')}`

		const workbook = advanceLayoutExcel({
			layout: {
				maxRowsTable: 1000,
				sheetName,
			},
			headerSheet: (worksheet: Worksheet, index: number) => {
				worksheet.addRow([meta.companyName]).eachCell((cell) => {
					cell.font = {
						size: 10,
						bold: true,
						name: 'Times New Roman',
					}
				})
				worksheet.addRow([meta.companyAddress]).eachCell((cell) => {
					cell.font = {
						size: 10,
						bold: true,
						name: 'Times New Roman',
					}
				})
				worksheet.addRow(['BÁO CÁO TÌNH XUẤT NHẬP KHO']).eachCell((cell) => {
					cell.font = {
						size: 14,
						bold: true,
						name: 'Times New Roman',
					}
					cell.alignment = { horizontal: 'center' }
				})
				worksheet.mergeCells(3, 1, 3, 13)
				worksheet.addRow([meta.warehouseTitle.toUpperCase()]).eachCell((cell) => {
					cell.font = {
						size: 12,
						bold: true,
						name: 'Times New Roman',
					}
					cell.alignment = { horizontal: 'center' }
				})
				worksheet.mergeCells(4, 1, 4, 13)
				worksheet.addRow([`Từ ngày: ${timeToText(meta.fromTime, 'DD/MM/YYYY')} đến ngày ${timeToText(meta.toTime, 'DD/MM/YYYY')}`])
					.eachCell((cell) => {
						cell.font = {
							size: 10,
							bold: true,
							name: 'Times New Roman',
						}
						cell.alignment = { horizontal: 'center' }
					})
				worksheet.mergeCells(5, 1, 5, 13)
				worksheet.addRow([
					'STT',
					'Mã phiếu xuất',
					'Ngày chứng từ',
					'Diễn giải',
					'Mã sản phẩm',
					'Tên sản phẩm',
					'ĐVT',
					'Lô',
					'Ngày sản xuất',
					'Ngày nhập kho',
					'Số lượng',
					'Đơn giá',
					'Thành tiền',
				]).eachCell((cell) => {
					cell.font = {
						size: 9,
						bold: true,
						name: 'Times New Roman',
					}
					cell.alignment = { horizontal: 'center', vertical: 'middle' }
					cell.fill = {
						type: 'pattern',
						pattern: 'solid',
						fgColor: { argb: 'D8D8D8' },
						bgColor: { argb: 'D8D8D8' },
					}
					cell.border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					}
				})
			},
			columns: [
				{ key: 'num', width: 10 },
				{ key: 'ticketCode', width: 10 },
				{ key: 'documentDate', width: 10 },
				{ key: 'description', width: 10 },
				{ key: 'itemCode', width: 10 },
				{ key: 'itemName', width: 30 },
				{ key: 'unit', width: 10 },
				{ key: 'lot', width: 10 },
				{ key: 'manufacturingDate', width: 10 },
				{ key: 'importDate', width: 10 },
				{ key: 'quantity', width: 10 },
				{ key: 'price', width: 10 },
				{ key: 'amount', width: 10 },
			],
			rows: dataRows,
			footerSheet: (worksheet: Worksheet, index: number) => {
				worksheet.addRow([''])
				worksheet
					.addRow([`${meta.reportCode}, ${meta.userFullName}, ngày in: ${timeToText(new Date(), 'DD/MM/YYYY hh:mm:ss')}`])
					.eachCell((cell) => {
						cell.font = {
							size: 10,
							bold: true,
							italic: true,
							name: 'Times New Roman',
						}
					})
			},
		})

		return workbook
	}
}
