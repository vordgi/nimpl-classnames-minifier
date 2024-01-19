import type { LoaderContext } from 'webpack/types';
import type ConverterBase from './ConverterBase';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

type CacheType = {
  [resourcePath: string]: {
    cachePath: string;
    matchings: {[origClass: string]: string};
    type: 'new' | 'updated' | 'old'
  }
};

class ConverterMinified implements ConverterBase {
  cacheDir: string;

  prefix: string;

  reservedNames: string[];

  cache = {};

  dirtyСache: CacheType = {};

  symbols: string[] = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ];

  freeClasses: string[] = [];

  lastIndex = 0;

  nextLoopEndsWith = 26;

  currentLoopLength = 0;

  nameMap = [0];

  constructor(cacheDir: string, prefix: string = '', reservedNames: string[] = []) {
    this.cacheDir = cacheDir;
    this.prefix = prefix;
    this.reservedNames = reservedNames;
    if (!existsSync(cacheDir)) mkdirSync(cacheDir, { recursive: true });

    const cachedFiles = readdirSync(cacheDir);
    if (cachedFiles.length) {
      console.log('next-classnames-minifier: Restoring pairs of classes...');
    }

    const usedClassNames: string[] = [];

    const dirtyСache: CacheType = {};
    cachedFiles.forEach((file) => {
      const dirtyCacheFile = readFileSync(path.join(cacheDir, file), { encoding: 'utf8' });
      const [resourcePath, ...classnames] = dirtyCacheFile.split(',');

      if (existsSync(resourcePath)) {
        const cachedMatchings = classnames.reduce<{[orig: string]: string}>((acc, cur) => {
          const [origClass, newClass] = cur.split('=');
          acc[origClass] = newClass;
          if (!usedClassNames.includes(newClass)) {
            usedClassNames.push(newClass);
          }
          return acc;
        }, {});
        dirtyСache[resourcePath] = {
          cachePath: file,
          matchings: cachedMatchings,
          type: 'old',
        }
      } else {
        rmSync(resourcePath);
      }
    });

    let unfoundClassNamesLength = usedClassNames.length;
    while (unfoundClassNamesLength > 0) {
      const newClass = this.generateClassName();
      this.lastIndex += 1;
      const usedClassNameIndex = usedClassNames.indexOf(newClass);

      if (usedClassNameIndex !== -1) {
        unfoundClassNamesLength -= 1;
        usedClassNames.splice(usedClassNameIndex, 1);
      } else if (!this.reservedNames.includes(newClass)) {
        this.freeClasses.push(newClass);
      }
    }

    if (cachedFiles.length) {
      console.log('next-classnames-minifier: Pairs restored');
    }

    this.dirtyСache = dirtyСache;
  }

  generateClassName() {
    const symbolsCount = 62;
    if (this.lastIndex >= this.nextLoopEndsWith) {
      if (this.nextLoopEndsWith === 26) this.nextLoopEndsWith = 62 * symbolsCount;
      else this.nextLoopEndsWith = this.nextLoopEndsWith * symbolsCount;
      this.nameMap.push(0);
      this.currentLoopLength += 1
    }

    const currentClassname = this.prefix + this.nameMap.map((e) => this.symbols[e]).join('');

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

  getTargetClassName(origName: string) {
    let targetClassName: string;
    if (this.freeClasses.length) {
      targetClassName = this.freeClasses.shift() as string;
    } else {
      targetClassName = this.generateClassName();
    }

    if (this.reservedNames.includes(targetClassName)) {
      targetClassName = this.getTargetClassName(origName);
      this.lastIndex += 1;
    }

    return targetClassName;
  }

  getLocalIdent({ resourcePath }: LoaderContext<any>, _localIdent: string, origName: string) {
    if (!this.dirtyСache[resourcePath]) this.dirtyСache[resourcePath] = {
      cachePath: path.join(this.cacheDir, uuidv4()), matchings: {}, type: 'new',
    };
    const currentCache = this.dirtyСache[resourcePath];

    if (currentCache.matchings[origName]) return currentCache.matchings[origName];

    let targetClassName = this.getTargetClassName(origName);
    currentCache.matchings[origName] = targetClassName;
    currentCache.type = 'updated';
    this.lastIndex += 1;
    return targetClassName;
  }
};

export default ConverterMinified;
