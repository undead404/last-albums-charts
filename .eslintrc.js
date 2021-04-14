module.exports = {
  env: {
    commonjs: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:promise/recommended',
    'plugin:array-func/all',
    'plugin:node/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:unicorn/recommended',
    'plugin:lodash/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:sonarjs/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/all',
    'prettier',
  ],
  overrides: [
    {
      files: ['./*', 'site/**/*.js', 'setup-tests.ts'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'node/no-extraneous-import': 'off',
        'node/no-unpublished-import': 'off',
        'node/no-unpublished-require': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        'no-console': 'off',
      },
    },
    {
      env: {
        'jest/globals': true,
      },
      files: ['**/*.test.ts', '**/*.test.tsx'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'lodash/prefer-constant': 'off',
        'no-magic-numbers': 'off',
        'node/no-extraneous-import': 'off',
      },
    },
    {
      env: {
        'jest/globals': true,
      },
      files: ['**/__mocks__/**'],
      rules: {
        'import/prefer-default-export': 'off',
        'no-magic-numbers': 'off',
      },
    },
    {
      files: ['**/*.d.ts'],
      rules: {
        'import/prefer-default-export': 'off',
        'max-classes-per-file': 'off',
        'no-shadow': 'off',
      },
    },
    {
      files: ['site/**/*.tsx', 'site/**/*.ts'],
      rules: {
        'node/no-unsupported-features/node-builtins': 'off',
        'unicorn/filename-case': [
          'error',
          {
            cases: {
              kebabCase: true,
              pascalCase: true,
            },
          },
        ],
      },
    },
    {
      files: ['functions/**/*.ts'],
      rules: {
        'no-underscore-dangle': [
          'error',
          {
            allow: ['_id'],
          },
        ],
      },
    },
    {
      files: ['site/**/*.tsx'],
      rules: {
        'react/display-name': 'error',
        'react/function-component-definition': [
          'error',
          {
            namedComponents: 'function-declaration',
            unnamedComponents: 'arrow-function',
          },
        ],
        'react/jsx-no-comment-textnodes': 'error',
        'react/jsx-no-undef': 'error',
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        'react/no-children-prop': 'error',
        'react/no-danger-with-children': 'error',
        'react/no-deprecated': 'error',
        'react/no-direct-mutation-state': 'error',
        'react/no-find-dom-node': 'error',
        'react/no-is-mounted': 'error',
        'react/no-render-return-value': 'error',
        'react/no-string-refs': 'error',
        'react/no-unescaped-entities': 'error',
        'react/no-unknown-property': 'error',
        'react/require-render-return': 'error',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'react/forbid-prop-types': [
          'error',
          {
            forbid: ['any', 'array', 'object'],
            checkContextTypes: true,
            checkChildContextTypes: true,
          },
        ],
        'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],
        'react/jsx-boolean-value': ['error', 'never', { always: [] }],
        'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
        'react/jsx-closing-tag-location': 'error',
        'react/jsx-curly-spacing': ['error', 'never', { allowMultiline: true }],
        'react/jsx-handler-names': [
          'off',
          {
            eventHandlerPrefix: 'handle',
            eventHandlerPropPrefix: 'on',
          },
        ],
        // eslint-disable-next-line no-magic-numbers
        'react/jsx-indent-props': ['error', 2],
        'react/jsx-key': 'off',
        'react/jsx-max-props-per-line': [
          'error',
          { maximum: 1, when: 'multiline' },
        ],
        'react/jsx-no-bind': [
          'error',
          {
            ignoreRefs: true,
            allowArrowFunctions: true,
            allowFunctions: false,
            allowBind: false,
            ignoreDOMComponents: true,
          },
        ],
        'react/jsx-no-duplicate-props': ['error', { ignoreCase: true }],
        'react/jsx-no-literals': ['off', { noStrings: true }],
        'react/jsx-pascal-case': [
          'error',
          {
            allowAllCaps: true,
            ignore: [],
          },
        ],
        'react/sort-prop-types': [
          'off',
          {
            ignoreCase: true,
            callbacksLast: false,
            requiredFirst: false,
            sortShapeProp: true,
          },
        ],
        'react/jsx-sort-prop-types': 'off',
        'react/jsx-sort-props': [
          'warn',
          {
            ignoreCase: true,
            callbacksLast: false,
            shorthandFirst: false,
            shorthandLast: false,
            noSortAlphabetically: false,
            reservedFirst: true,
          },
        ],
        'react/jsx-sort-default-props': [
          'off',
          {
            ignoreCase: true,
          },
        ],
        'react/no-danger': 'warn',
        'react/no-multi-comp': 'off',
        'react/prefer-es6-class': ['error', 'always'],
        'react/prefer-stateless-function': [
          'error',
          { ignorePureComponents: true },
        ],
        'react/react-in-jsx-scope': 'error',
        'react/self-closing-comp': 'error',
        'react/sort-comp': [
          'error',
          {
            order: [
              'static-variables',
              'static-methods',
              'instance-variables',
              'lifecycle',
              '/^handle.+$/',
              '/^on.+$/',
              'getters',
              'setters',
              '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
              'instance-methods',
              'everything-else',
              'rendering',
            ],
            groups: {
              lifecycle: [
                'displayName',
                'propTypes',
                'contextTypes',
                'childContextTypes',
                'mixins',
                'statics',
                'defaultProps',
                'constructor',
                'getDefaultProps',
                'getInitialState',
                'state',
                'getChildContext',
                'getDerivedStateFromProps',
                'componentWillMount',
                'UNSAFE_componentWillMount',
                'componentDidMount',
                'componentWillReceiveProps',
                'UNSAFE_componentWillReceiveProps',
                'shouldComponentUpdate',
                'componentWillUpdate',
                'UNSAFE_componentWillUpdate',
                'getSnapshotBeforeUpdate',
                'componentDidUpdate',
                'componentDidCatch',
                'componentWillUnmount',
              ],
              rendering: ['/^render.+$/', 'render'],
            },
          },
        ],
        'react/jsx-wrap-multilines': [
          'off',
          {
            declaration: 'parens-new-line',
            assignment: 'parens-new-line',
            return: 'parens-new-line',
            arrow: 'parens-new-line',
            condition: 'parens-new-line',
            logical: 'parens-new-line',
            prop: 'parens-new-line',
          },
        ],

        'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
        'react/jsx-equals-spacing': ['error', 'never'],
        // eslint-disable-next-line no-magic-numbers
        'react/jsx-indent': ['error', 2],
        'react/jsx-no-target-blank': [
          'error',
          { enforceDynamicLinks: 'always' },
        ],
        'react/require-optimization': ['warn', { allowDecorators: [] }],
        'react/style-prop-object': 'error',
        'react/jsx-tag-spacing': [
          'error',
          {
            closingSlash: 'never',
            beforeSelfClosing: 'always',
            afterOpening: 'never',
            beforeClosing: 'never',
          },
        ],
        'react/jsx-space-before-closing': ['off', 'always'],
        'react/no-array-index-key': 'error',
        'react/boolean-prop-naming': [
          'off',
          {
            propTypeNames: ['bool', 'mutuallyExclusiveTrueProps'],
            rule: '^(is|has)[A-Z]([A-Za-z0-9]?)+',
            message: '',
          },
        ],
        'react/no-typos': 'error',
        'react/jsx-curly-brace-presence': [
          'error',
          { props: 'never', children: 'never' },
        ],
        'react/jsx-one-expression-per-line': [
          'error',
          { allow: 'single-child' },
        ],
        'react/destructuring-assignment': ['error', 'always'],
        'react/button-has-type': [
          'error',
          {
            button: true,
            submit: true,
            reset: false,
          },
        ],
        'react/jsx-child-element-spacing': 'off',
        'react/no-this-in-sfc': 'error',
        'react/jsx-props-no-multi-spaces': 'error',
        'react/jsx-fragments': ['error', 'syntax'],
        'react/jsx-curly-newline': [
          'error',
          {
            multiline: 'consistent',
            singleline: 'consistent',
          },
        ],
        'react/jsx-props-no-spreading': [
          'error',
          {
            html: 'enforce',
            custom: 'enforce',
            explicitSpread: 'ignore',
            exceptions: [],
          },
        ],
        'react/jsx-no-script-url': [
          'off',
          [
            {
              name: 'Link',
              props: ['to'],
            },
          ],
        ],
        'jsx-a11y/alt-text': [
          'error',
          {
            elements: ['img', 'object', 'area', 'input[type="image"]'],
            img: [],
            object: [],
            area: [],
            'input[type="image"]': [],
          },
        ],
        'jsx-a11y/anchor-has-content': ['error', { components: [] }],
        'jsx-a11y/anchor-is-valid': [
          'error',
          {
            components: ['Link'],
            specialLink: ['to'],
            aspects: ['noHref', 'invalidHref', 'preferButton'],
          },
        ],
        'jsx-a11y/aria-activedescendant-has-tabindex': 'error',
        'jsx-a11y/aria-props': 'error',
        'jsx-a11y/aria-proptypes': 'error',
        'jsx-a11y/aria-role': ['error', { ignoreNonDOM: false }],
        'jsx-a11y/aria-unsupported-elements': 'error',
        'jsx-a11y/autocomplete-valid': [
          'off',
          {
            inputComponents: [],
          },
        ],
        'jsx-a11y/click-events-have-key-events': 'error',
        'jsx-a11y/control-has-associated-label': [
          'error',
          {
            labelAttributes: ['label'],
            controlComponents: [],
            ignoreElements: [
              'audio',
              'canvas',
              'embed',
              'input',
              'textarea',
              'tr',
              'video',
            ],
            ignoreRoles: [
              'grid',
              'listbox',
              'menu',
              'menubar',
              'radiogroup',
              'row',
              'tablist',
              'toolbar',
              'tree',
              'treegrid',
            ],
            depth: 5,
          },
        ],
        'jsx-a11y/heading-has-content': ['error', { components: [''] }],
        'jsx-a11y/html-has-lang': 'error',
        'jsx-a11y/img-redundant-alt': 'error',
        'jsx-a11y/interactive-supports-focus': 'error',
        'jsx-a11y/label-has-associated-control': [
          'error',
          {
            labelComponents: [],
            labelAttributes: [],
            controlComponents: [],
            assert: 'both',
            depth: 25,
          },
        ],
        'jsx-a11y/mouse-events-have-key-events': 'error',
        'jsx-a11y/no-access-key': 'error',
        'jsx-a11y/no-autofocus': ['error', { ignoreNonDOM: true }],
        'jsx-a11y/no-distracting-elements': [
          'error',
          {
            elements: ['marquee', 'blink'],
          },
        ],
        'jsx-a11y/no-interactive-element-to-noninteractive-role': [
          'error',
          {
            tr: ['none', 'presentation'],
          },
        ],
        'jsx-a11y/no-noninteractive-element-interactions': [
          'error',
          {
            handlers: [
              'onClick',
              'onMouseDown',
              'onMouseUp',
              'onKeyPress',
              'onKeyDown',
              'onKeyUp',
            ],
          },
        ],
        'jsx-a11y/no-noninteractive-element-to-interactive-role': [
          'error',
          {
            ul: [
              'listbox',
              'menu',
              'menubar',
              'radiogroup',
              'tablist',
              'tree',
              'treegrid',
            ],
            ol: [
              'listbox',
              'menu',
              'menubar',
              'radiogroup',
              'tablist',
              'tree',
              'treegrid',
            ],
            li: ['menuitem', 'option', 'row', 'tab', 'treeitem'],
            table: ['grid'],
            td: ['gridcell'],
          },
        ],
        'jsx-a11y/no-noninteractive-tabindex': [
          'error',
          {
            tags: [],
            roles: ['tabpanel'],
          },
        ],
        'jsx-a11y/no-redundant-roles': 'error',
        'jsx-a11y/no-static-element-interactions': [
          'error',
          {
            handlers: [
              'onClick',
              'onMouseDown',
              'onMouseUp',
              'onKeyPress',
              'onKeyDown',
              'onKeyUp',
            ],
          },
        ],
        'jsx-a11y/role-has-required-aria-props': 'error',
        'jsx-a11y/role-supports-aria-props': 'error',
        'jsx-a11y/scope': 'error',
        'jsx-a11y/tabindex-no-positive': 'error',
        'react-perf/jsx-no-new-object-as-prop': 'error',
        'react-perf/jsx-no-new-array-as-prop': 'error',
        'react-perf/jsx-no-new-function-as-prop': 'error',
        'react-perf/jsx-no-jsx-as-prop': 'error',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    project: ['./functions/tsconfig.json', './site/tsconfig.json'],
    sourceType: 'module',
  },
  plugins: [
    'prettier',
    'promise',
    'unicorn',
    'array-func',
    'lodash',
    'node',
    'eslint-comments',
    'jest',
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'react-perf',
    'sonarjs',
    'simple-import-sort',
  ],
  root: true,
  rules: {
    'no-param-reassign': ['error', { props: false }],
    // 'consistent-return': 'off',
    // 'arrow-body-style': 0,
    // 'comma-dangle': 0,
    'node/no-unsupported-features/es-syntax': 'off',
    // 'import/prefer-await-to-then': 'off',
    // 'no-underscore-dangle': 'off',
    'lodash/prefer-lodash-method': [
      'error',
      {
        ignoreMethods: ['find'],
      },
    ],
    'node/no-missing-import': 'off',
    'node/no-unpublished-import': 'off',
    'unicorn/no-null': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'no-process-exit': 'off',
    'unicorn/no-process-exit': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    'functional/no-conditional-statement': 'off',
    'functional/no-try-statement': 'off',
    'functional/no-throw-statement': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'no-void': ['error', { allowAsStatement: true }],
    'no-magic-numbers': [
      'error',
      {
        ignore: [0, 1, -1],
        ignoreDefaultValues: true,
      },
    ],
    'no-console': 'error',
    'jest/prefer-expect-assertions': 'off',
    'jest/no-conditional-expect': 'off',
    'jest/expect-expect': 'off',
    'jest/prefer-strict-equal': 'off',
    'unicorn/prefer-spread': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    "simple-import-sort/imports": ["error",{
      groups: [
        // Node.js builtins.
        [
          `^(${require("module").builtinModules.join("|")})(/|$)`,
        ],
        // Packages.
        ["^@?\\w"],
        // Side effect imports.
        ["^\\u0000"],
        // Parent imports. Put `..` last.
        ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
        // Other relative imports. Put same-folder imports and `.` last.
        ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
        // Style imports.
        ["^.+\\.s?css$"],
      ],
    }],
    "simple-import-sort/exports": "error",
    'import/order': 'off'
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`,
        project: ['./functions', './site'],
      },
    },
    react: {
      version: '16.14',
    },
  },
};
