/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    node: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',

  plugins: ['@typescript-eslint', 'import', 'prettier', 'unused-imports'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'airbnb-base', 'prettier', 'turbo'],
  settings: {
    'import/parser': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    },
  },

  rules: {
    'prettier/prettier': 'error',

    'no-use-before-define': [
      'error',
      {
        functions: false,
      },
    ],
    'no-shadow': 'off',
    'no-alert': 'off',
    'no-param-reassign': 'off',
    'no-underscore-dangle': 'off',
    'no-undef': 'off',
    'no-useless-escape': 'off',
    'no-cond-assign': 'off',
    'class-methods-use-this': 'off',

    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],

    'import/no-extraneous-dependencies': 'off',
    'import/no-absolute-path': 'off',
    'import/extensions': 'off',
    'import/export': 'off',
    'import/prefer-default-export': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '{react*,react*/**,next*,next*/**}',
            group: 'external',
            position: 'before',
          },
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],

    '@typescript-eslint/no-empty-interface': 'off',
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
  ],
};
