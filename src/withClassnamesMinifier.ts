import type { Configuration } from 'webpack/types';
import type { Config } from './lib/types/plugin';
import type ConverterBase from './lib/converters/ConverterBase';
import { CUSTOM, MINIFIED } from './lib/constants/minifiers';
import ConverterMinified from './lib/converters/ConverterMinified';
import ConverterCustom from './lib/converters/ConverterCustom';
import injectConfig from './lib/injectConfig';
import validateConfig from './lib/validateConfig';
import path from 'path';

let classnamesMinifier: ConverterBase;

const withClassnameMinifier = (pluginOptions: Config = {}) => {
    validateConfig(pluginOptions);

    return (nextConfig: any = {}) => ({
        ...nextConfig,
        webpack: (config: Configuration, options: any) => {
            const { type = MINIFIED, templateString, prefix } = pluginOptions;

            if (type === MINIFIED) {
                if (!classnamesMinifier) {
                    const cacheDir = path.join(process.cwd(), '.next/cache/ncm');
                    classnamesMinifier = new ConverterMinified(cacheDir, prefix);
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
