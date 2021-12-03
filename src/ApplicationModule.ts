import {DynamicModule, INestApplication, Module} from "@nestjs/common";
import {ConfigFactory} from "@nestjs/config";
import {ConfigurationModule} from "./config/ConfigurationModule";
import {AutoConfigurationModule} from "./autoload/AutoConfigurationModule";

export interface WeaveApplicationOptions {
    configuration?: ConfigFactory[];
    onStart?: (app: INestApplication) => void | Promise<void>;
}

@Module({})
export class ApplicationModule {
    static forRoot(module: any, options: WeaveApplicationOptions = {}): DynamicModule {
        return {
            module: ApplicationModule,
            imports: [
                ConfigurationModule.forRoot(options.configuration || []),
                AutoConfigurationModule.forRoot(),
                module,
            ]
        };
    }
}
