import type { Configuration, RuleSetUseItem } from 'webpack/types';
import ClassnamesMinifier from './ClassnamesMinifier';

let classnamesMinifier: ClassnamesMinifier;

const withClassnameMinifier = (nextConfig: any = {}) => ({
    ...nextConfig,
    webpack(config: Configuration, options: any) {
        if (!classnamesMinifier) {
            classnamesMinifier = new ClassnamesMinifier();
        }
        const oneOfRule = config.module?.rules?.find(
            (rule) => typeof rule === 'object' && typeof rule.oneOf === 'object'
        );

        if (oneOfRule && typeof oneOfRule === 'object') {
            const testCssLoaderWithModules = (loaderObj: RuleSetUseItem) => (
                typeof loaderObj === 'object' &&
                loaderObj?.loader?.match('css-loader') &&
                typeof loaderObj.options === 'object' &&
                loaderObj.options.modules
            );
            const modifyCssLoader = (cssLoaderObj: RuleSetUseItem) => {
                if (typeof cssLoaderObj === 'object' && typeof cssLoaderObj.options === 'object') {
                    cssLoaderObj.options.modules.getLocalIdent = classnamesMinifier.getLocalIdent.bind(classnamesMinifier);
                }
            }
            oneOfRule.oneOf?.forEach(rule => {
                if (Array.isArray(rule.use)) {
                    rule.use.forEach((loaderObj) => {
                        if (testCssLoaderWithModules(loaderObj)) {
                            modifyCssLoader(loaderObj);
                        }
                    });
                }
            });
        }

        if (typeof nextConfig.webpack === 'function') {
            return nextConfig.webpack(config, options);
        }
        return config;
	},
});

export default withClassnameMinifier;
