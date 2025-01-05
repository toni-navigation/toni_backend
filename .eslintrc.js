module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],

  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
  },

  root: true,

  env: {
    node: true,
    jest: true,
  },

  ignorePatterns: ['.eslintrc.js'],

  rules: {
    'id-denylist': ['error', 'e', 'err', 'ev', 'cb', 'val'],

    'import/extensions': [
      'error',
      'ignorePackages',
      { js: 'never', jsx: 'never', ts: 'never', tsx: 'never', '': 'never' },
    ],
    'import/no-default-export': 'error',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        groups: [['builtin', 'external', 'internal']],
        alphabetize: { order: 'asc', orderImportKind: 'asc' },
      },
    ],
    'import/prefer-default-export': 'off',

    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['./*', '../*', 'src/*', 'app/*'],
            message: "Use '@/...' alias instead.",
          },
        ],
      },
    ],

    'no-underscore-dangle': ['error', { allow: ['__caslSubjectType__'] }],

    'padding-line-between-statements': ['error', { blankLine: 'always', prev: '*', next: 'return' }],

    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    'class-methods-use-this': 'off',

    'import/no-cycle': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: ['./test/**', './**/*.e2e-spec.ts', './**/*.spec.ts', './src/seeds/**', './src/scripts/**'],
      },
    ],
  },

  overrides: [
    {
      files: ['src/mail/templates/*.tsx', 'src/seeds/*.seeder.ts'],
      rules: {
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'error',
      },
    },
  ],
};
