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
        const testFontLoader = (loaderObj: RuleSetUseItem) => (
            typeof loaderObj === 'object' &&
            loaderObj?.loader?.match('next-font-loader')
        );
        oneOfRule.oneOf?.forEach(rule => {
            if (rule && Array.isArray(rule.use)) {
                let cssLoaderIndex = null as null | number;
                for (let i = rule.use.length - 1; i >= 0; i--) {
                    const loaderObj = rule.use[i];

                    if (!loaderObj) continue;

                    /**
                     * Next.js has special logic for generating font classes,
                     * so we don't change the rules that work with fonts and, as a result, do not minify font classes
                     */
                    if (testFontLoader(loaderObj)) break;

                    if (testCssLoaderWithModules(loaderObj)) {
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
                    })
                }
            }
        });
    }
}

export default injectConfig;
