import type { LoaderContext } from 'webpack/types';
import type ConverterBase from './ConverterBase';
import path from 'path';

class ConverterDetailed implements ConverterBase {
  cache: {[resource: string]: {[className: string]: string}} = {};

  getLocalIdent({ resourcePath, rootContext }: LoaderContext<any>, _localIdent: string, origName: string) {
    if (!this.cache[resourcePath]) this.cache[resourcePath] = {};
    const currentCache = this.cache[resourcePath];

    if (currentCache[origName]) return currentCache[origName];

    const {dir, name} = path.parse(resourcePath);
    const filePath = path.relative(rootContext, dir);
    const newClassBase = `${filePath}__${name}__${origName}`;
    const newClassNormalized = newClassBase.replace(/(\\|\.)/g, (_s, g1) => {
      if (g1 === '\\') return '_'
      return '-'
    })

    currentCache[origName] = newClassNormalized;
    return newClassNormalized;
  }
};

export default ConverterDetailed;