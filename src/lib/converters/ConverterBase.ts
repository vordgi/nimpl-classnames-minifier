import type { LoaderContext } from 'webpack/types';

abstract class BaseConverter {
  cache: { [resource: string]: { [className: string]: string } } = {};

  abstract getLocalIdent({ resourcePath }: LoaderContext<any>, _localIdent: string, origName: string, options: unknown): string;
};

export default BaseConverter;
