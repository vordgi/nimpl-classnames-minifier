import type { RuleSetUseItem, ModuleOptions } from 'webpack';
import modifyCssLoader from './modifyCssLoader';

const injectConfig = (config: {[key: string]: unknown}, rules?: ModuleOptions['rules']) => {
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
                rule.use.forEach((loaderObj) => {
                    if (loaderObj && testCssLoaderWithModules(loaderObj)) {
                        modifyCssLoader(config, loaderObj);
                    }
                });
            }
        });
    }
}

export default injectConfig;
