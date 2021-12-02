import { ConfigObject } from "@nestjs/config";


export function loadDefaults(): ConfigObject {
  return {
    server: {
      port: "8080"
    },
    application: {
      name: "NestJS Application",
      description: "Welcome to application",
      version: "development"
    }
  };
}
