module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  plugins: [
    'svelte3',
    "@typescript-eslint",
  ],
  extends: [
    'standard',
    'plugin:jest/recommended',
    'plugin:security/recommended',
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },
  ],
  settings: {
    'svelte3/ignore-styles': () => true,
  },
  rules: {
    'comma-dangle': [
      'warn',
      'always-multiline',
    ],
    indent: ['warn', 2, { SwitchCase: 1 }],
    'import/first': 0,
    'linebreak-style': ['error', 'unix'],
    quotes: [
      'warn',
      'single',
    ],
    semi: [
      'error',
      'never',
    ],
    'no-var': [
      'error',
    ],
    'no-console': [
      'off',
    ],
    'no-multiple-empty-lines': 0, // ['error', {max: 2, maxBOF: 2}],
    'no-multi-spaces': 0,
    'no-unused-vars': ['warn'],
    'no-mixed-spaces-and-tabs': [
      'warn',
    ],
    'space-before-function-paren': [
      'warn',
      {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'object-curly-spacing': [
      'warn',
      'always',
    ],
    'require-atomic-updates': 0,
    'security/detect-object-injection': 0,
    'jest/expect-expect': [
      'error',
      {
        assertFunctionNames: ['expect', 'request.**.expect'],
      },
    ],
  },
}
