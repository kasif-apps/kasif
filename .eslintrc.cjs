module.exports = {
  extends: ['mantine', 'prettier', 'plugin:import/recommended', 'plugin:import/typescript'],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'max-classes-per-file': ['error', 5],
    'jsx-a11y/click-events-have-key-events': 'off',
    'consistent-return': 'off',
    'no-restricted-syntax': ['off'],
    'import/no-cycle': 'off',
    'import/order': 'off',
  },
};
