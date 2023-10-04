import { Cell, Style, Workbook, Worksheet } from 'exceljs'

export type TableColumns<T> = {
	key: keyof T;
	title: string;
	width?: number;
	style?: Partial<Style>;
};

export type TableData<T> = {
	[P in keyof T]?: any;
};

export const basicLayoutExcel = <T>(params: {
	table: {
		columns: TableColumns<T>[];
		data: TableData<T>[];
	};
	layout: { maxRowsTable?: number; startRowTable?: number; sheetName?: string };
	eachSheet?: (ws: Worksheet, index?: number) => void;
}): Workbook => {
	const { eachSheet, table, layout } = params
	const maxRowsTable = layout.maxRowsTable || 1000
	const startRowTable = layout.startRowTable || 3
	const sheetName = layout.sheetName || 'SHEET'

	const workbook = new Workbook()

	let indexSheet = 1
	table.data.forEach((item, index) => {
		if (index % maxRowsTable === 0) {
			const worksheet: Worksheet = workbook.addWorksheet(
				sheetName + indexSheet,
				{
					views: [{ showGridLines: false }],
					pageSetup: {
						orientation: 'portrait',
						fitToPage: true,
						margins: {
							left: 0.25,
							right: 0.25,
							top: 0.75,
							bottom: 0.75,
							header: 0.3,
							footer: 0.3,
						},
					},
					properties: { tabColor: { argb: '6B5B95' }, defaultRowHeight: 18.75 },
				}
			)

			worksheet.columns = table.columns.map((item) => ({
				key: item.key as string,
				width: item.width,
			}))

			worksheet.getRow(startRowTable).values = table.columns.map((item) => item.title)
			worksheet.getRow(startRowTable).eachCell((cell: Cell) => {
				cell.font = {
					size: 13,
					bold: true,
					name: 'Times New Roman',
				}
				cell.alignment = {
					vertical: 'middle',
					horizontal: 'center',
					wrapText: true,
				}
				cell.border = {
					top: { style: 'thin' },
					left: { style: 'thin' },
					bottom: { style: 'thin' },
					right: { style: 'thin' },
				}
			})
		}

		const worksheet = workbook.getWorksheet(sheetName + indexSheet)

		worksheet.addRow(item).eachCell((cell: Cell) => {
			const keyColumn = (cell as any)._column._key
			const style: Partial<Style>
				= table.columns.find((i) => i.key === keyColumn)?.style || {}
			cell.border = style.border || {
				top: { style: 'thin' },
				left: { style: 'thin' },
				bottom: { style: 'thin' },
				right: { style: 'thin' },
			}
			cell.font = style.font || {
				size: 12,
				bold: false,
				name: 'Times New Roman',
			}
			cell.alignment = style.alignment || {
				horizontal: 'right',
				wrapText: true,
			}
		})

		if (
			// Nếu là row cuối cùng của Sheet hoặc row cuối cùng của tất cả thì chạy callback Sheet
			index === table.data.length - 1
			|| index % maxRowsTable === maxRowsTable - 1
		) {
			if (eachSheet && typeof eachSheet === 'function') {
				eachSheet(worksheet, indexSheet)
			}
		}

		if (index % maxRowsTable === maxRowsTable - 1) {
			indexSheet++
		}
	})

	return workbook
}
