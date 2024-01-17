import type { Config } from "./types/plugin";
import { CUSTOM, VALID_MINIFIERS_KEYS } from "./constants/minifiers";

const validKeys = ['type', 'templateString', 'prefix'];

const validateIsObject = (config: unknown): config is Config => {
    if (!config) return false;

    if (typeof config !== 'object' || Array.isArray(config)) {
        console.error(`next-classnames-minifier: Invalid configuration. Expected object, received ${typeof config}. See https://github.com/vordgi/next-classnames-minifier#configuration`);
        process.exit();
    }

    const isValidKeys = Object.keys(config).every(key => validKeys.includes(key));

    if (!isValidKeys) {
        console.error(`next-classnames-minifier: Invalid configuration. Valid keys are: ${validKeys.join(', ')}. See https://github.com/vordgi/next-classnames-minifier#configuration`);
        process.exit();
    }

    return true;
}

const validateConfig = (config: unknown = {}): Config => {
    if (!validateIsObject(config)) return {};

    if (config.type && !VALID_MINIFIERS_KEYS.includes(config.type)) {
        console.error(`next-classnames-minifier: Invalid configuration. Valid types are: ${VALID_MINIFIERS_KEYS.join(', ')}. See https://github.com/vordgi/next-classnames-minifier#configuration`)
        process.exit();
    }

    if (config.type === CUSTOM && !config.templateString) {
        console.error('next-classnames-minifier: Invalid configuration. The templateString option is required for the "custom" type. See https://github.com/vordgi/next-classnames-minifier#configuration')
        process.exit();
    }

    if (config.prefix && !config.prefix.match(/^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/)) {
        console.error(`next-classnames-minifier: Invalid prefix. It should match following rule: "^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$". See https://github.com/vordgi/next-classnames-minifier#configuration`);
        process.exit();
    }

    return config;
}

export default validateConfig;
