"use client";

import { cn } from "@/utils/cn";
import type { Root } from "fumadocs-core/page-tree";
import {
    SidebarFolder,
    SidebarFolderContent,
    SidebarFolderLink,
    SidebarFolderTrigger,
    SidebarItem,
    SidebarProvider,
    SidebarSeparator,
    useFolderDepth
} from "fumadocs-ui/components/sidebar/base";
import { createPageTreeRenderer } from "fumadocs-ui/components/sidebar/page-tree";
import { TreeContextProvider } from "fumadocs-ui/contexts/tree";
import type { ReactNode } from "react";

function SplitName({ children }: { children: ReactNode; }) {
    let name: string | undefined;

    if (Array.isArray(children)) {
        name = children.find((child): child is string => typeof child === "string");
    } else if (typeof children === "string") {
        name = children;
    }

    if (name === undefined) return children;

    const icon = name.split(" ").shift() || "";
    const label = name.replace(icon, "").trim();

    return (
        <>
            <span>{icon}</span>
            <span className="truncate">{label}</span>
        </>
    );
}

const ITEM_CLASS = "inline-flex items-center gap-2 rounded-lg text-sm font-medium transition-colors w-full justify-start h-9 px-4 whitespace-nowrap text-accent-foreground/85 hover:bg-wamellow hover:text-accent-foreground data-[active=true]:bg-wamellow-200 data-[active=true]:text-primary-foreground [&_svg]:size-4 [&_svg]:shrink-0";

const ITEM_INDENT = 16;
const ITEM_PADDING = 16;

const SidebarPageTree = createPageTreeRenderer({
    SidebarFolder,
    SidebarFolderContent,
    SidebarFolderLink: function StyledFolderLink({ className, style, children, ...props }) {
        const depth = useFolderDepth();
        return (
            <SidebarFolderLink
                className={cn(ITEM_CLASS, className)}
                style={{ paddingInlineStart: (depth - 1) * ITEM_INDENT + ITEM_PADDING, ...style }}
                {...props}
            >
                <SplitName>{children}</SplitName>
            </SidebarFolderLink>
        );
    },
    SidebarFolderTrigger: function StyledFolderTrigger({ className, style, children, ...props }) {
        const depth = useFolderDepth();
        return (
            <SidebarFolderTrigger
                className={cn(ITEM_CLASS, className)}
                style={{ paddingInlineStart: (depth - 1) * ITEM_INDENT + ITEM_PADDING, ...style }}
                {...props}
            >
                <SplitName>{children}</SplitName>
            </SidebarFolderTrigger>
        );
    },
    SidebarItem: function StyledItem({ className, style, children, ...props }) {
        const depth = useFolderDepth();
        return (
            <SidebarItem
                className={cn(ITEM_CLASS, className)}
                style={{ paddingInlineStart: depth * ITEM_INDENT + ITEM_PADDING, ...style }}
                {...props}
            >
                <SplitName>{children}</SplitName>
            </SidebarItem>
        );
    },
    SidebarSeparator
});

export function DocsNav({
    tree
}: {
    tree: Root;
}) {
    return (
        <TreeContextProvider tree={tree}>
            <SidebarProvider>
                <SidebarPageTree />
            </SidebarProvider>
        </TreeContextProvider>
    );
}