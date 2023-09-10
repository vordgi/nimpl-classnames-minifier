import { VALID_MINIFIERS_KEYS, CUSTOM, MINIFIED, NONE } from '../constants/minifiers';

export type MINIFIER_KEY = typeof VALID_MINIFIERS_KEYS;
export type Config = typeof MINIFIED | typeof NONE | { type: typeof CUSTOM, templateString: string };
export type Options = { dev?: Config, prod?: Config };
