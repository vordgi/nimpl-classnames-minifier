import type { LoaderContext } from 'webpack';
import ConverterMinified from './converters/ConverterMinified';

export default function (this: LoaderContext<any>, source: string) {
  const options = this.getOptions();
  const classnamesMinifier = options.classnamesMinifier as ConverterMinified;
  const maybeClassesList = source.match(/\.[a-zA-Z_][a-zA-Z0-9_-]+/g)
  const cache = classnamesMinifier.dirtyСache[this.resourcePath];

  if (cache && cache.matchings) {
    cache.matchings = maybeClassesList ? Object.fromEntries(
      Object.entries(cache.matchings).filter(([key]) => maybeClassesList?.includes(`.${key}`))
    ) : {};
  }

  return source;
}
