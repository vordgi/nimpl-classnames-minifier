import type { RuleSetUseItem, ModuleOptions } from 'webpack';
import modifyCssLoader from './modifyCssLoader';
import path from 'path';
import { InjectConfig } from './types/plugin';
import ConverterMinified from './converters/ConverterMinified';

const injectConfig = (config: InjectConfig, rules?: ModuleOptions['rules']) => {
    if (!rules) return;

    const oneOfRule = rules?.find(
        (rule) => typeof rule === 'object' && typeof rule?.oneOf === 'object'
    );

    if (oneOfRule && typeof oneOfRule === 'object') {
        const testCssLoaderWithModules = (loaderObj: RuleSetUseItem) => (
            typeof loaderObj === 'object' &&
            loaderObj?.loader?.match('css-loader') &&
            typeof loaderObj.options === 'object' &&
            loaderObj.options.modules
        );
        oneOfRule.oneOf?.forEach(rule => {
            if (rule && Array.isArray(rule.use)) {
                let cssLoaderIndex = null as null | number;
                for (let i = 0; i <= rule.use.length - 1; i++) {
                    const loaderObj = rule.use[i];

                    if (loaderObj && testCssLoaderWithModules(loaderObj)) {
                        cssLoaderIndex = i;
                        modifyCssLoader(config, loaderObj);
                    }
                }

                if (cssLoaderIndex !== null && config.classnamesMinifier instanceof ConverterMinified) {
                    rule.use.splice(cssLoaderIndex, 1, {
                        loader: path.join(__dirname, './next-classnames-minifier-postloader.js'),
                        options: {
                            classnamesMinifier: config.classnamesMinifier,
                        },
                    }, 
                    rule.use[cssLoaderIndex],
                    {
                        loader: path.join(__dirname, './next-classnames-minifier-preloader.js'),
                        options: {
                            classnamesMinifier: config.classnamesMinifier,
                        },
                    }
                    )
                }
            }
        });
    }
}

export default injectConfig;
