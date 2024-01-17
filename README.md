# Next classnames minifier

[![npm version](https://badge.fury.io/js/next-classnames-minifier.svg)](https://badge.fury.io/js/next-classnames-minifier)

Library for configuring style _(css/scss/sass)_ modules to generate compressed classes (`.header` -> `.a`, `.nav` -> `.b`, ..., `.footer` -> `.aad`, etc.) with support for changes and rebuilding without clearing the built application.

### **Important**
**This description is for `>=2.2.0`. See instructions for previous versions at [next-classnames-minifier/tree/2.1.1](https://github.com/vordgi/next-classnames-minifier/tree/2.1.1)**

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

## Usage

Create `next.config.js` file in your project and apply the library.

**Base:**
```js
const withClassnamesMinifier = require('next-classnames-minifier').default;

module.exports = withClassnamesMinifier({ type: process.env.NODE_ENV === 'development' ? 'none' : 'minified' })({
    // next.js config
});
```

**With `next-compose-plugins`:**
```js
const withClassnamesMinifier = require('next-classnames-minifier').default;
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([
    [withClassnamesMinifier({ type: process.env.NODE_ENV === 'development' ? 'none' : 'minified' })]
], nextConfig);
```

## Configuration

### Options

* `type` - variant of changing classnames method;
* `templateString` - custom [template string](https://webpack.js.org/configuration/output/#template-strings), only works with "custom" type;
* `prefix` - custom prefix that will be added to each updated class;

### Type

next-classname-minifier has 3 types of changing classnames:

* minified — the main option. It is not recommended to use this option in development mode, it may slow down the update;
* custom — create a class using a [template string](https://webpack.js.org/configuration/output/#template-strings) rule, can be used for debugging;
* none — use the default CSS modules option, default for development mode;

*It is recommended to disable minification for development.*

Configuration example:
```js
module.exports = withPlugins([
    [withClassnamesMinifier({ type: process.env.NODE_ENV === 'development' ? 'none' : 'minified' })]
], nextConfig);
```

Custom mode example:
```js
module.exports = withPlugins([
    [withClassnamesMinifier({ type: 'custom', templateString: '[path][name]__[local]_[hash:base64:5]' })]
], nextConfig);
```

## License

[MIT](https://github.com/vordgi/next-classnames-minifier/blob/main/LICENSE)
