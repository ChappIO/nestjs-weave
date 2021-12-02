import { Injectable, OnModuleInit } from "@nestjs/common";
import { Gauge, Registry } from "prom-client";
import { EntityManager } from "typeorm";

@Injectable()
export class TypeORMMetricsExporter implements OnModuleInit {
  constructor(
    private readonly manager: EntityManager,
    private readonly register: Registry
  ) {
  }

  onModuleInit(): void {
    const manager = this.manager;
    this.register.registerMetric(
      new Gauge({
        name: "entity_count",
        help: "Number of rows in the database per entity",
        labelNames: ["entity"],
        async collect() {
          await Promise.all(
            manager.connection.entityMetadatas.map(async (meta) => {
              this.set(
                { entity: meta.tableName },
                await manager.count(meta.name)
              );
            })
          );
        }
      })
    );
  }
}
