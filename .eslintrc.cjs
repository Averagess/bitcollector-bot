// eslint-disable-next-line no-undef
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  env: {
    es2020: true,
    node: true,
  },
  ignorePatterns: ["node_modules", "build"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    quotes: ["error", "double"],
    "@typescript-eslint/indent": ["error", 2],
    semi: ["error", "always"],
    eqeqeq: ["error", "always"],
    "no-nested-ternary": "error",
    "no-var": "error",
    "no-undef": "error",
    "prefer-const": "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "space-in-parens": ["error", "never"],
    "comma-spacing": ["error", { "before": false, "after": true }],
  }
};