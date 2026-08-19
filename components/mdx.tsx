import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import type { ImgHTMLAttributes, ReactNode } from "react";
import { isValidElement } from "react";
import { HiExclamation } from "react-icons/hi";

import { Alert, AlertTitle } from "./ui/alert";

const REGEX = /\s+/g;

export function getMDXComponents(components?: MDXComponents): MDXComponents {
    return {
        ...defaultMdxComponents,
        img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                alt={props.alt || "image"}
                loading="lazy"
                className="rounded-lg"
                {...props}
            />
        ),
        Callout: ({ children }: { children?: ReactNode; }) => (
            <Alert className="my-3" variant="secondary">
                <HiExclamation className="size-4 mt-0.5" />

                <AlertTitle>
                    {toText(children)}
                </AlertTitle>
            </Alert>
        ),
        ...components
    };
}

export const useMDXComponents = getMDXComponents;

declare global {
    type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}

function toText(children: ReactNode): string {
    if (children === null || children === undefined || typeof children === "boolean") return "";

    if (typeof children === "string" || typeof children === "number") return String(children);

    if (Array.isArray(children)) {
        return children.map((child) => toText(child)).join(" ").replace(REGEX, " ").trim();
    }

    if (isValidElement(children)) {
        return toText((children.props as { children?: ReactNode; }).children);
    }

    return "";
}