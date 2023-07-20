import { registerAs } from '@nestjs/config';
import 'dotenv/config';

export const NatsConfig = registerAs('nats', () => ({
  servers: process.env.NATS_SERVERS?.split(',') || ['nats://nats:4222'],
}));

export const NATS_AUTH = process.env.NATS_AUTH_SERVICE || 'auth_service';
export const NATS_USER = process.env.NATS_USER_SERVICE || 'user_service';

export const NATS_REQUEST =
  process.env.NATS_REQUEST_SERVICE || 'request_service';

export const NATS_WAREHOUSE =
  process.env.NATS_USER_SERVICE || 'warehouse_service';

export const NATS_PROCEDURE =
  process.env.NATS_USER_SERVICE || 'procedure_service';

export const NATS_ATTRIBUTE =
  process.env.NATS_ATTRIBUTE_SERVICE || 'attribute_service';

export const NATS_SALE = process.env.NATS_SALE_SERVICE || 'sale_service';
export const NATS_ITEM = process.env.NATS_ITEM_SERVICE || 'item_service';
export const NATS_MMS = process.env.NATS_MMS_SERVICE || 'mms_service';

export const NATS_NOTIFICATION =
  process.env.NATS_NOTIFICATION_SERVICE || 'notification_service';

export const NATS_PLAN = process.env.NATS_PLAN_SERVICE || 'plan_service';

export const NATS_PURCHASED_ORDER =
  process.env.NATS_PURCHASED_ORDER_SERVICE || 'purchased_order_service';

export const NATS_REPORT = process.env.NATS_REPORT_SERVICE || 'report_service';
