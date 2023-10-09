import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { KafkaTopic } from 'src/modules/kafka/kafka.config'
import { EventWarehouseImportConfirmRequest } from './request'
import { EventWarehouseCheckoutService } from './service/event-warehouse-checkout.service'
import { EventWarehouseExportService } from './service/event-warehouse-export.service'
import { EventWarehouseImportService } from './service/event-warehouse-import.service'
import { EventWarehouseTransferService } from './service/event-warehouse-transfer.service'

@Controller()
export class KafkaEventTicketController {
	constructor(
		private readonly eventWarehouseImportService: EventWarehouseImportService,
		private readonly eventWarehouseExportService: EventWarehouseExportService,
		private readonly eventWarehouseTransferService: EventWarehouseTransferService,
		private readonly eventWarehouseCheckoutService: EventWarehouseCheckoutService
	) {
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_IMPORT_CONFIRM, Transport.KAFKA)
	async warehouseImportConfirm(@Payload() payload: EventWarehouseImportConfirmRequest) {
		return this.eventWarehouseImportService.warehouseImportConfirm(payload)
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_EXPORT_CONFIRM, Transport.KAFKA)
	async warehouseExportConfirm(@Payload() payload: any) {
		return this.eventWarehouseExportService.warehouseExportConfirm(payload)
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_TRANSFER_CONFIRM, Transport.KAFKA)
	async warehouseTransferConfirm(@Payload() payload: any) {
		return this.eventWarehouseTransferService.warehouseTransferConfirm(payload)
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_CHECKOUT_CONFIRM, Transport.KAFKA)
	async warehouseCheckoutConfirm(@Payload() payload: any) {
		return this.eventWarehouseCheckoutService.warehouseCheckoutConfirm(payload)
	}
}
