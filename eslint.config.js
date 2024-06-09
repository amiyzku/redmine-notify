import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // 数値、文字列、またはブール値に初期化された変数またはパラメーターの明示的な型宣言を禁止します
      '@typescript-eslint/no-inferrable-types': 'error',
      eqeqeq: 'error',
    },
  },
]
