import { Transport } from '@nestjs/microservices';
export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {
      port: process.env.SERVER_PORT,
      httpPort: process.env.SERVER_HTTP_PORT || 3001,
      otpMinNumber: parseInt(process.env.OTP_MIN_NUMBER),
      otpMaxNumber: parseInt(process.env.OTP_MAX_NUMBER),
      otpTimeout: parseInt(process.env.OTP_TIME_OUT),
      saltOrRounds: parseInt(process.env.SALT_OR_ROUNDS),
    };
    this.envConfig.baseUri = process.env.BASE_URI;

    this.envConfig.warehouseService = {
      options: {
        port: process.env.WAREHOUSE_SERVICE_PORT || 3000,
        host: process.env.WAREHOUSE_SERVICE_HOST || 'warehouse-service',
      },
      transport: Transport.TCP,
    };
    this.envConfig.userService = {
      options: {
        port: process.env.USER_SERVICE_PORT || 3000,
        host: process.env.USER_SERVICE_HOST || 'user-service',
      },
      transport: Transport.TCP,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
