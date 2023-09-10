import type { LoaderContext } from 'webpack/types';
import type ConverterBase from './ConverterBase';
import { defaultGetLocalIdent } from 'css-loader/dist/utils';

class ConverterCustom implements ConverterBase {
  cache: { [resource: string]: { [className: string]: string } } = {};

  getLocalIdent(context: LoaderContext<any>, localIdentName: string, origName: string, options: unknown) {
    if (!this.cache[context.resourcePath]) this.cache[context.resourcePath] = {};
    const currentCache = this.cache[context.resourcePath];

    if (currentCache[origName]) return currentCache[origName];

    const defaultName: string = defaultGetLocalIdent(context, localIdentName, origName, options);
    const newClassNormalized = defaultName.replace('[local]', origName).replace(/[^0-9a-zA-Z]/g, (_s, g1) => {
      if (g1 === '\\') return '-'
      return '_'
    }).replace(/^[-_]+/g, '');

    currentCache[origName] = newClassNormalized;
    return newClassNormalized;
  }
};

export default ConverterCustom;
