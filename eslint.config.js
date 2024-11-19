/** @type {import('eslint').Linter.Config} */
module.exports = [
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2018,
      },
    },
    rules: {
      'no-console': 'warn',
    },
  },
  {
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],
    },
  },
];
