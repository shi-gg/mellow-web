/* eslint-disable @typescript-eslint/no-unused-vars */

import { getUser } from "@/lib/discord/user";
import { cn } from "@/utils/cn";
import { filterDuplicates } from "@/utils/filter-duplicates";
import { getBaseUrl } from "@/utils/urls";
import Link from "next/link";
import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import Channel from "./channel";
import Emoji from "./emoji";
import Timestamp from "./timestamp";
import User from "./user";
import Notice, { NoticeType } from "../notice";
import { Separator } from "../ui/separator";
import { Anchor, Code } from "../ui/typography";

const ALLOWED_IFRAMES = [
    "https://www.youtube.com/embed/",
    "https://e.widgetbot.io/channels/",
    getBaseUrl()
] as const;

const EMOJI_REGEX = /([\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA70}-\u{1FAFF}]|[\u{200D}]|[\u{23CF}]|[\u{23E9}-\u{23FA}]|[\u{24C2}]|[\u{25AA}-\u{25AB}]|[\u{25FB}-\u{25FE}]|[\u{00A9}]|[\u{00AE}]|[\u{203C}]|[\u{2049}]|[\u{2122}]|[\u{2139}]|[\u{2194}-\u{2199}]|[\u{21A9}-\u{21AA}]|[\u{231A}-\u{231B}]|[\u{2328}]|[\u{2388}]|[\u{23E9}-\u{23EC}]|[\u{23F0}]|[\u{23F3}]|[\u{25FD}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2692}-\u{269C}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2705}]|[\u{270A}-\u{270B}]|[\u{2728}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2795}-\u{2797}]|[\u{27B0}]|[\u{27BF}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{2934}-\u{2935}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}])/gu;
const USER_MENTION_REGEX = /<@!?\d{15,21}>/g;
const STRIP_CHARS_REGEX = /[!<>@]/g;
const BOLD_REGEX = /__(.*?)__/g;
const EMOJI_MENTION_REGEX = /<a?:\w{2,32}:\d{15,21}>/g;
const SNOWFLAKE_REGEX = /\d{15,21}/;
const USER_MENTION_GROUP_REGEX = /<(@!?)\d{15,21}>/g;
const ROLE_MENTION_REGEX = /<(@&)\d{15,21}>/g;
const CHANNEL_MENTION_REGEX = /<(#!?)\d{15,21}>/g;
const TIMESTAMP_REGEX = /<t:\d{1,10}:[Rf]?>/g;
const TIMESTAMP_NUM_REGEX = /\d{1,10}/;
const EMOJI_END_REGEX = /:\w*?>/;
const SPACES_REGEX = / +/g;

export default async function BeautifyMarkdown({
    markdown
}: {
    markdown: string;
}) {
    const { renderToString } = await import("react-dom/server");

    async function parseDiscordMarkdown(content: string) {
        const users = await Promise.all(
            filterDuplicates(content.match(USER_MENTION_REGEX) || [])
                .map((match) => match.replace(STRIP_CHARS_REGEX, ""))
                .map((userId) => getUser(userId))
        );

        return content
            .replace(BOLD_REGEX, "<u>$1</u>")
            .replace(EMOJI_MENTION_REGEX, (match) => {
                const emojiId = match.match(SNOWFLAKE_REGEX)?.[0] as string;

                return renderToString(<Emoji emojiId={emojiId} />);
            })
            .replace(USER_MENTION_GROUP_REGEX, (match) => {
                const userId = match.replace(STRIP_CHARS_REGEX, "");
                const username = users.find((user) => user?.id === userId)?.username || "user";

                return renderToString(<User username={username} />);
            })
            .replace(ROLE_MENTION_REGEX, () => {
                return renderToString(<User username="some-role" />);
            })
            .replace(CHANNEL_MENTION_REGEX, () => {
                return renderToString(<Channel name="some-channel" />);
            })
            .replace(TIMESTAMP_REGEX, (match) => {
                const timestamp = match.match(TIMESTAMP_NUM_REGEX)?.[0] as string;
                const format = match.match(EMOJI_END_REGEX)?.[0] || "f";

                return renderToString(
                    <Timestamp
                        unix={Number.parseInt(timestamp, 10)}
                        format={format.slice(1, -1)}
                    />
                );
            });
    }

    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            components={{
                h1: (props) => (<>
                    <Link
                        href={`#${createHId(props.children)}`}
                        className="flex mt-10 mb-3 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline w-fit"
                    >
                        <h2 id={createHId(props.children)} className="text-3xl font-semibold" {...props} />
                    </Link>
                    <Separator className="mb-3" />
                </>),

                h2: (props) => (<>
                    <Link
                        href={`#${createHId(props.children)}`}
                        className="flex mt-6 mb-2 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline w-fit"
                    >
                        <h1 id={createHId(props.children)} className="text-2xl font-semibold" {...props} />
                    </Link>
                    <Separator className="mb-3" />
                </>),

                h3: (props) => (
                    <Link
                        href={`#${createHId(props.children)}`}
                        className="flex mt-6 mb-2 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline w-fit"
                    >
                        <h3 id={createHId(props.children)} className="text-lg font-semibold" {...props} />
                    </Link>
                ),

                strong: (props) => <span className="font-semibold dark:text-neutral-200 text-neutral-800" {...props} />,
                i: (props) => <span className="italic" {...props} />,
                del: (props) => <span className="line-through" {...props} />,
                ins: (props) => <span className="underline" {...props} />,

                code: ({ ref, color, ...props }) => <Code {...props}>{props.children}</Code>,
                img: ({ alt = "image", ...props }) => {
                    const isFullWidth = typeof props.src === "string" && props.src?.includes("fullwidth=true");

                    return (
                        <span
                            className={cn(
                                "w-fit flex-col items-center inline",
                                alt === "emoji" ? "inline" : "flex",
                                isFullWidth ? "max-w-3xl" : "max-w-lg"
                            )}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img alt={alt} className={cn("rounded-lg", alt === "emoji" && "inline")} loading="lazy" {...props} />
                            {alt && alt !== "emoji" && <span aria-hidden="true" className="text-neutral-500 font-medium text-sm text-center">{alt}</span>}
                        </span>
                    );
                },
                a: ({ href, children }) => <Anchor href={href || "#"} target="_blank">{children}</Anchor>,

                table: (props) => <table className="mt-4 table-auto w-full divide-y divide-wamellow overflow-scroll" {...props} />,
                th: (props) => <th className=" px-2 pb-2 font-medium text-neutral-800 dark:text-neutral-200 text-left" {...props} />,
                tbody: (props) => <tbody className="[&>*:nth-child(odd)]:bg-neutral-800/15" {...props} />,
                tr: (props) => <tr className="divide-x divide-wamellow" {...props} />,
                td: (props) => <td className="px-2 py-1 divide-x-8 divide-wamellow break-all" {...props} />,

                iframe: ({ className, ...props }) => {
                    if (ALLOWED_IFRAMES.some((url) => props.src?.startsWith(url))) {
                        return (
                            <iframe
                                allow="clipboard-write; fullscreen"
                                className={cn(
                                    "w-full rounded-lg mt-4",
                                    className
                                )}
                                {...props}
                            />
                        );
                    }

                    return (
                        <div className="mt-4">
                            <Notice
                                type={NoticeType.Error}
                                message={`Iframe from "${props.src?.split("/")[2]}" is not allowed`}
                            />
                        </div>
                    );
                },

                ol: (props) => <ol className="list-decimal list-inside space-y-1 marker:text-neutral-300/40 my-1" {...props} />,
                ul: (props) => <ul className="list-disc list-inside space-y-1 marker:text-neutral-300/40 my-1" {...props} />,
                p: (props) => <span {...props} />,

                mark: ({ children }) => <Notice type={NoticeType.Info} message={children?.toString() || ""} />

            }}
        >
            {await parseDiscordMarkdown(markdown)}
        </ReactMarkdown>
    );
}

function createHId(text: ReactNode) {
    return text
        ?.toString()
        .toLowerCase()
        .replace("[object object],[object object],", "")
        .replace(EMOJI_REGEX, "")
        .trim()
        .replace(SPACES_REGEX, "-");
}