module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  ignorePatterns: ['apps/**', 'packages/**', 'node_modules/', 'dist/', '.next/', '.turbo/'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
};
