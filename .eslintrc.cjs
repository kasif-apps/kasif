module.exports = {
  extends: ['mantine'],
  overrides: [
    {
      files: ['**/?(*.)+(spec|test).[jt]s?(x)'],
      extends: ['plugin:testing-library/react'],
    },
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'max-classes-per-file': ['error', 5],
    'jsx-a11y/click-events-have-key-events': 'off',
    'consistent-return': 'off',
  },
};
