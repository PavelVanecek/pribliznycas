import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['build/', 'node_modules/'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser }
    },
    rules: {
      'indent': ['warn', 2],
      'linebreak-style': ['error', 'unix'],
      'quotes': ['warn', 'single'],
      'semi': ['warn', 'never'],
      'no-trailing-spaces': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error'
    }
  }
]
