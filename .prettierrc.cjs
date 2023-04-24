const mantine = require('eslint-config-mantine/.prettierrc.js');

module.exports = {
  ...mantine,
  semi: true,
  tabWidth: 2,
  printWidth: 100,
  singleQuote: true,
  jsxBracketSameLine: true,
  quoteProps: 'consistent',
  trailingComma: 'es5',
  useTabs: false,
  arrowParens: 'avoid',
  bracketSpacing: true,
  importOrder: [
    '^.*(.css)$',
    '^react(.*)$',
    '^@mantine/(.*)$',
    '^@kasif/(pages|components|managers|locales|util|assets|config)/(.*)$',
    '^@tabler/(.*)$',
    '^[./]',
    '<THIRD_PARTY_MODULES>',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderParserPlugins: [
    'typescript',
    'jsx',
    'classProperties',
    'classPrivateProperties',
    'decorators-legacy',
  ],
  plugins: [require('@trivago/prettier-plugin-sort-imports')],
};
