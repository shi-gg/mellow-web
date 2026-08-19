"use client";

import {
    SidebarContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarProvider
} from "@/components/ui/sidebar";
import { cn } from "@/utils/cn";
import * as Collapsible from "@radix-ui/react-collapsible";
import type { Folder, Item, Node, Root } from "fumadocs-core/page-tree";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";

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

function isActive(url: string, pathname: string) {
    const href = url.length > 1 && url.endsWith("/") ? url.slice(0, -1) : url;
    const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

    return href === path;
}

function folderActive(folder: Folder, pathname: string): boolean {
    if (folder.index && isActive(folder.index.url, pathname)) return true;

    return folder.children.some((child) => nodeActive(child, pathname));
}

function nodeActive(node: Node, pathname: string): boolean {
    if (node.type === "page") return isActive(node.url, pathname);
    if (node.type === "folder") return folderActive(node, pathname);

    return false;
}

function ItemNode({ item }: { item: Item; }) {
    const pathname = usePathname();

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={isActive(item.url, pathname)}
            >
                <Link href={item.url}>
                    <SplitName>{item.name}</SplitName>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

function FolderNode({ item, children }: { item: Folder; children: ReactNode; }) {
    const pathname = usePathname();
    const indexActive = item.index ? isActive(item.index.url, pathname) : false;
    const active = folderActive(item, pathname);
    const [open, setOpen] = useState(active);
    const [prevPathname, setPrevPathname] = useState(pathname);

    if (prevPathname !== pathname) {
        setPrevPathname(pathname);
        setOpen(active);
    }

    return (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
            <SidebarMenuItem>
                <div className="flex w-full items-center">
                    {item.index ? (
                        <SidebarMenuButton
                            asChild
                            isActive={indexActive}
                            className="min-w-0 flex-1"
                        >
                            <Link href={item.index.url}>
                                <SplitName>{item.name}</SplitName>
                                <ChevronDown
                                    className={cn("size-4 transition-transform duration-200 -rotate-90 ml-auto", open && "rotate-0")}
                                />
                            </Link>
                        </SidebarMenuButton>
                    ) : (
                        <SidebarMenuButton
                            isActive={indexActive}
                            className="min-w-0 flex-1"
                            onClick={() => setOpen((value) => !value)}
                        >
                            <SplitName>{item.name}</SplitName>
                        </SidebarMenuButton>
                    )}
                </div>
                <Collapsible.Content className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
                    <SidebarMenuSub>
                        {children}
                    </SidebarMenuSub>
                </Collapsible.Content>
            </SidebarMenuItem>
        </Collapsible.Root>
    );
}

function renderNodes(nodes: Node[]): ReactNode {
    return nodes.map((node) => {
        if (node.type === "folder") {
            return (
                <FolderNode key={node.$id} item={node}>
                    {renderNodes(node.children)}
                </FolderNode>
            );
        }

        if (node.type === "separator") {
            return null;
        }

        return <ItemNode key={node.$id} item={node} />;
    });
}

export function DocsNav({ tree }: { tree: Root; }) {
    return (
        <SidebarProvider className="min-h-fit">
            <SidebarContent>
                <SidebarMenu>
                    {renderNodes(tree.children)}
                </SidebarMenu>
            </SidebarContent>
        </SidebarProvider>
    );
}