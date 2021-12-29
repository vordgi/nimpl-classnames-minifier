import type { LoaderContext } from 'webpack/types';

class ClassMinifier {
  cache: {[resource: string]: {[className: string]: string}} = {};
  symbols: string[] = [];
  lastIndex = 0;

  constructor() {
    this.symbols = [...new Array(26)].reduce((acc, _e, i) => {
      acc.push(String.fromCharCode(97 + i));
      acc.push(String.fromCharCode(65 + i));
      return acc;
    }, []);
  }

  getClassName() {
    const symbolsCount = 52;
    let offset = this.lastIndex;
    let className = '';

    while (offset !== 0 || !className) {
      const currentSymbolIndex = offset % symbolsCount;
      className = this.symbols[currentSymbolIndex] + className;
      offset = Math.floor(offset / symbolsCount);
    }

    return className;
  }

  getLocalIdent({ resourcePath }: LoaderContext<any>, _localIdent: string, origName: string) {
    if (!this.cache[resourcePath]) this.cache[resourcePath] = {};
    const currentCache = this.cache[resourcePath];

    if (currentCache[origName]) return currentCache[origName];

    const minifiedClassName = this.getClassName();
    currentCache[origName] = minifiedClassName;
    this.lastIndex += 1;
    return minifiedClassName;
  }
};

export default ClassMinifier;