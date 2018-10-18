const HtmlWebpackPlugin = require('html-webpack-plugin');
const LinkMediaExtHtmlWebpackPlugin = require('../index.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../dist');

const baseConfig = (linkMediaExtOptions) => {
  const config = {
    entry: {
      entry1: path.join(__dirname, 'fixtures/entry1.js'),
      entry2: path.join(__dirname, 'fixtures/entry2.js'),
      entry3: path.join(__dirname, 'fixtures/entry3.js'),
    },
    output: {
      path: OUTPUT_DIR,
      filename: '[name].js',
    },
    plugins: [
      new CleanWebpackPlugin(
          [OUTPUT_DIR],
          { verbose: false }
      ),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new HtmlWebpackPlugin(),
      new LinkMediaExtHtmlWebpackPlugin(linkMediaExtOptions),
    ],
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
          ],
        },
      ],
    },
  };
  config.mode = 'production';
  return config;
};

const testPlugin = (pluginConfig, toMatchArr, done) => {
  webpack(baseConfig(pluginConfig), (err, result) => {
    expect(err).toBeFalsy();
    expect(JSON.stringify(result.compilation.errors)).toBe('[]');
    toMatchArr.forEach((toMatch) => {
      expect(
          result.compilation.assets['index.html'].source().trim()
      ).toMatch(toMatch);
    });
    done();
  });
};

const DEFAULT_MATCHES = [
  /(<link href="entry1\.css" rel="stylesheet">)/,
  /(<link href="entry2\.css" rel="stylesheet">)/,
  /(<link href="entry3\.css" rel="stylesheet">)/,
];

describe('LinkMediaExtHtmlWebpackPlugin', () => {
  test('does nothing with empty settings', (done) => {
    testPlugin(
        {},
        DEFAULT_MATCHES,
        done
    );
  });

  test('sets default attribute', (done) => {
    testPlugin(
        {
          defaultAttribute: 'screen',
        },
        [
          /(<link href="entry1\.css" rel="stylesheet" media="screen">)/,
          /(<link href="entry2\.css" rel="stylesheet" media="screen">)/,
          /(<link href="entry3\.css" rel="stylesheet" media="screen">)/,
        ],
        done
    );
  });

  test('sets standard attributes', (done) => {
    testPlugin(
        {
          screen: 'entry1.css',
          all: /entry2.css/,
          print: ['entry3.css'],
        },
        [
          /(<link href="entry1\.css" rel="stylesheet" media="screen">)/,
          /(<link href="entry2\.css" rel="stylesheet" media="all">)/,
          /(<link href="entry3\.css" rel="stylesheet" media="print">)/,
        ],
        done
    );
  });

  test('sets custom attributes', (done) => {
    testPlugin(
        {
          custom: [{
            test: /entry1.css/,
            value: '(min-width: 960px)',
          }, {
            test: 'entry2.css',
            value: '(max-width: 1200px)',
          }],
        },
        [
          /(<link href="entry1\.css" rel="stylesheet" media="\(min-width: 960px\)">)/,
          /(<link href="entry2\.css" rel="stylesheet" media="\(max-width: 1200px\)">)/,
        ],
        done
    );
  });

  test('sets default attribute for all stylesheets except one', (done) => {
    testPlugin(
        {
          defaultAttribute: 'screen',
          all: [/entry3.css/],
        },
        [
          /(<link href="entry1\.css" rel="stylesheet" media="screen">)/,
          /(<link href="entry2\.css" rel="stylesheet" media="screen">)/,
          /(<link href="entry3\.css" rel="stylesheet" media="all">)/,
        ],
        done
    );
  });

  test('takes Regexp for file names', (done) => {
    testPlugin(
        {
          screen: [/entry1.css/],
          all: [/entry2.css/],
        },
        [
          /(<link href="entry1\.css" rel="stylesheet" media="screen">)/,
          /(<link href="entry2\.css" rel="stylesheet" media="all">)/,
          /(<link href="entry3\.css" rel="stylesheet">)/,
        ],
        done
    );
  });

  test('ignores unknown attribute', (done) => {
    testPlugin(
        {
          dummy: [/entry1.css/],
        },
        DEFAULT_MATCHES,
        done
    );
  });
});
