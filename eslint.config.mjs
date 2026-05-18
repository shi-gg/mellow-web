import { base, recommended, strict } from '@mwlica/eslint';
import next from "@next/eslint-plugin-next";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";
import react from "@eslint-react/eslint-plugin";

export default tseslint.config(
    { ignores: ['dist/**', 'eslint.config.mjs', 'node_modules', '.next', '**/gt4.ts', 'next-env.d.ts', 'postcss.config.js'] },
    base,
    recommended,
    strict,
    {
        files: ["**/*.tsx"],
        languageOptions: {
            parserOptions: {
                project: ["./tsconfig.eslint.json", "./tsconfig.json"],
                tsconfigRootDir: import.meta.dirname,
                warnOnUnsupportedTypeScriptVersion: false,
            },
        },
    },
    {
        plugins: {
            "react-compiler": reactCompiler,
        },
        extends: [
            reactHooks.configs.flat.recommended,
            next.configs.recommended,
            next.configs["core-web-vitals"],
            react.configs["recommended-typescript"],
        ],
        rules: {
            "@eslint-react/naming-convention-ref-name": "off",
            "@eslint-react/no-forward-ref": "off",
            "import/extensions": "off",
        },
    },
)
