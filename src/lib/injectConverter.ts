import type { RuleSetUseItem, ModuleOptions } from "webpack";
import type ConverterBase from "./converters/ConverterBase";
import modifyCssLoader from "./modifyCssLoader";

const injectConverter = (converter: ConverterBase, rules?: ModuleOptions['rules']) => {
    if (!rules) return;
    const getLocalIdent = converter.getLocalIdent.bind(converter)

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
                        modifyCssLoader(getLocalIdent, loaderObj);
                    }
                });
            }
        });
    }
}

export default injectConverter;
