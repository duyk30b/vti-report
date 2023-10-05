import { KafkaOptions, Transport } from '@nestjs/microservices'
import 'dotenv/config'
import * as fs from 'fs'
import { Partitioners } from 'kafkajs'
import * as path from 'path'

export const KafkaConfig: KafkaOptions = {
	transport: Transport.KAFKA,
	options: {
		client: {
			clientId: process.env.KAFKA_INSTANCE_ID || 'report-service',
			brokers: process.env.KAFKA_BROKERS?.split(',') || ['kafka:9092'],
			ssl: {
				rejectUnauthorized: false,
				ca: [fs.readFileSync(path.join(__dirname, '/../../cert/kafka.crt'), 'utf-8')],
				key: fs.readFileSync(path.join(__dirname, '/../../cert/kafka.key'), 'utf-8'),
				cert: fs.readFileSync(path.join(__dirname, '/../../cert/kafka.pem'), 'utf-8'),
			},
		},
		consumer: {
			groupId: 'group-' + (process.env.KAFKA_INSTANCE_ID || 'report-service'),
			allowAutoTopicCreation: true,
		},
		producer: {
			allowAutoTopicCreation: true,
			idempotent: true, // Mỗi tin nhắn được gửi chính xác 1 lần
			createPartitioner: Partitioners.LegacyPartitioner,
		},
		send: { acks: -1 }, // ack = -1 => "all": tất cả các replicas đều xác nhận đã ghi tin nhắn
	},
}

export const KafkaTopic = {
	REPORT: { PING: 'report_service.ping' },
	TICKET: {
		PING: 'ticket_service.ping',
		WAREHOUSE_IMPORT_CONFIRM: 'ticket_service.warehouse_import_confirm',
		WAREHOUSE_EXPORT_CONFIRM: 'ticket_service.warehouse_export_confirm',
		WAREHOUSE_TRANSFER_CONFIRM: 'ticket_service.warehouse_transfer_confirm',
		WAREHOUSE_CHECKOUT_CONFIRM: 'ticket_service.warehouse_checkout_confirm',
	},
	ITEM: {
		PING: 'item_service.ping',
		CREATE_ITEM: 'item_service.create_item',
		UPDATE_ITEM: 'item_service.update_item',
	},
}
