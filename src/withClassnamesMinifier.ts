import type { Configuration } from 'webpack/types';
import type ConverterBase from './lib/converters/ConverterBase';
import ConverterMinified from './lib/converters/ConverterMinified';
import ConverterDetailed from './lib/converters/ConverterDetailed';
import injectConverter from './lib/injectConverter';

let classnamesMinifier: ConverterBase;

const withClassnameMinifier = (nextConfig: any = {}) => ({
    ...nextConfig,
    webpack: (config: Configuration, options: any) => {
        const { classesConverter = 'minified' } = nextConfig;

        if (classesConverter === 'minified' || classesConverter === 'detailed') {
            if (!classnamesMinifier) {
                if (classesConverter === 'minified') {
                    classnamesMinifier = new ConverterMinified();
                } else {
                    classnamesMinifier = new ConverterDetailed();
                }
            }

            injectConverter(classnamesMinifier, config.module?.rules)
        }

        if (typeof nextConfig.webpack === 'function') {
            return nextConfig.webpack(config, options);
        }

        return config;
	}
});

export default withClassnameMinifier;
