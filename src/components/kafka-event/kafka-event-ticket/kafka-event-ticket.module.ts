import { Module } from '@nestjs/common'
import { KafkaEventTicketController } from './kafka-event-ticket.controller'
import { EventWarehouseCheckoutService } from './service/event-warehouse-checkout.service'
import { EventWarehouseExportService } from './service/event-warehouse-export.service'
import { EventWarehouseImportService } from './service/event-warehouse-import.service'
import { EventWarehouseTransferService } from './service/event-warehouse-transfer.service'

@Module({
	imports: [],
	controllers: [KafkaEventTicketController],
	providers: [
		EventWarehouseImportService,
		EventWarehouseExportService,
		EventWarehouseTransferService,
		EventWarehouseCheckoutService,
	],
})
export class KafkaEventTicketModule { }
