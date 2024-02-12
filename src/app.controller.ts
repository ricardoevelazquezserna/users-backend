import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MetricsService } from './shared/services/metrics.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly metricsService: MetricsService,
  ) {}

  @Get()
  getHealth(): string {
    this.metricsService.incrementRequestCounter();
    return this.appService.getHealth();
  }

  @Get('metrics')
  async getMetrics(): Promise<string> {
    return await this.metricsService.getMetrics();
  }
}
