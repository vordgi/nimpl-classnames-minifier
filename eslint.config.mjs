import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import tseslint from "typescript-eslint";

export default [
    {
        rules: {
            "prettier/prettier": [
                "error",
                {
                    endOfLine: "auto",
                    tabWidth: 4,
                    printWidth: 120,
                    arrowParens: "always",
                },
            ],
        },
    },
    ...tseslint.configs.recommended,
    eslintPluginPrettierRecommended,
    {
        ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
    },
];
