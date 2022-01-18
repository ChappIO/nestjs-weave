import {ConfigObject} from "@nestjs/config";

function checkBoolean(value: string): string | boolean {
    switch (value.toLowerCase()) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return value;
    }
}

export function loadEnv(): ConfigObject {
    const result: ConfigObject = {};

    for (let envKey in process.env) {
        const propKey = envKey.toLowerCase().replace(/_/g, '.');
        result[propKey] = checkBoolean(process.env[envKey]);
    }

    return result;
}
