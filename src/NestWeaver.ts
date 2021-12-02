import { NestFactory } from "@nestjs/core";
import { INestApplication, Logger, NestApplicationOptions } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApplicationModule } from "./ApplicationModule";

export class NestWeaver {
  public static async run<T extends INestApplication = INestApplication>(module: any, options: NestApplicationOptions = {}): Promise<void> {
    try {
      const app = await this.create<T>(module, options);
      const config = app.get(ConfigService);
      const log = new Logger(config.get("application.name"));
      await app.listen(config.get("server.port")).then((srv) => {
        log.log(`Listening on port ${srv.address().port}`);
      });
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  public static async create<T extends INestApplication = INestApplication>(module: any, options: NestApplicationOptions = {}): Promise<T> {
    const app = await NestFactory.create<T>(
      ApplicationModule.forApp(module),
      options
    );

    return app;
  }
}
