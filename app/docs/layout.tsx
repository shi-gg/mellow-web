import { Footer } from "@/components/footer";
import { Button, LinkButton } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { source } from "@/lib/source";
import Link from "next/link";
import type { ReactNode } from "react";
import { BsDiscord, BsGithub } from "react-icons/bs";
import { HiExternalLink, HiUserAdd, HiViewGridAdd } from "react-icons/hi";

import { DocsNav } from "./docs-nav";
import { DocsSearch } from "./docs-search";

const RESOURCES = [
    {
        name: "Support",
        href: "/support",
        icon: <BsDiscord className="size-4" />
    },
    {
        name: "Invite",
        href: "/invite",
        icon: <HiUserAdd className="size-4" />
    },
    {
        name: "Dashboard",
        href: "/profile",
        icon: <HiViewGridAdd className="size-4" />
    }
];

interface Props {
    children: ReactNode;
}

export default function Layout({ children }: Props) {
    const tree = source.getPageTree();

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row gap-6 mt-5 min-h-[63vh]">
                <nav className="w-full lg:w-1/4 shrink-0 space-y-2 lg:sticky lg:top-6 lg:self-start">
                    <DocsSearch />

                    <div className="mb-2 bg-wamellow p-2 rounded-lg">
                        <DocsNav tree={tree} />
                    </div>

                    <ul className="space-y-1 bg-wamellow p-2 rounded-lg">
                        {RESOURCES.map((page) => (
                            <li key={"nav-" + page.href}>
                                <LinkButton
                                    className="w-full justify-start! h-8 bg-transparent pr-2"
                                    href={page.href}
                                    target="_blank"
                                    size="sm"
                                >
                                    <span className="mr-0.5">{page.icon}</span>
                                    {page.name}
                                    <HiExternalLink className="size-4! ml-auto" />
                                </LinkButton>
                            </li>
                        ))}
                    </ul>

                    <Button
                        asChild
                        variant="link"
                        className="pl-2"
                    >
                        <Link
                            href="https://github.com/shi-gg/mellow-web/blob/master/content/docs"
                            target="_blank"
                        >
                            <BsGithub className="size-4!" /> Suggest edits
                        </Link>
                    </Button>
                </nav>

                <Separator className="lg:hidden" />

                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </div>

            <Footer className="mt-24" />
        </div>
    );
}