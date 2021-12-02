import { Module } from "@nestjs/common";
import { PrometheusModule } from "../prometheus/PrometheusModule";
import { TypeORMMetricsExporter } from "./TypeORMMetricsExporter";


@Module({
  imports: [
    PrometheusModule
  ],
  providers: [
    TypeORMMetricsExporter
  ]
})
export class TypeORMMetricsModule {

}
