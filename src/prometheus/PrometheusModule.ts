import { Global, Module } from "@nestjs/common";
import { collectDefaultMetrics, Registry } from "prom-client";
import { MetricsController } from "./MetricsController";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { RequestMetricsCollector } from "./RequestMetricsCollector";
import { UptimeMetricCollector } from "./UptimeMetricCollector";

@Global()
@Module({
  providers: [
    {
      provide: Registry,
      useFactory: () => {
        const register = new Registry();
        collectDefaultMetrics({
          register: register
        });
        return register;
      },
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestMetricsCollector
    },
    UptimeMetricCollector,
  ],
  controllers: [MetricsController],
  exports: [Registry]
})
export class PrometheusModule {

}
