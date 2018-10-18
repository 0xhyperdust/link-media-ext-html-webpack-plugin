# Link Media Ext Html Webpack Plugin

[![Build Status](https://travis-ci.org/andrianovp/link-media-ext-html-webpack-plugin.svg?branch=master)](https://travis-ci.org/andrianovp/link-media-ext-html-webpack-plugin) [![Coverage Status](https://coveralls.io/repos/andrianovp/link-media-ext-html-webpack-plugin/badge.svg?branch=master)](https://coveralls.io/github/andrianovp/link-media-ext-html-webpack-plugin?branch=master)

This is an extension plugin for [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin). It sets standard and custom media attributes for link tags like [link-media-html-webpack-plugin](https://github.com/probablyup/link-media-html-webpack-plugin) but uses configuration object similar to [script-ext-html-webpack-plugin](https://github.com/numical/script-ext-html-webpack-plugin).

## Installation

You must be running webpack (4.x) on node 6+.

Install plugin with npm:
```
$ npm install link-media-ext-html-webpack-plugin -D
```
Or yarn:
```
$ yarn add link-media-ext-html-webpack-plugin -D
```

Please note that you will need html-webpack-plugin v3.0.6+ and CSS extraction plugin e.g. [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin).

## Basic usage:

Load the plugin:

```javascript
const LinkMediaExtHtmlWebpackPlugin = require('link-media-ext-html-webpack-plugin');
```

Add the plugin to your webpack config as follows:
```javascript
plugins: [
  new HtmlWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].css',
  }),
  new LinkMediaExtHtmlWebpackPlugin()
]
````
The order is important — the plugin must come after HtmlWebpackPlugin.
The above configuration will actually do nothing.

## Configuration

You must pass a configuration object to the plugin. You can define only those properties that you need.

```javascript
new LinkMediaExtHtmlWebpackPlugin({
    defaultAttribute: 'screen',
    all: [],
    print: [],
    screen: [],
    speech: [],
    custom: [{
        test: '',
        value: ''
    }]
})
```
### Options
1. `all` / `screen` / `speech` / `print` — stylesheet matching pattern defining link tags that should have media attributes **all** / **screen** / **speech** / **print** appropriately.
2. `custom` — array of objects with following structure:
  * `test`: stylesheet matching pattern defining link tags that should have media attribute with custom value added.
* `value`:  a `String` value for the attribute; if not set the attribute has no value set (equivalent of true)

A stylesheet matching pattern matches against a stylesheets’s name. It can be one of:
* a `String` matches if it is a substring of the script name;
* a `RegExp`;
* an array of `String`'s and/or `RegExp`'s — matches if any one element matches.

## Examples:
Set all link tags media attributes to *screen*:
```javascript
new LinkMediaExtHtmlWebpackPlugin({
  defaultAttribute: 'screen'
}) 
```
Set media attribute for *main.css* to *screen* and for *print1.css*, *print2.css* to *print*:
```javascript
new LinkMediaExtHtmlWebpackPlugin({
  screen: 'main.css',
  print: [/print1.css/, 'print2.css']
})  
```
Set link tags media attributes *screen* except *main.css* which is *all*:
```javascript
new LinkMediaExtHtmlWebpackPlugin({
  defaultAttribute: 'screen',
  all: [/main.css/],
})  
```
## Change history:
v.1.0.x Initial release
