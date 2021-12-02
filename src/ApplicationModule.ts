import { DynamicModule, Module } from "@nestjs/common";
import { ConfigFactory } from "@nestjs/config";
import { ConfigurationModule } from "./config/ConfigurationModule";
import { AutoConfigurationModule } from "./autoload/AutoConfigurationModule";

export interface ApplicationOptions {
  configuration?: ConfigFactory[];
}

@Module({})
export class ApplicationModule {
  static forApp(module: any, options: ApplicationOptions = {}): DynamicModule {
    return {
      module: ApplicationModule,
      imports: [
        ConfigurationModule.forRoot(options.configuration || []),
        AutoConfigurationModule.forRoot(),
      ]
    };
  }
}
