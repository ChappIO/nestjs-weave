import { ConfigObject } from "@nestjs/config";


export function loadEnv(): ConfigObject {
  const result: ConfigObject = {};

  for (let envKey in process.env) {
    const propKey = envKey.toLowerCase().replace(/_/g, '.');
    result[propKey] = process.env[envKey];
  }

  return result;
}
