import { DynamicModule, Logger, Module, ModuleMetadata } from "@nestjs/common";

export function ifPackageIsInstalled(packageNames: string[], logger: Logger, description: string, register: () => void) {
  try {
    for (let packageName of packageNames) {
      require.resolve(packageName);
    }
    logger.log(`Found package "${packageNames.join(" and ")}": ${description} enabled`);
    register();
    return true;
  } catch (e) {
    logger.log(`Package "${packageNames.join(" and ")}" not present: ${description} disabled`);
    return false;
  }
}

@Module({})
export class AutoConfigurationModule {
  static forRoot(): DynamicModule {

    const imports: ModuleMetadata["imports"] = [];
    const log = new Logger("ModuleAutoLoader");

    ifPackageIsInstalled(
      ["prom-client"],
      log,
      "Metrics collection",
      () => {
        imports.push(require("../prometheus/PrometheusModule").PrometheusModule);
      }
    );

    ifPackageIsInstalled(
      ["prom-client", "@nestjs/typeorm", "typeorm"],
      log,
      "TypeORM metrics collection",
      () => {
        imports.push(require("../typeorm-metrics/TypeORMMetricsModule").TypeORMMetricsModule);
      }
    );

    return {
      module: AutoConfigurationModule,
      imports
    };
  }
}
