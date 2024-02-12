import { Global, Module } from '@nestjs/common';
import { MetricsService } from './services/metrics.service';

@Global()
@Module({
  exports: [MetricsService],
  providers: [MetricsService],
})
export class SharedModule {}
