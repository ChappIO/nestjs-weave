import { Module } from "@nestjs/common";
import { collectDefaultMetrics, Registry } from "prom-client";
import { MetricsController } from "./MetricsController";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { RequestMetricsCollector } from "./RequestMetricsCollector";

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
      }
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestMetricsCollector
    }
  ],
  controllers: [MetricsController],
  exports: [Registry]
})
export class PrometheusModule {

}
