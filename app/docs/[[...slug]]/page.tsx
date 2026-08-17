import { getMDXComponents } from "@/components/mdx";
import { source } from "@/lib/source";
import { getCanonicalUrl } from "@/utils/urls";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ slug: string[]; }>;
}

export default async function Page(props: Props) {
    const params = await props.params;
    const page = source.getPage(params.slug);

    if (!page) notFound();

    const MDX = page.data.body;

    return (
        <article className="w-full">
            <h1 className="text-3xl text-white font-semibold mb-2">
                {page.data.title}
            </h1>
            <div className="prose flex-1 max-w-none">
                <MDX
                    components={getMDXComponents({
                        a: createRelativeLink(source, page)
                    })}
                />
            </div>
        </article>
    );
}

export function generateStaticParams() {
    return source.generateParams();
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const page = source.getPage(params.slug);

    if (!page) notFound();

    const pathname = page.slugs.join("/");
    const title = page.slugs.length === 0 ? "Documentation" : `${page.data.title} docs`;
    const url = getCanonicalUrl("docs", pathname);
    const images = {
        url: getCanonicalUrl("docs", "open-graph", `${pathname || "index"}.png`),
        alt: page.data.description,
        height: 630,
        width: 1_200
    };

    return {
        title,
        description: page.data.description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description: page.data.description,
            url,
            type: "article",
            images
        },
        twitter: {
            card: "summary_large_image",
            title,
            description: page.data.description,
            images
        }
    };
}