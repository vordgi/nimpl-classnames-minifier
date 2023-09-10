import type { Configuration } from 'webpack/types';
import type { Options } from './lib/types/plugin';
import type ConverterBase from './lib/converters/ConverterBase';
import { CUSTOM, MINIFIED, VALID_MINIFIERS_KEYS } from './lib/constants/minifiers';
import ConverterMinified from './lib/converters/ConverterMinified';
import ConverterCustom from './lib/converters/ConverterCustom';
import injectConfig from './lib/injectConfig';

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
                console.log(`next-classnames-minifier. Do not use "minified" variant for dev mode. It's to unstable, use "detailed" or "none" instead`);
            } else if (minifierType === 'custom' && (typeof minifierConfig !== 'object' || !minifierConfig.templateString)) {
                console.log(`next-classnames-minifier. Add templateString for custom minifier`);
                process.kill(0);
                process.exit();
            }
            infoMessageShown = true;
        }

        if (minifierType === MINIFIED) {
            if (!classnamesMinifier) {
                classnamesMinifier = new ConverterMinified();
            }

            const getLocalIdent = classnamesMinifier.getLocalIdent.bind(classnamesMinifier);
            injectConfig({ getLocalIdent }, config.module?.rules);
        } else if (minifierType === CUSTOM && typeof minifierConfig === 'object' && minifierConfig.templateString) {
            if (!classnamesMinifier) {
                classnamesMinifier = new ConverterCustom();
            }

            const getLocalIdent = classnamesMinifier.getLocalIdent.bind(classnamesMinifier);
            injectConfig({ localIdentName: minifierConfig.templateString, getLocalIdent }, config.module?.rules);
        }

        if (typeof nextConfig.webpack === 'function') {
            return nextConfig.webpack(config, options);
        }

        return config;
	}
});

export default withClassnameMinifier;
