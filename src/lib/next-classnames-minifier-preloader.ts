import type { LoaderContext } from 'webpack';
import ConverterMinified from './converters/ConverterMinified';

export default function (this: LoaderContext<any>, source: string, map: any, meta: any) {
  const options = this.getOptions();
  const classnamesMinifier = options.classnamesMinifier as ConverterMinified;
  const maybeClassesList = source.match(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g)
  const cache = classnamesMinifier.dirtyСache[this.resourcePath];

  /**
   * if some class has ceased to be used since the last time the file was loaded, we remove it from the cache
   */
  if (cache && cache.matchings) {
    cache.matchings = maybeClassesList ? Object.fromEntries(
      Object.entries(cache.matchings).filter(([key]) => maybeClassesList?.includes(`.${key}`))
    ) : {};
  }

  this.callback(null, source, map, meta);
  return;
}
