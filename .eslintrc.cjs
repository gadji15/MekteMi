module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module", project: false },
  plugins: ["@typescript-eslint", "react", "react-hooks"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    // General
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // Many French strings contain apostrophes intentionally; allow them in JSX text
    "react/no-unescaped-entities": "off",
  },
  overrides: [
    {
      files: ["lib/**/*.ts", "lib/**/*.tsx"],
      rules: {
        // Be pragmatic in library layer while stabilizing types
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
}