export interface IQueueMessage {
	data: Record<string, any>
	messageId: string
	createTime: string
}

export interface IPingQueueMessage extends IQueueMessage {
}

export interface IWarehouseImportMessage extends IQueueMessage {
	groupKey: string
}
