import { NestWeaver } from "../NestWeaver";
import { Module } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("other_name")
export class SimpleEntity {
  @PrimaryGeneratedColumn()
  public id: number;
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
  ]
})
class AppModule {

}

NestWeaver.run(AppModule, {
  configuration: [
    () => ({
      postgres: {
        host: "localhost",
        database: "postgres",
        username: "postgres",
        password: "postgres"
      }
    })
  ]
});
