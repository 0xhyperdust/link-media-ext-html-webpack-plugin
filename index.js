'use strict';

const PLUGIN = 'LinkMediaExtHtmlWebpackPlugin';
const STANDARD_MEDIA_VALUES = ['all', 'screen', 'print', 'speech'];
const { isStylesheetTag, matches, getModifiedElement } = require('./utils');

const addMediaAttribute = (options) => (tag) => {
  if (isStylesheetTag(tag)) {
    const stylesheetName = tag.attributes.href;

    let newValue;
    STANDARD_MEDIA_VALUES.some((value) => {
      if (matches(stylesheetName, options[value])) {
        newValue = value;
        return true;
      }
    });

    if (Array.isArray(options.custom) && options.custom.length > 0) {
      options.custom.some((custom) => {
        if (matches(stylesheetName, custom.test) &&
            typeof custom.value === 'string' && custom.value !== '') {
          newValue = custom.value;
          return true;
        }
      });
    }

    if (newValue) {
      return getModifiedElement(tag, newValue);
    }

    if (options.defaultAttribute) {
      return getModifiedElement(tag, options.defaultAttribute);
    }
  }

  return tag;
};

/**
 * LinkMediaExtHtmlWebpackPlugin
 */
class LinkMediaExtHtmlWebpackPlugin {
  /**
   * Get and set plugin options
   * @param {object} options - plugin options
   */
  constructor(options) {
    this.options = options;
  }

  /**
   * Hook into html-webpack-plugin compiling
   * @param {object} compiler
   */
  apply(compiler) {
    compiler.hooks.compilation.tap(PLUGIN, (compilation) => {
      compilation.hooks.htmlWebpackPluginAlterAssetTags.tap(
          PLUGIN,
          (htmlPluginData) => {
            return Object.assign({}, htmlPluginData, {
              body: htmlPluginData.body.map(addMediaAttribute(this.options)),
              head: htmlPluginData.head.map(addMediaAttribute(this.options)),
            });
          });
    });
  }
}

module.exports = LinkMediaExtHtmlWebpackPlugin;
