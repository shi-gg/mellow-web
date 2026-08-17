import { getMDXComponents } from "@/components/mdx";
import { legal } from "@/lib/source";
import { notFound } from "next/navigation";

export function LegalMarkdown({ file }: { file: string; }) {
    const page = legal.getPage(file);

    if (!page) notFound();

    const MDX = page.body;

    return (
        <article className="prose flex-1 max-w-none">
            <MDX components={getMDXComponents()} />
        </article>
    );
}