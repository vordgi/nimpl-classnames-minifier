# Next classnames minifier

[![npm version](https://badge.fury.io/js/next-classnames-minifier.svg)](https://badge.fury.io/js/next-classnames-minifier)

Library for configuring style _(css/scss/sass)_ modules to generate compressed classes (`.header` -> `.a`, `.nav` -> `.b`, ..., `.footer` -> `.aad`, etc.) with support for changes and rebuilding without clearing the built application. The package itself synchronizes minified classnames with components of the application compiled earlier.

*After version 3.0.0, the logic for classnames minifying has been moved to a separate package - [classnames-minifier](https://github.com/vordgi/classnames-minifier).*

### **Important**
**This description is for `>=3.0.0`. See instructions for previous versions at [next-classnames-minifier/tree/2.3.5](https://github.com/vordgi/next-classnames-minifier/tree/2.1.1)**

## Reasons
*Compressing classes* can reduce the size of the generated html and css by up to *20%*, which will have a positive effect on page rendering and metrics (primarily [FCP](https://web.dev/first-contentful-paint/))

## Installation

**Using npm:**
```bash
npm i next-classnames-minifier
```

**Using yarn:**
```bash
yarn add next-classnames-minifier
```

## Configuration

### Options

* `prefix` - custom prefix that will be added to each updated class;
* `reservedNames` - array of reserved names that should not be used by this package (must include prefix);
* `disabled` - disabling classnames minifying;

*It is recommended to disable minification for development.*

Configuration example:
```js
module.exports = (phase) => withClassnamesMinifier({
  prefix: '_',
  reservedNames: ['_en', '_de'],
  disabled: phase === PHASE_PRODUCTION_SERVER || process.env.NODE_ENV === 'development',
})(nextConfig);
```

## License

[MIT](https://github.com/vordgi/next-classnames-minifier/blob/main/LICENSE)
