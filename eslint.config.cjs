const { defineConfig, globalIgnores } = require("eslint/config");

const globals = require("globals");

const { fixupConfigRules } = require("@eslint/compat");

const tsParser = require("@typescript-eslint/parser");
// The plugin ships ESM with a default export; plain require() returns the
// interop wrapper whose rules live under .default.
const reactRefresh = require("eslint-plugin-react-refresh").default;
const js = require("@eslint/js");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tsParser,
    },
    extends: fixupConfigRules(
      compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react-hooks/recommended"
      )
    ),
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
    },
  },
  globalIgnores(["**/dist", "**/.eslintrc.cjs"]),
]);
