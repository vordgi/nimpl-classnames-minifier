import type { Configuration } from 'webpack/types';
import type { Options } from './lib/types/plugin';
import type ConverterBase from './lib/converters/ConverterBase';
import { CUSTOM, MINIFIED, VALID_MINIFIERS_KEYS } from './lib/constants/minifiers';
import ConverterMinified from './lib/converters/ConverterMinified';
import ConverterCustom from './lib/converters/ConverterCustom';
import injectConfig from './lib/injectConfig';
import path from 'path';

let classnamesMinifier: ConverterBase;
let infoMessageShown = false;

const withClassnameMinifier = (pluginOptions: Options = {}) => (nextConfig: any = {}) => ({
    ...nextConfig,
    webpack: (config: Configuration, options: any) => {
        const { dev = 'none', prod = 'minified' } = pluginOptions;
        const isProd = process.env.NODE_ENV === 'production';
        const minifierConfig = isProd ? prod : dev;
        const minifierType = typeof minifierConfig === 'string' ? minifierConfig : minifierConfig.type;

        if (!infoMessageShown) {
            if (!VALID_MINIFIERS_KEYS.includes(minifierType)) {
                console.log(`next-classnames-minifier. Invalid key for target env: ${minifierType}, valid keys are: ${VALID_MINIFIERS_KEYS.join(', ')}`);
                process.kill(0);
                process.exit();
            } else if (!isProd && minifierType === MINIFIED) {
                console.log(`next-classnames-minifier. It is not recommended to use "minified" mode in development mode, it may slow down the update`);
            } else if (minifierType === 'custom' && (typeof minifierConfig !== 'object' || !minifierConfig.templateString)) {
                console.log(`next-classnames-minifier. Add templateString for custom minifier`);
                process.kill(0);
                process.exit();
            }
            infoMessageShown = true;
        }
        
        if (minifierType === MINIFIED) {
            if (!classnamesMinifier) {
                const cacheDir = path.join(process.cwd(), '.next/cache/ncm');
                classnamesMinifier = new ConverterMinified(cacheDir);
            }

            injectConfig({ classnamesMinifier }, config.module?.rules);
        } else if (minifierType === CUSTOM && typeof minifierConfig === 'object' && minifierConfig.templateString) {
            if (!classnamesMinifier) {
                classnamesMinifier = new ConverterCustom();
            }

            injectConfig({ localIdentName: minifierConfig.templateString, classnamesMinifier }, config.module?.rules);
        }

        if (typeof nextConfig.webpack === 'function') {
            return nextConfig.webpack(config, options);
        }

        return config;
	}
});

export default withClassnameMinifier;
