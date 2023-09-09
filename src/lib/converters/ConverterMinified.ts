import type { LoaderContext } from 'webpack/types';
import type ConverterBase from './ConverterBase';

class ConverterMinified implements ConverterBase {
  cache: {[resource: string]: {[className: string]: string}} = {};

  symbols: string[] = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];

  lastIndex = 0;

  nextLoopEndsWith = 26;

  currentLoopLength = 0;

  nameMap = [0];

  getClassName() {
    const symbolsCount = 62;
    if (this.lastIndex >= this.nextLoopEndsWith) {
      if (this.nextLoopEndsWith === 26) this.nextLoopEndsWith = 62 * symbolsCount;
      else this.nextLoopEndsWith = this.nextLoopEndsWith * symbolsCount;
      this.nameMap.push(0);
      this.currentLoopLength += 1
    }

    const currentClassname = this.nameMap.map((e) => this.symbols[e]).join('');

    for (let i = this.currentLoopLength; i >= 0; i--) {
      if (this.nameMap[i] === symbolsCount - 1 || (i === 0 && this.nameMap[i] === 25)) {
        this.nameMap[i] = 0;
      } else {
        this.nameMap[i] += 1;
        break;
      }
    }

    return currentClassname;
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

export default ConverterMinified;
