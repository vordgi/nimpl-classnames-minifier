import type { Configuration } from 'webpack/types';
import type ConverterBase from './lib/converters/ConverterBase';
import { DETAILED, MINIFIED, VALID_MINIFIERS_KEYS } from './lib/constants/minifiers';
import ConverterMinified from './lib/converters/ConverterMinified';
import ConverterDetailed from './lib/converters/ConverterDetailed';
import injectConverter from './lib/injectConverter';

const minifiers = {
    [MINIFIED]: ConverterMinified,
    [DETAILED]: ConverterDetailed,
}

let classnamesMinifier: ConverterBase;
let infoMessageShown = false;

type Options = {dev?: typeof VALID_MINIFIERS_KEYS[number], prod?: typeof VALID_MINIFIERS_KEYS[number]};

const withClassnameMinifier = (pluginOptions: Options = {}) => (nextConfig: any = {}) => ({
    ...nextConfig,
    webpack: (config: Configuration, options: any) => {
        const { dev = 'detailed', prod = 'minified' } = pluginOptions;
        const isProd = process.env.NODE_ENV === 'production';
        const minifierType = isProd ? prod : dev;
        const isDisabled = minifierType === 'none';

        if (!infoMessageShown) {
            if (!VALID_MINIFIERS_KEYS.includes(prod)) {
                console.log(`next-classnames-minifier. Invalid key for prod env: ${dev}, valid keys are: ${VALID_MINIFIERS_KEYS.join(', ')}`);
                process.kill(0);
                process.exit();
            }
            if (!VALID_MINIFIERS_KEYS.includes(dev)) {
                console.log(`next-classnames-minifier. Invalid key for dev env: ${dev}, valid keys are: ${VALID_MINIFIERS_KEYS.join(', ')}`);
                process.kill(0);
                process.exit();
            } else if (dev === 'minified') {
                console.log(`next-classnames-minifier. Do not use "minified" variant for dev mode. It's to unstable, use "detailed" or "none" instead`);
            }
            infoMessageShown = true;
        }

        if (!isDisabled && minifierType in minifiers) {
            if (!classnamesMinifier) {
                classnamesMinifier = new minifiers[minifierType as keyof typeof minifiers]();
            }

            injectConverter(classnamesMinifier, config.module?.rules);
        }

        if (typeof nextConfig.webpack === 'function') {
            return nextConfig.webpack(config, options);
        }

        return config;
	}
});

export default withClassnameMinifier;
