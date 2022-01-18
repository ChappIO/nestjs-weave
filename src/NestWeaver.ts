import {NestFactory} from "@nestjs/core";
import {INestApplication, Logger, NestApplicationOptions} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {ApplicationModule, WeaveApplicationOptions} from "./ApplicationModule";
import {ifPackageIsInstalled} from "./autoload/AutoConfigurationModule";

export class NestWeaver {
    public static async run<T extends INestApplication = INestApplication>(module: any, options: NestApplicationOptions & WeaveApplicationOptions = {}): Promise<void> {
        try {
            const app = await this.create<T>(module, options);
            const config = app.get(ConfigService);
            const log = new Logger(config.get("application.name"));
            if(options.onStart) {
                await options.onStart(app);
            }
            await app.listen(config.get("server.port")).then((srv) => {
                log.log(`Listening on port ${srv.address().port}`);
            });
        } catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

    public static async create<T extends INestApplication = INestApplication>(module: any, options: NestApplicationOptions & WeaveApplicationOptions = {}): Promise<T> {
        const {configuration, onStart, ...nestOptions} = options;

        const app = await NestFactory.create<T>(
            ApplicationModule.forRoot(module, {configuration}),
            nestOptions
        );
        app.enableShutdownHooks();
        const config = app.get(ConfigService);
        const log = new Logger(config.get("application.name"));

        ifPackageIsInstalled(
            ["@nestjs/swagger"],
            log,
            "Swagger API documentation",
            () => {
                const {SwaggerModule, DocumentBuilder} = require('@nestjs/swagger')

                SwaggerModule.setup(
                    config.get('internal.swagger.path'),
                    app,
                    SwaggerModule.createDocument(
                        app,
                        new DocumentBuilder()
                            .setTitle(config.get('internal.swagger.name'))
                            .setDescription(config.get('internal.swagger.description'))
                            .setVersion(config.get('internal.swagger.version'))
                            .build(),
                    ),
                );

            },
        );

        return app;
    }
}
