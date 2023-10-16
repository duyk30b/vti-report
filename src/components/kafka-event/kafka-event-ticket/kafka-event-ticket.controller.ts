import { Controller } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'
import { KafkaTopic } from 'src/modules/kafka/kafka.config'
import { EventWarehouseCheckoutRequest, EventWarehouseExportRequest, EventWarehouseImportRequest, EventWarehouseTransferRequest } from './request'
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

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_IMPORT.CONFIRM, Transport.KAFKA)
	async warehouseImportConfirm(@Payload() payload: EventWarehouseImportRequest) {
		console.log('🚀 ~ file: kafka-event-ticket.controller.ts:22 ~  ~ warehouseImportConfirm:', payload)
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_IMPORT.COMPLETE, Transport.KAFKA)
	async warehouseImportComplete(@Payload() payload: EventWarehouseImportRequest) {
		return this.eventWarehouseImportService.warehouseImportComplete(payload)
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_EXPORT.CONFIRM, Transport.KAFKA)
	async warehouseExportConfirm(@Payload() payload: EventWarehouseExportRequest) {
		console.log('🚀 ~ file: kafka-event-ticket.controller.ts:22 ~  ~ warehouseExportConfirm:', payload)
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_EXPORT.CONFIRM, Transport.KAFKA)
	async warehouseExportComplete(@Payload() payload: EventWarehouseExportRequest) {
		return this.eventWarehouseExportService.warehouseExportComplete(payload)
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_TRANSFER.CONFIRM, Transport.KAFKA)
	async warehouseTransferConfirm(@Payload() payload: EventWarehouseTransferRequest) {
		console.log('🚀 ~ file: kafka-event-ticket.controller.ts:22 ~  ~ warehouseTransferConfirm:', payload)
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_TRANSFER.CONFIRM, Transport.KAFKA)
	async warehouseTransferComplete(@Payload() payload: EventWarehouseTransferRequest) {
		return this.eventWarehouseTransferService.warehouseTransferComplete(payload)
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_CHECKOUT.CONFIRM, Transport.KAFKA)
	async warehouseCheckoutConfirm(@Payload() payload: EventWarehouseCheckoutRequest) {
		console.log('🚀 ~ file: kafka-event-ticket.controller.ts:22 ~  ~ warehouseCheckoutConfirm:', payload)
	}

	@MessagePattern(KafkaTopic.TICKET.WAREHOUSE_CHECKOUT.CONFIRM, Transport.KAFKA)
	async warehouseCheckoutComplete(@Payload() payload: EventWarehouseCheckoutRequest) {
		return this.eventWarehouseCheckoutService.warehouseCheckoutComplete(payload)
	}
}
