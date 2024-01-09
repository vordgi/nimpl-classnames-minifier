import type { RuleSetUseItem } from 'webpack';
import { InjectConfig } from './types/plugin';

const modifyCssLoader = (config: InjectConfig, cssLoaderObj: RuleSetUseItem) => {
    if (typeof cssLoaderObj !== 'object' || typeof cssLoaderObj.options !== 'object') return;

    const { getLocalIdent, ...origConfig } = cssLoaderObj.options.modules || {};

    cssLoaderObj.options.modules = {
        ...origConfig,
        ...config,
        getLocalIdent: config.classnamesMinifier.getLocalIdent.bind(config.classnamesMinifier),
    };
}

export default modifyCssLoader;
