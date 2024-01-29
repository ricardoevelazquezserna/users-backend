import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AppService {
  getHealth(): string {
    return `I'm Healthy and running the version ${process.env.VERSION}`;
  }
}
