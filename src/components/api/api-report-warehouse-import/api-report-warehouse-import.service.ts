import { Injectable } from '@nestjs/common'
import { Workbook, Worksheet } from 'exceljs'
import { timeToText } from 'src/common/helpers'
import { advanceLayoutExcel } from 'src/common/utils/excel-advance.util'
import { NatsClientUserService } from 'src/modules/nats/service/nats-client-user.service'
import { WarehouseImportRepository } from 'src/mongo/repository/warehouse-import/warehouse-import.repository'
import { WarehouseImport } from 'src/mongo/repository/warehouse-import/warehouse-import.schema'
import { ApiReportWarehouseImportQuery } from './api-report-warehouse-import.request'

@Injectable()
export class ApiReportWarehouseImportService {
	constructor(
		private readonly warehouseImportRepository: WarehouseImportRepository,
		private readonly natsClientUserService: NatsClientUserService
	) { }

	async exportExcel(query: ApiReportWarehouseImportQuery, userId: number) {
		const { fromTime, toTime, warehouseId } = query

		const warehouseGroup = await this.warehouseImportRepository.report({
			warehouseId,
			fromTime,
			toTime,
		})
		const [user] = await this.natsClientUserService.getUsersByIds({ userIds: [userId] })

		const workbook = this.getWorkbookWarehouseImport(warehouseGroup, {
			fromTime,
			toTime,
			userFullName: user.fullName,
			reportCode: 'W3',
			warehouseTitle: warehouseId ? (warehouseGroup[0]?.warehouseName || '') : 'TẤT CẢ KHO',
		})

		const buffer = await workbook.xlsx.writeBuffer()
		return {
			xlsx: buffer,
			filename: `W03_Báo cáo tình hình nhập kho_${timeToText(fromTime, 'DDMMYYYY')}-${timeToText(toTime, 'DDMMYYYY')}`,
		}
	}

	async getWarehouseImports() {
		const fromTime = new Date('2023-09-17T17:00:00.000Z')
		const toTime = new Date('2023-09-20T17:00:00.000Z')

		const warehouseImports = await this.warehouseImportRepository.findManyBy({
			$or: [
				{
					documentDate: {
						$gte: fromTime,
						$lt: toTime,
					},
				},
				{
					$and: [
						{ documentDate: { $eq: null } },
						{
							importDate: {
								$gte: fromTime,
								$lt: toTime,
							},
						},
					],
				},
			],
		})
		const warehouseGroup: any[] = []
		warehouseImports.forEach((warehouseImport: WarehouseImport) => {
			let warehouseGroupItem = warehouseGroup.find((i) => i.warehouseId === warehouseImport.warehouseId)
			if (!warehouseGroupItem) {
				warehouseGroupItem = {
					warehouseId: warehouseImport.warehouseId,
					warehouseName: warehouseImport.warehouseName,
					amount: 0,
					templates: [],
				}
				warehouseGroup.push(warehouseGroupItem)
			}
			warehouseGroupItem.amount += warehouseImport.amount

			let templateGroupItem = warehouseGroupItem.templates.find((i: any) => i.templateCode === warehouseImport.templateCode)
			if (!templateGroupItem) {
				templateGroupItem = {
					templateCode: warehouseImport.templateCode,
					templateName: warehouseImport.templateName,
					amount: 0,
					tickets: [],
				}
				warehouseGroupItem.templates.push(templateGroupItem)
			}
			templateGroupItem.tickets.push(warehouseImport)

			templateGroupItem.amount += warehouseImport.amount
		})

		const workbook = this.getWorkbookWarehouseImport(warehouseGroup, {
			fromTime,
			toTime,
			userFullName: 'Bùi Minh',
			reportCode: 'W3',
			warehouseTitle: 'Kho example',
		})

		const buffer = await workbook.xlsx.writeBuffer()
		// workbook.xlsx.writeFile(`demo${Math.floor(Math.random() * 1000)}.xlsx`);
		return { xlsx: buffer }
	}

	getWorkbookWarehouseImport(data: {
		warehouseId: number,
		warehouseName: string,
		amount: number,
		templates: { templateCode: string, templateName: string, amount: number, tickets: WarehouseImport[] }[]
	}[], meta: { fromTime: Date, toTime: Date, reportCode: string, userFullName: string, warehouseTitle: string }): Workbook {
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
							documentDate: { alignment: { horizontal: 'center' } },
							ticketCode: { font: { bold: true } },
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
								manufacturingDate: { alignment: { horizontal: 'center' } },
								importDate: { alignment: { horizontal: 'center' } },
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

		const sheetName = `W03_${timeToText(meta.fromTime, 'DDMMYYYY')}-${timeToText(meta.toTime, 'DDMMYYYY')}`

		const workbook = advanceLayoutExcel({
			layout: {
				maxRowsTable: 1000,
				sheetName,
			},
			headerSheet: (worksheet: Worksheet, index: number) => {
				worksheet.addRow(['CÔNG TY CỔ PHẦN VTI']).eachCell((cell) => {
					cell.font = {
						size: 10,
						bold: true,
						name: 'Times New Roman',
					}
				})
				worksheet.addRow(['VTI Building, Mễ Trì Hạ, Nam Từ Liêm, Hà Nội']).eachCell((cell) => {
					cell.font = {
						size: 10,
						bold: true,
						name: 'Times New Roman',
					}
				})
				worksheet.addRow(['BÁO CÁO TÌNH HÌNH NHẬP KHO']).eachCell((cell) => {
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
					'Mã phiếu nhập',
					'Ngày chứng từ',
					'Diễn giải',
					'Mã sản phẩm',
					'Tên sản phẩm',
					'ĐVT',
					'Ngày nhập kho',
					'Lô',
					'Ngày sản xuất',
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
				{ key: 'importDate', width: 10 },
				{ key: 'lot', width: 10 },
				{ key: 'manufacturingDate', width: 10 },
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
