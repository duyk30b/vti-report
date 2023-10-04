import { Expose } from 'class-transformer'
import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../common/base.entity'

// @Entity('warehouse_import')
// export default class WarehouseImport extends BaseEntity {
// 	@Column({ name: 'warehouse_id' })
// 	@Expose()
// 	warehouseId: number

// 	@Column({ name: 'warehouse_name' })
// 	@Expose()
// 	warehouseName: string

// 	@Column({ name: 'template_code' })
// 	@Expose()
// 	templateCode: string

// 	@Column({ name: 'template_name' })
// 	@Expose()
// 	templateName: string

// 	@Column({ name: 'ticket_id' })
// 	@Expose()
// 	ticketId: string

// 	@Column({ name: 'ticket_code' })
// 	@Expose()
// 	ticketCode: string

// 	@Column({ name: 'document_date' })
// 	@Expose()
// 	documentDate: string                                    // Ngày chứng từ

// 	@Column({ name: 'description' })
// 	@Expose()
// 	description: string

// 	@Column({ name: 'item_code' })
// 	@Expose()
// 	itemCode: string

// 	@Column({ name: 'item_name' })
// 	@Expose()
// 	itemName: string

// 	@Column({ name: 'unit' })
// 	@Expose()
// 	unit: string

// 	@Column({ name: 'import_date' })
// 	@Expose()
// 	importDate: string                                    // Ngày nhập kho

// 	@Column({ name: 'lot', nullable: true })
// 	@Expose()
// 	lot: string

// 	@Column({ name: 'manufacturing_date' })
// 	@Expose()
// 	manufacturingDate: string                             // Ngày sản xuất

// 	@Column({ name: 'quantity' })
// 	@Expose()
// 	quantity: number

// 	@Column({ name: 'price' })
// 	@Expose()
// 	price: number                                        // Đơn giá

// 	@Column({ name: 'amount' })
// 	@Expose()
// 	amount: number                                       // Thành tiền, amount = quantity * price
// }