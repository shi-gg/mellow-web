import { defineConfig } from "fumadocs-mdx/config";

const NOT_ASCII_REGEX = /[^a-zA-Z0-9- ]/g;
const SPACES_REGEX = / +/g;

export default defineConfig({
    mdxOptions: {
        remarkImageOptions: false,
        remarkHeadingOptions: {
            slug: (_root, _heading, text) => text
                .toLowerCase()
                .replace(NOT_ASCII_REGEX, "")
                .trim()
                .replace(SPACES_REGEX, "-")
        }
    }
});