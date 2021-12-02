import { Injectable } from "@nestjs/common";
import { Gauge, Registry } from "prom-client";

@Injectable()
export class UptimeMetricCollector {

  constructor(register: Registry) {
    const startedAt = Date.now();
    new Gauge({
      registers: [register],
      name: "application_uptime",
      help: "Uptime of the application in seconds",
      collect() {
        this.set({}, Math.floor((Date.now() - startedAt) / 1000));
      }
    });
  }
}
