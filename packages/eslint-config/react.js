/** @type {import("eslint").Linter.Config} */
module.exports = {
  parserOptions: {
    ecmaFeatures: { jsx: true },
  },

  extends: ['plugin:react/recommended', 'airbnb', 'airbnb/hooks', './base.js', './emotion.js'],
  plugins: ['react', 'react-hooks', 'jsx-a11y'],
  settings: {
    react: { version: 'detect' },
    'import/parser': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    },
  },

  rules: {
    // React
    'react/function-component-definition': [
      'error',
      { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.tsx'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
  },
};
