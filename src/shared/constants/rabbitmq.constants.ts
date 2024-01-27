import { ClientsModuleOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config();

export const NOTIFICATION_SERVICE_OPTIONS: ClientsModuleOptions = [
  {
    name: 'NOTIFICATION_SERVICE',
    transport: Transport.RMQ,
    options: {
      urls: [process.env.CLOUD_AMQP_CONNECTION_STRING],
      queue: 'notifications_queue',
      queueOptions: {
        durable: false,
      },
    },
  },
];
