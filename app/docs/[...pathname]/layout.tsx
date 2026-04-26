import { Footer } from "@/components/footer";
import { Button, LinkButton } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import metadata from "@/public/docs/meta.json";
import { cn } from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";
import type { Metadata } from "next";
import Link from "next/link";
import { BsDiscord, BsGithub } from "react-icons/bs";
import { HiUserAdd, HiViewGridAdd } from "react-icons/hi";

interface Props {
    params: Promise<{ pathname: string[]; }>;
    children: React.ReactNode;
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { pathname } = await params;
    const meta = metadata.pages.find((page) => page.file === `${pathname.join("/").toLowerCase()}.md`);

    const title = meta?.file === "index.md"
        ? "Documentation"
        : `${meta?.name} docs`;

    const url = getCanonicalUrl("docs", ...pathname);
    const images = {
        url: meta?.image || `${getBaseUrl()}/waya-v3.webp?v=2`,
        alt: meta?.description,
        heigth: 1_008,
        width: 1_935
    };

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

            <h1 className="text-2xl font-medium text-neutral-100 mb-1">
                {title} Documentation
            </h1>
            <div>
                {meta?.description}
            </div>

            <div className="flex flex-col lg:flex-row gap-6 mt-5 min-h-[63vh]">
                <nav className="w-full lg:w-1/4 space-y-2 md:sticky md:top-6 md:self-start">

                    <ul className="space-y-1 mb-4 bg-wamellow p-2 rounded-md border border-wamellow-alpha">
                        {metadata.pages.map((page, i) =>
                            <NavButton
                                key={"nav-" + page.file + i}
                                page={page}
                                active={page.file === currentFile}
                            />
                        )}
                    </ul>

                    <LinkButton
                        className="w-full justify-start!"
                        href="/support"
                        target="_blank"
                        variant="blurple"
                    >
                        <BsDiscord />
                        Join Support
                    </LinkButton>
                    <LinkButton
                        className="w-full justify-start!"
                        href="/invite"
                        target="_blank"
                        variant="secondary"
                    >
                        <HiUserAdd />
                        Invite Wamellow
                    </LinkButton>
                    <LinkButton
                        className="w-full justify-start!"
                        href="/profile"
                        target="_blank"
                    >
                        <HiViewGridAdd />
                        Dashboard
                    </LinkButton>
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

                <Separator className="lg:hidden" />

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
    const file = page.file.replace(/\.md$/, "");
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
            >
                <span className="mr-0.5">
                    {icon}
                </span>
                {name}
            </LinkButton>
        </li>
    );
}