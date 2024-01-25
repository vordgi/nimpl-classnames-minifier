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
let cacheDir: string;

const withClassnameMinifier = (pluginOptions: Config = {}) => {
    validateConfig(pluginOptions);

    return (nextConfig: any = {}) => {
        if (!cacheDir) {
            const distDir = nextConfig?.distDir || '.next'
            const distDirAbsolute = path.join(process.cwd(), distDir);
            cacheDir = path.join(distDirAbsolute, 'cache/ncm');
            validateDist(pluginOptions, distDirAbsolute);
        }

        return ({
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
    }
};

export default withClassnameMinifier;
