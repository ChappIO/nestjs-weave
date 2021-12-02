import { DynamicModule, Module } from "@nestjs/common";
import { ConfigFactory, ConfigModule } from "@nestjs/config";
import { loadEnv } from "./loadEnv";
import { loadDefaults } from "./loadDefaults";

@Module({})
export class ConfigurationModule {
  static forRoot(configuration: ConfigFactory[]): DynamicModule {
    return {
      module: ConfigurationModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          expandVariables: true,
          ignoreEnvVars: true,
          ignoreEnvFile: true,
          load: [
            loadDefaults,
            ...configuration,
            loadEnv,
          ]
        })
      ]
    };
  }
}
