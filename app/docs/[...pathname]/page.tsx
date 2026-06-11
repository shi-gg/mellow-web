import { Faq } from "@/app/(home)/faq.component";
import BeautifyMarkdown from "@/components/markdown";
import { ScreenMessage } from "@/components/screen-message";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import metadata from "@/public/docs/meta.json";
import { readFile } from "fs/promises";
import { HiExclamationCircle } from "react-icons/hi";

interface Props {
    params: Promise<{ pathname: string[]; }>;
}

const PATH = `${process.cwd()}/public/docs` as const;

export default async function Home({ params }: Props) {
    const { pathname } = await params;
    const markdown = await readFile(`${PATH}/${pathname.join("/").toLowerCase()}.md`, "utf-8").catch(() => null);
    const meta = metadata.pages.find((page) => page.file === `${pathname.join("/").toLowerCase()}.md`);

    if (!markdown || !meta) {
        return (
            <ScreenMessage
                top="6rem"
                title="Sadly, this page can not be found.."
                description="Seems like you got a little lost here? Here's wumpus for now!"
            />
        );
    }

    return (
        <article
            itemType="http://schema.org/Article"
            className="w-full lg:w-3/4"
        >
            {meta?.permissions?.bot && (
                <Alert
                    className="mb-2"
                >
                    <HiExclamationCircle className="size-4" />

                    <AlertTitle>
                        Wamellow requires permissions
                    </AlertTitle>

                    <AlertDescription
                        className="flex flex-wrap gap-1 gap-y-3 my-1.5"
                    >
                        {meta.permissions.bot.map((perm) => (
                            <Badge
                                key={perm}
                                className="-my-1"
                            >
                                {perm}
                            </Badge>
                        ))}
                    </AlertDescription>
                </Alert>
            )}

            <BeautifyMarkdown markdown={markdown} />

            <div className="h-16" />

            <Faq showTitle />
        </article>
    );
}