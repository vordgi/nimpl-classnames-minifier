import type { RuleSetUseItem } from 'webpack';

const modifyCssLoader = (config: {[key: string]: unknown}, cssLoaderObj: RuleSetUseItem) => {
    if (typeof cssLoaderObj !== 'object' || typeof cssLoaderObj.options !== 'object') return;

    const { getLocalIdent, ...origConfig } = cssLoaderObj.options.modules || {};

    cssLoaderObj.options.modules = {
        ...origConfig,
        ...config,
    };
}

export default modifyCssLoader;
