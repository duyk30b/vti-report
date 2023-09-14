import { APIPrefix } from '@core/common';
import { ConfigService } from '@core/config/config.service';
import { NATS_REPORT, NatsConfig } from '@core/config/nats.config';
import { ExceptionInterceptor } from '@core/interceptors/exception.interceptor';
import { FilterQueryPipe } from '@core/pipe/filter-query.pipe';
import { SortQueryPipe } from '@core/pipe/sort-query.pipe';
import { NestFactory } from '@nestjs/core';
import { TcpOptions, Transport } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fastifyMultipart from 'fastify-multipart';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fastifyAdapter.register(fastifyMultipart, {
    attachFieldsToBody: true,
    addToBody: true,
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      logger:
        process.env.NODE_ENV === 'development'
          ? ['debug', 'error', 'log', 'verbose', 'warn']
          : ['error'],
    },
  );

  app.connectMicroservice(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: process.env.KAFKA_BROKERS.split(',') || ['kafka:9092'],
          ssl: {
            rejectUnauthorized: false,
            ca: [
              fs.readFileSync(path.join(__dirname, '/cert/kafka.crt'), 'utf-8'),
            ],
            key: fs.readFileSync(
              path.join(__dirname, '/cert/kafka.key'),
              'utf-8',
            ),
            cert: fs.readFileSync(
              path.join(__dirname, '/cert/kafka.pem'),
              'utf-8',
            ),
          },
          sasl: {
            mechanism: 'plain',
            username: process.env.KAFKA_SASL_USERNAME,
            password: process.env.KAFKA_SASL_PASSWD,
          },
        },
        consumer: {
          groupId: `report-service`,
          allowAutoTopicCreation: true,
          waitForLeaders: true,
        },
      },
    },
    { inheritAppConfig: true },
  );

  app.connectMicroservice(
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: new ConfigService().get('port'),
      },
    } as TcpOptions,
    { inheritAppConfig: true },
  );

  app.connectMicroservice(
    {
      transport: Transport.NATS,
      options: {
        servers: NatsConfig().servers,
        queue: NATS_REPORT,
      },
    },
    { inheritAppConfig: true },
  );

  await app.startAllMicroservices();
  app.setGlobalPrefix(APIPrefix.Version);

  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addBearerAuth(
      { type: 'http', description: 'Access token' },
      'access-token',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v1/reports/swagger-docs', app, document);

  let corsOptions = {};
  const configService = new ConfigService();
  if (configService.get('corsOrigin')) {
    corsOptions = {
      origin: new ConfigService().get('corsOrigin'),
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  app.register(require('@fastify/cors'), corsOptions);
  app.useGlobalPipes(new SortQueryPipe());
  app.useGlobalPipes(new FilterQueryPipe());
  app.useGlobalInterceptors(new ExceptionInterceptor());

  await app.listen(new ConfigService().get('httpPort'), '0.0.0.0');
}

bootstrap();
