import type { GuildEmbed } from "@/typings";
import { cn } from "@/utils/cn";
import React, { useState } from "react";
import { BiMoon, BiSun } from "react-icons/bi";
import { FaFloppyDisk } from "react-icons/fa6";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

import { DiscordMarkdown } from "./discord/markdown";
import DiscordMessage from "./discord/message";
import DiscordMessageEmbed from "./discord/message-embed";
import { ControlledColorInput } from "./inputs/controlled-color-input";
import { ControlledInput } from "./inputs/controlled-input";
import { Button } from "./ui/button";

enum State {
    Idle = 0,
    Loading = 1,
    Success = 2
}

interface Props {
    children?: React.ReactNode;

    name: string;
    endpoint: string;
    k: string;

    defaultMessage?: { content?: string | null; embed?: GuildEmbed; };
    isCollapseable?: boolean;

    messageAttachmentComponent?: React.ReactNode;
    showMessageAttachmentComponentInEmbed?: boolean;

    user?: {
        username: string;
        avatar: string;
        bot: boolean;
    };

    disabled?: boolean;
    onSave?: (state: { content: string; embed: GuildEmbed; }) => void;
}

export default function MessageCreatorEmbed({
    children,

    name,
    endpoint,
    k,

    defaultMessage,
    isCollapseable,

    messageAttachmentComponent,
    showMessageAttachmentComponentInEmbed,

    user,

    disabled,
    onSave
}: Props) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const [content, setContent] = useState<string>(defaultMessage?.content || "");
    const [embed, setEmbed] = useState<string>(JSON.stringify(defaultMessage?.embed || {}));
    const [embedfooter, setEmbedfooter] = useState<string>(JSON.stringify(defaultMessage?.embed?.footer || {}));

    const [open, setOpen] = useState<boolean>(!isCollapseable);
    const [mode, setMode] = useState<"DARK" | "LIGHT">("DARK");

    const modeToggle = (
        <div
            className={cn(
                mode === "DARK" ? "bg-wamellow-light" : "bg-wamellow-100-light",
                "flex gap-1 text-neutral-400 rounded-md overflow-hidden"
            )}
        >
            <button
                onClick={() => setMode("DARK")}
                className={cn(
                    "py-2 px-3 rounded-md",
                    mode === "DARK" ? "bg-wamellow" : "hover:bg-wamellow-100-alpha"
                )}
            >
                <BiMoon className="h-5 w-5" />
            </button>
            <button
                onClick={() => setMode("LIGHT")}
                className={cn(
                    "py-2 px-3 rounded-md",
                    mode === "LIGHT" ? "bg-wamellow-100" : "hover:bg-wamellow-alpha"
                )}
            >
                <BiSun className="h-5 w-5" />
            </button>
        </div>
    );

    async function save() {
        setError(null);
        setState(State.Loading);

        const body = {
            content,
            embed: Object.assign(
                JSON.parse(embed),
                embedfooter.length
                    ? { footer: JSON.parse(embedfooter) }
                    : undefined
            )
        };

        if (!body.embed.footer.text) body.embed.footer = { text: null };

        const res = await fetch(`${process.env.NEXT_PUBLIC_API}${endpoint}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(k.includes(".")
                ? { [k.split(".")[0]]: { [k.split(".")[1]]: body } }
                : { [k]: body }
            )
        })
            .then((r) => r.json())
            .catch(() => null);

        if (!res || "status" in res) {
            setState(State.Idle);
            setError(
                "message" in res
                    ? res.message
                    : "Something went wrong while saving.."
            );

            return;
        }

        if (onSave) onSave(body);
        setState(State.Success);
        setTimeout(() => setState(State.Idle), 1_000 * 8);
    }

    return (
        <div>
            <div
                className={cn(
                    "mt-8 mb-4 border-2 dark:border-wamellow border-wamellow-100 rounded-xl md:px-4 md:pb-4 px-2 py-2",
                    error && "outline-solid outline-red-500 outline-1"
                )}
            >
                <div className="text-lg py-2 dark:text-neutral-700 text-neutral-300 font-medium px-2">{name}</div>

                {isCollapseable &&
                    <div className={cn("md:mx-2 mx-1", open ? "lg:mb-0 mb-2" : "mb-2")}>
                        <button
                            className="dark:bg-wamellow hover:dark:bg-wamellow-light bg-wamellow-100 hover:bg-wamellow-100-light duration-200 cursor-pointer rounded-md dark:text-neutral-400 text-neutral-600 flex items-center h-12 px-3 w-full"
                            onClick={() => setOpen(!open)}
                        >
                            {open ?
                                <>
                                    <span>Collaps</span>
                                    <HiChevronUp className="ml-auto h-4 w-4" />
                                </>
                                :
                                <>
                                    <span>Expand</span>
                                    <HiChevronDown className="ml-auto h-4 w-4" />
                                </>
                            }
                        </button>
                    </div>
                }

                {open &&
                    <div className="md:m-1 relative">

                        {children &&
                            <div className={cn("mx-1", isCollapseable && "mt-6")}>
                                {children}
                            </div>
                        }

                        <div className="lg:flex gap-1">

                            <div className="lg:w-3/6 m-1">

                                <ControlledInput placeholder="Content" value={content} setValue={setContent} max={2_000} disabled={disabled} />
                                <ControlledInput placeholder="Embed Title" value={embed} setValue={setEmbed} max={256} dataName="title" disabled={disabled} />
                                <ControlledInput placeholder="Embed Description" value={embed} setValue={setEmbed} max={4_096} dataName="description" disabled={disabled} />
                                <div className="flex gap-2">
                                    <ControlledColorInput placeholder="Embed Color" value={embed} setValue={setEmbed} dataName="color" disabled={disabled} />
                                    <ControlledInput placeholder="Embed Thumbnail" value={embed} setValue={setEmbed} max={256} dataName="thumbnail" disabled={disabled} />
                                </div>
                                <ControlledInput placeholder="Embed Image" value={embed} setValue={setEmbed} max={256} dataName="image" disabled={disabled} />
                                <div className="flex gap-2">
                                    <ControlledInput placeholder="Embed Footer Icon" value={embedfooter} setValue={setEmbedfooter} max={256} dataName="icon_url" disabled={disabled} />
                                    <ControlledInput placeholder="Embed Footer" value={embedfooter} setValue={setEmbedfooter} max={256} dataName="text" disabled={disabled} />
                                </div>

                                <Button
                                    className="mt-1 w-full"
                                    onClick={() => save()}
                                    icon={<FaFloppyDisk />}
                                    disabled={disabled}
                                    loading={state === State.Loading}
                                    variant="secondary"
                                >
                                    Save Changes
                                </Button>

                            </div>

                            <div className="md:hidden flex m-2 mt-4">

                                <div className="flex items-center w-full">
                                    <span className="text-lg dark:text-neutral-300 text-neutral-700 font-medium">Color Theme</span>

                                    <div className="ml-auto flex items-center">
                                        {modeToggle}
                                    </div>
                                </div>

                            </div>

                            <div
                                className={cn(
                                    "relative lg:w-3/6 lg:mt-2 m-1 md:mt-8 mt-4 min-h-full rounded-md p-4 break-all overflow-hidden max-w-full text-neutral-200",
                                    mode === "DARK" ? "bg-discord-gray" : "bg-white"
                                )}
                            >

                                <div className="absolute z-10 top-2 right-2 hidden md:block">
                                    {modeToggle}
                                </div>

                                <DiscordMessage
                                    mode={mode}
                                    user={user || {
                                        username: "Wamellow",
                                        avatar: "/waya-v3.webp",
                                        bot: true
                                    }}
                                >
                                    <DiscordMarkdown
                                        mode={mode}
                                        text={content || ""}
                                    />

                                    <DiscordMessageEmbed
                                        mode={mode}
                                        title={JSON.parse(embed).title}
                                        color={JSON.parse(embed).color}
                                        thumbnail={JSON.parse(embed).thumbnail}
                                        image={JSON.parse(embed).image}
                                        footer={JSON.parse(embedfooter)}
                                    >
                                        {JSON.parse(embed).description && <DiscordMarkdown mode={mode} text={JSON.parse(embed).description} />}
                                        {showMessageAttachmentComponentInEmbed && messageAttachmentComponent}
                                    </DiscordMessageEmbed>

                                    {!showMessageAttachmentComponentInEmbed && messageAttachmentComponent}
                                </DiscordMessage>
                            </div>

                        </div>

                        <div className="flex justify-between">
                            <div className="text-sm m-1 text-neutral-500">
                                The preview might display things wrong*
                            </div>
                            <div className="flex gap-2">
                                {error && <div className="ml-auto text-red-500 text-sm">{error}</div>}
                                {state === State.Success && <div className="ml-auto text-green-500 text-sm">Saved</div>}
                            </div>
                        </div>
                    </div>}

            </div>
        </div>
    );
}