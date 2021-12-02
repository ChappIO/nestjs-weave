import { DynamicModule, Module } from "@nestjs/common";
import { ConfigFactory } from "@nestjs/config";
import { ConfigurationModule } from "./config/ConfigurationModule";

export interface ApplicationOptions {
  configuration?: ConfigFactory[];
}

@Module({})
export class ApplicationModule {
  static forApp(module: any, options: ApplicationOptions = {}): DynamicModule {
    return {
      module: ApplicationModule,
      imports: [
        ConfigurationModule.forRoot(options.configuration || [])
      ]
    };
  }
}
