import type { Configuration } from 'webpack/types';
import type { Config } from './lib/types/plugin';
import type ConverterBase from './lib/converters/ConverterBase';
import { CUSTOM, MINIFIED } from './lib/constants/minifiers';
import ConverterMinified from './lib/converters/ConverterMinified';
import ConverterCustom from './lib/converters/ConverterCustom';
import injectConfig from './lib/injectConfig';
import validateConfig from './lib/validateConfig';
import path from 'path';
import validateDist from './lib/validateDist';

let classnamesMinifier: ConverterBase;

const nextDistDir = path.join(process.cwd(), '.next');
const cacheDir = path.join(nextDistDir, 'cache/ncm');

const withClassnameMinifier = (pluginOptions: Config = {}) => {
    validateConfig(pluginOptions);
    validateDist(pluginOptions, nextDistDir);

    return (nextConfig: any = {}) => ({
        ...nextConfig,
        webpack: (config: Configuration, options: any) => {
            const { type = MINIFIED, templateString, prefix, reservedNames } = pluginOptions;

            if (type === MINIFIED) {
                if (!classnamesMinifier) {
                    classnamesMinifier = new ConverterMinified(cacheDir, prefix, reservedNames);
                }

                injectConfig({ classnamesMinifier }, config.module?.rules);
            } else if (type === CUSTOM && templateString) {
                if (!classnamesMinifier) {
                    classnamesMinifier = new ConverterCustom(prefix);
                }

                injectConfig({ localIdentName: templateString, classnamesMinifier }, config.module?.rules);
            }

            if (typeof nextConfig.webpack === 'function') {
                return nextConfig.webpack(config, options);
            }

            return config;
        }
    })
};

export default withClassnameMinifier;
