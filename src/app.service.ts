import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): string {
    return `I'm Healthy and running the version ${process.env.VERSION}`;
  }
}
