# Next classnames minifier

Library for configuring style _(css/scss/sass)_ modules to generate compressed classes

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

module.exports = withClassnamesMinifier({
    // next.js config
});
```

**With `next-compose-plugins`:**
```js
const withClassnamesMinifier = require('next-classnames-minifier').default;
const withPlugins = require('next-compose-plugins');

module.exports = withPlugins([
    [withClassnamesMinifier]
], nextConfig);
```

## License

[MIT](https://github.com/vordgi/next-classnames-minifier/blob/main/LICENSE)