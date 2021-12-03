import { ConfigFactory } from "@nestjs/config";
import * as set from 'lodash.set';

function toDotNotation(source, prefix): Record<string, any> {
  const result = {};

  function recurse(currentSource, currentPath) {
    for(let key in currentSource) {
      const value = currentSource[key];
      const newKey = (currentPath ? currentPath + "." + key : key);
      if(value && typeof value === "object") {
        recurse(value, newKey);
      } else {
        result[newKey] = value;
      }
    }
  }

  recurse(source, prefix)
  return result;
}

function expandVariables(dotNotated: Record<string, any>, path: string): string {
  return dotNotated[path].replace(/\${([^}]+)}/g, (a, b, c, d) => {
    return expandVariables(dotNotated, b) || "";
  })
}

export function buildTree(configurations: ConfigFactory[]): ConfigFactory {
  return async () => {
    let dotNotated = {};

    // combine all configurations into a flat dot-notation object
    for (let configuration of configurations) {
      const data = await configuration();
      // @ts-ignore
      const normalized = toDotNotation(data, configuration.PARTIAL_CONFIGURATION_KEY);
      for (let normalizedKey in normalized) {
        dotNotated[normalizedKey] = normalized[normalizedKey];
      }
    }

    // variable expansion
    for (let dotNotatedKey in dotNotated) {
      dotNotated[dotNotatedKey] = expandVariables(dotNotated, dotNotatedKey);
    }

    // convert the dot-notation object into a nested tree
    const result = {};

    for (let dotNotatedKey in dotNotated) {
      set(result, dotNotatedKey, dotNotated[dotNotatedKey]);
    }

    return result;
  };
}
