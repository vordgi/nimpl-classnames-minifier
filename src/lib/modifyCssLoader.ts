import type ConverterBase from "./converters/ConverterBase";
import type { RuleSetUseItem } from "webpack";

const modifyCssLoader = (getLocalIdent: ConverterBase['getLocalIdent'], cssLoaderObj: RuleSetUseItem) => {
    if (typeof cssLoaderObj !== 'object' || typeof cssLoaderObj.options !== 'object' || !getLocalIdent) return;

    cssLoaderObj.options.modules.getLocalIdent = getLocalIdent;
}

export default modifyCssLoader;