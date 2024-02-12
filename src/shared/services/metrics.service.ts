import { Injectable } from '@nestjs/common';
import * as os from 'os-utils';
import { Counter, register, Gauge } from 'prom-client';

@Injectable()
export class MetricsService {
  private healthCheckCounter: Counter;
  private cpuUsageGauge: Gauge;
  private cpuFreeGauge: Gauge;

  constructor() {
    this.healthCheckCounter = new Counter({
      name: 'users_be_health_check_counter',
      help: 'Total number of requests to the Health Check',
    });
    this.cpuUsageGauge = new Gauge({
      name: 'users_be_cpu_usage_gauge',
      help: 'Total usage of cpu',
    });
    this.cpuFreeGauge = new Gauge({
      name: 'users_be_cpu_free_gauge',
      help: 'Total free cpu',
    });
    register.clear();
    register.setDefaultLabels({ app: 'users_be' });
    register.registerMetric(this.healthCheckCounter);
    register.registerMetric(this.cpuUsageGauge);
    register.registerMetric(this.cpuFreeGauge);
    this.initInterval();
  }

  initInterval(): void {
    setInterval(() => {
      os.cpuUsage((v: number) => this.cpuUsageGauge.set(v));
      os.cpuFree((v: number) => this.cpuFreeGauge.set(v));
    }, 3000);
  }

  incrementRequestCounter(): void {
    this.healthCheckCounter.inc();
  }

  async getMetrics(): Promise<string> {
    return register.metrics();
  }
}
