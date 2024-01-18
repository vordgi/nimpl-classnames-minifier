import { VALID_MINIFIERS_KEYS } from '../constants/minifiers';
import type BaseConverter from '../converters/ConverterBase';

export type Config = {
    type?: (typeof VALID_MINIFIERS_KEYS)[number];
    templateString?: string;
    prefix?: string;
    reservedNames?: string[];
}

export type InjectConfig = {
    localIdentName?: string;
    classnamesMinifier: BaseConverter;
}
