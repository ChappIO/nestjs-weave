import { NestWeaver } from "../NestWeaver";
import { Injectable, Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Entity, PrimaryGeneratedColumn } from "typeorm";
import { Gauge, Registry } from "prom-client";


@Entity("other_name")
export class SimpleEntity {
  @PrimaryGeneratedColumn()
  public id: number;
}

@Injectable()
export class CustomMetricsService {
  constructor(registry: Registry) {
    new Gauge({
      registers: [registry],
      labelNames: ["name"],
      name: "random_number",
      help: "A random number",
      async collect() {
        this.inc(
          { name: "test" },
          Math.round(Math.random() * 100)
        );
      }
    });
  }
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config): TypeOrmModuleOptions => ({
        type: "postgres",
        applicationName: config.get("application.name"),
        ...config.get("postgres"),
        synchronize: true,
        autoLoadEntities: true,
        installExtensions: true
      })
    }),
    TypeOrmModule.forFeature([SimpleEntity])
  ],
  providers: [
    CustomMetricsService
  ]
})
class AppModule {

}

NestWeaver.run(AppModule, {
  configuration: [
    () => ({
      application: {
        name: "Weave Tester"
      },
      postgres: {
        host: "localhost",
        database: "postgres",
        username: "postgres",
        password: "postgres"
      }
    })
  ]
});
