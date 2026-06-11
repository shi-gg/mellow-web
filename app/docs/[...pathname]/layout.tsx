import { Footer } from "@/components/footer";
import { Button, LinkButton } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import metadata from "@/public/docs/meta.json";
import { cn } from "@/utils/cn";
import { isDiscord } from "@/utils/discord";
import { getCanonicalUrl } from "@/utils/urls";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { BsDiscord, BsGithub } from "react-icons/bs";
import { HiExternalLink, HiUserAdd, HiViewGridAdd } from "react-icons/hi";

const MARKDOWN_EXT_REGEX = /\.md$/;

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
    params: Promise<{ pathname: string[]; }>;
    children: React.ReactNode;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { pathname } = await params;
    const meta = metadata.pages.find((page) => page.file === `${pathname.join("/").toLowerCase()}.md`);

    const url = getCanonicalUrl("docs", ...pathname);
    const title = meta?.file === "index.md"
        ? "Documentation"
        : `${meta?.name} docs`;

    const images = {
        url: getCanonicalUrl("docs", "open-graph", `${pathname.join("/")}.png`),
        alt: meta?.description,
        height: 630,
        width: 1_200
    };

    if (isDiscord(await headers())) {
        return {
            title,
            description: undefined,
            openGraph: {
                title,
                description: undefined,
                url,
                type: "article",
                images
            },
            twitter: {
                card: "summary_large_image",
                title,
                description: undefined,
                images
            }
        };
    }

    return {
        title,
        description: meta?.description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description: meta?.description,
            url,
            type: "article",
            images
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: meta?.description,
            images
        }
    };
};

export default async function RootLayout({ params, children }: Props) {
    const { pathname } = await params;
    const currentFile = `${pathname.join("/").toLowerCase()}.md`;
    const meta = metadata.pages.find((page) => page.file === currentFile);

    const title = meta?.file === "index.md"
        ? "🏡 Wamellow"
        : meta?.name;

    return (
        <div className="w-full">

            <h1 className="text-2xl font-medium text-neutral-100">
                {title} Documentation
            </h1>

            <div className="flex flex-col md:flex-row gap-6 mt-5 min-h-[63vh]">
                <nav className="w-full md:w-1/4 space-y-2 md:sticky md:top-6 md:self-start">

                    <ul className="space-y-1 mb-2 bg-wamellow p-2 rounded-lg">
                        {metadata.pages.map((page) =>
                            <NavButton
                                key={"nav-" + page.file}
                                page={page}
                                active={page.file === currentFile}
                            />
                        )}
                    </ul>

                    <ul className="space-y-1 bg-wamellow p-2 rounded-lg">
                        {RESOURCES.map((page) =>
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
                        )}
                    </ul>

                    <Button
                        asChild
                        variant="link"
                        className="pl-2"
                    >
                        <Link
                            href="https://github.com/shi-gg/mellow-web/blob/master/public/docs"
                            target="_blank"
                        >
                            <BsGithub className="size-4!" /> Suggest edits
                        </Link>
                    </Button>
                </nav>

                <Separator className="md:hidden" />

                {children}
            </div>

            <Footer className="mt-24" />
        </div>
    );
}

function NavButton({
    page,
    active
}: {
    page: typeof metadata.pages[0];
    active?: boolean;
}) {
    const file = page.file.replace(MARKDOWN_EXT_REGEX, "");
    const icon = page.name.split(" ").shift() || "";
    const name = page.name.replace(icon, "");

    return (
        <li>
            <LinkButton
                className={cn(
                    "w-full justify-start! h-8",
                    active
                        ? "bg-wamellow"
                        : "bg-transparent"
                )}
                href={`/docs/${file}`}
                size="sm"
                aria-current={active ? "page" : undefined}
            >
                <span className="mr-0.5">
                    {icon}
                </span>
                {name}
            </LinkButton>
        </li>
    );
}