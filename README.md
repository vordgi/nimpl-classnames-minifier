# Next classnames minifier

Library for configuring style _(css/scss/sass)_ modules to generate compressed classes (`.header` -> `.a`, `.nav` -> `.b`, ..., `.footer` -> `.aad`, etc.)

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

module.exports = withClassnamesMinifier()({
    // next.js config
});
```

**With `next-compose-plugins`:**
```js
const withClassnamesMinifier = require('next-classnames-minifier').default;
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([
    [withClassnamesMinifier()]
], nextConfig);
```

## Configuration
next-classname-minifier has 3 types of changing classnames:

* minified — the main option. It is highly not recommended to use this option for development mode (_it is too unstable in dev mode by next.js reasons_);
* custom — create a class using a [template string](https://webpack.js.org/configuration/output/#template-strings) rule, can be used for debugging;
* none — use the default CSS modules option, default for development mode;

You can choose different options for development and production. 

Configuration example:
```js
module.exports = withPlugins([
    [withClassnamesMinifier({ dev: 'none', prod: 'minified' })]
], nextConfig);
```

Custom mode example:
```js
module.exports = withPlugins([
    [withClassnamesMinifier({ dev: { type: 'custom', templateString: '[path][name]__[local]_[hash:base64:5]' }, prod: 'minified' })]
], nextConfig);
```

## License

[MIT](https://github.com/vordgi/next-classnames-minifier/blob/main/LICENSE)
