import { ConfigObject } from "@nestjs/config";


export function loadDefaults(): ConfigObject {
  return {
    server: {
      port: "8080"
    },
    application: {
      name: "NestJS Application",
      description: "Welcome to ${application.name}",
      version: "development"
    },
    internal: {
      path: "/internal",
      swagger: {
        path: "${internal.path}/swagger",
        name: "${application.name}",
        description: "${application.description}",
        version: "${application.version}"
      },
      metrics: {
        path: "${internal.path}/metrics"
      }
    },
    typeorm: {
      connection: {
        applicationName: "${application.name}",
        synchronize: true,
        autoLoadEntities: true,
      }
    }
  };
}
