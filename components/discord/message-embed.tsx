/* eslint-disable @next/next/no-img-element */
import { cn } from "@/utils/cn";
import React from "react";

import { DiscordMarkdown } from "./markdown";

interface Props {
    children: React.ReactNode;
    mode: "DARK" | "LIGHT";
    className?: string;

    author?: {
        icon_url?: string;
        text: string;
    };

    title?: string;
    color: number;
    thumbnail?: string;
    image?: string;

    footer?: {
        icon_url?: string;
        text: string;
    };
}

export default function DiscordMessageEmbed({
    children,
    className,
    author,
    title,
    color,
    thumbnail,
    image,
    footer,
    mode
}: Props) {
    if (!title && !image && !footer?.text && (!children || children.toString() === ",false" || (Array.isArray(children) && !children.filter(Boolean).length))) return <></>;

    return (
        <div
            className={cn(
                mode === "DARK" ? "text-neutral-200" : "text-neutral-800",
                "w-full font-light p-3 rounded-sm border-l-4 mt-2",
                className
            )}
            style={{
                backgroundColor: mode === "DARK" ? "#26272f" : "#f2f3f5",
                borderLeftColor: `#${color?.toString(16)}`
            }}
        >

            <div className="flex w-full max-w-full">
                <div className={thumbnail ? "w-9/12" : "w-full"}>
                    {author && (
                        <div
                            className={cn(
                                mode === "DARK" ? "text-neutral-100" : "text-neutral-900",
                                "font-semibold text-semibold mb-2 flex gap-2 items-center"
                            )}
                        >
                            {author.icon_url && <img src={author.icon_url} alt="" className="rounded-full h-6 w-6" />}
                            <DiscordMarkdown
                                mode={mode}
                                text={author.text}
                                embed={true}
                            />
                        </div>
                    )}
                    {title && (
                        <div
                            className={cn(
                                mode === "DARK" ? "text-neutral-100" : "text-neutral-900",
                                "font-semibold text-lg mb-2",
                                !author && "-mt-1"
                            )}
                        >
                            <DiscordMarkdown
                                mode={mode}
                                text={title}
                                embed={true}
                            />
                        </div>
                    )}
                    <div className="text-sm">
                        {children}
                    </div>
                </div>

                {thumbnail && <img src={replaceTemplatesToUrl(thumbnail)} alt="" className="ml-auto h-20 w-20 rounded-md" />}
            </div>

            {image && <img src={replaceTemplatesToUrl(image)} alt="" className="ml-auto rounded-md h-full w-full mt-4" />}

            {footer?.text &&
                <div className="flex gap-1 items-center mt-3">
                    {footer.icon_url && <img src={footer.icon_url} alt="" className="rounded-full h-5 w-5" />}
                    <span className="text-xs">
                        <DiscordMarkdown
                            mode={mode}
                            text={footer.text}
                            embed={true}
                        />
                    </span>
                </div>
            }

        </div>
    );
}

function replaceTemplatesToUrl(input: string) {
    if (/^{(user|guild|creator)\.(icon|avatar)}$/.test(input)) return "https://cdn.discordapp.com/embed/avatars/0.png";
    if (/^{(video|stream)\.thumbnail}/.test(input)) return "/_next/image?url=/notifications-thumbnail-placeholder.webp&w=384&q=75";

    if (!input.startsWith("http")) return;
    return input;
}