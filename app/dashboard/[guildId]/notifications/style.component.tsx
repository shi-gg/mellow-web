"use client";
import { guildStore } from "@/common/guilds";
import { DiscordMarkdown } from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import { ControlledInput } from "@/components/inputs/controlled-input";
import Modal from "@/components/modal";
import { Section } from "@/components/section";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { ApiError, ApiV1GuildsModulesNotificationsGetResponse, ApiV1GuildsModulesNotificationStylePatchResponse } from "@/typings";
import { State } from "@/utils/captcha";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { HiOutlineUpload, HiPencil, HiSparkles, HiX } from "react-icons/hi";

const ALLOWED_FILE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const MAX_FILE_SIZE = 8 * 1_024 * 1_024;

export function NotificationStyle({
    item,
    premium,
    onEdit
}: {
    item: ApiV1GuildsModulesNotificationsGetResponse;
    premium: boolean;
    onEdit: (opts: { username: string | null; avatar: string | null; }) => void;
}) {
    const guildId = guildStore((g) => g!.id);

    const [open, setOpen] = useState(false);

    return (<>
        <div className="w-full relative overflow-hidden rounded-xl border border-border group p-px mb-5">
            <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite_reverse] bg-[conic-gradient(from_90deg_at_0%_50%,#8b5cf6_50%,var(--wamellow-rgb)_100%)]" />

            <div className="backdrop-blur-3xl backdrop-brightness-25 rounded-[10px] p-5 md:py-8 md:pl-10 flex flex-col md:flex-row gap-5 md:gap-0">
                <div className="flex gap-6 items-center">
                    <UserAvatar
                        alt={premium && item.username ? item.username : "Wamellow"}
                        className="size-24"
                        src={premium && item.username && item.avatar ? `https://r2.wamellow.com/avatars/webhooks/${item.avatar}` : "/waya-v3.webp"}
                    />

                    <div className="space-y-2">
                        <span className="text-3xl font-medium text-primary-foreground">
                            {premium && item.username ? item.username : "Wamellow"}
                        </span>
                        <div className="flex">
                            {premium
                                ? <Button onClick={() => setOpen(true)}>
                                    <HiPencil />
                                    Change Style
                                </Button>
                                : <Button asChild>
                                    <Link
                                        href={`/premium?utm_source=${window.location.hostname}&utm_medium=notification-styles`}
                                        target="_blank"
                                    >
                                        <HiSparkles />
                                        Upgrade to change style
                                    </Link>
                                </Button>
                            }
                            {premium && (item.username || item.avatar) && (
                                <DeleteStyleButton
                                    id={item.id}
                                    guildId={guildId}
                                    onDelete={() => onEdit({ username: null, avatar: null })}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <ExampleMessages />
            </div>
        </div>

        <ChangeStyleModal
            id={item.id}
            guildId={guildId}

            username={item.username || null}
            avatarUrl={item.avatar ? `https://r2.wamellow.com/avatars/webhooks/${item.avatar}` : null}

            isOpen={open}
            onClose={() => setOpen(false)}
            onEdit={(style) => onEdit(style)}
        />
    </>);
}

function ExampleMessages() {
    return (
        <div className="w-full relative">
            <ExampleMessage className="top-1 md:-top-3 md:right-1 rotate-1 md:rotate-2 z-10" username="Kurzgesagt" avatarUrl="https://yt3.googleusercontent.com/ytc/AIdro_n1Ribd7LwdP_qKtqWL3ZDfIgv9M1d6g78VwpHGXVR2Ir4=s176-c-k-c0x00ffffff-no-rj-mo" />
            <ExampleMessage className="md:-bottom-3 right-0 md:-rotate-1" username="DarkViperAU" avatarUrl="https://yt3.googleusercontent.com/ytc/AIdro_lpNK9jpdw9D63LuUYt3SLbFpIQ5yD4DV0D5mwPrCp7cEw=s176-c-k-c0x00ffffff-no-rj-mo" />
        </div>
    );
}

function ExampleMessage({ className, username, avatarUrl }: { className?: string; username?: string; avatarUrl?: string; }) {
    return (
        <div className={cn("bg-discord-gray px-3 py-2 rounded-lg w-full md:max-w-sm relative md:absolute border border-wamellow shadow-lg", className)}>
            <DiscordMessage
                mode="DARK"
                user={{
                    username: username || "Wamellow",
                    avatar: avatarUrl || "/waya-v3.webp",
                    bot: true
                }}
            >
                {username === "DarkViperAU"
                    ? <DiscordMarkdown mode={"DARK"} text="[youtube.com/shorts/3zTsuUCGnN8](#)" />
                    : "Woooooooo!"
                }
            </DiscordMessage>
        </div>
    );
}

function isValidUsername(value: string | null): boolean {
    if (!value) return false;
    if (value.length < 2 || value.length > 32) return false;
    if (["everyone", "here"].includes(value.toLowerCase())) return false;
    if (/@|#|:|```|discord|clyde/i.test(value)) return false;
    return true;
}

interface Props {
    id: string;
    guildId: string;

    username: string | null;
    avatarUrl: string | null;

    isOpen: boolean;
    onClose: () => void;
    onEdit: (opts: ApiV1GuildsModulesNotificationStylePatchResponse) => void;
}

export function ChangeStyleModal({
    id,
    guildId,

    username,
    avatarUrl,

    isOpen,
    onClose,
    onEdit
}: Props) {
    const avatarRef = useRef<HTMLInputElement | null>(null);

    const [name, setName] = useState(username);
    const [avatar, setAvatar] = useState<ArrayBuffer | string | null>(avatarUrl);
    const [error, setError] = useState<string | null>(null);

    useEffect(
        () => {
            if (!isOpen) return;
            setAvatar(avatarUrl);
        },
        [isOpen, avatarUrl]
    );

    const renderable = useMemo(
        () => !avatar || typeof avatar === "string"
            ? avatar || "/waya-v3.webp"
            : URL.createObjectURL(new Blob([avatar])),
        [avatar]
    );

    return (<>
        <Modal<ApiV1GuildsModulesNotificationStylePatchResponse>
            title="Edit Notification Style"
            isOpen={isOpen}
            onClose={() => {
                onClose();
                setError(null);
            }}
            onSubmit={() => {
                const valid = isValidUsername(name);
                if (!name || !valid) return new Error("Invalid name");

                const formData = new FormData();
                formData.append("json_payload", JSON.stringify({ username: name }));
                if (avatar && typeof avatar !== "string") formData.append("file[0]", new Blob([avatar]));

                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications/${id}/style`, {
                    method: "PATCH",
                    credentials: "include",
                    body: formData
                });
            }}
            onSuccess={(style) => {
                onEdit(style);
                setError(null);
            }}
            isDisabled={!name || Boolean(error)}
        >
            <ControlledInput
                name="Username"
                placeholder="DarkViperAU"
                value={name}
                setValue={setName}
                max={32}
            />

            <input
                accept={ALLOWED_FILE_TYPES.join()}
                className="hidden"
                onChange={(e) => {
                    setAvatar(null);

                    const file = e.target.files?.[0];
                    if (!file) return;

                    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
                        setError(`File type must be one of ${ALLOWED_FILE_TYPES.join(", ")}`);
                        return;
                    }

                    if (file.size > MAX_FILE_SIZE) {
                        setError(`File size must be less than ${MAX_FILE_SIZE / 1_024 / 1_024}MiB`);
                        return;
                    }

                    file.arrayBuffer().then((buffer) => {
                        setAvatar(buffer);
                    });
                }}
                ref={avatarRef}
                type="file"
            />

            <div className="flex">
                <Button onClick={() => avatarRef.current?.click()}>
                    <HiOutlineUpload />
                    Upload Avatar
                </Button>
                {avatar && (
                    <Button
                        className="text-red-400"
                        variant="link"
                        onClick={() => setAvatar(null)}
                    >
                        <HiX />
                        Remove Avatar
                    </Button>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            <Section tight title="Preview">
                <div className="bg-discord-gray px-3 py-2 mt-1 rounded-lg w-full">
                    <DiscordMessage
                        mode="DARK"
                        user={{
                            username: name || "Wamellow",
                            avatar: renderable,
                            bot: true
                        }}
                    >
                        Woooooooo!
                    </DiscordMessage>
                </div>
            </Section>

        </Modal>
    </>);
}

function DeleteStyleButton({
    id,
    guildId,
    onDelete
}: {
    id: string;
    guildId: string;
    onDelete: () => void;
}) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const del = useCallback(
        async () => {
            setState(State.Loading);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications/${id}/style`, {
                method: "DELETE",
                credentials: "include"
            });

            if (response.ok) {
                onDelete();
                setState(State.Success);
                return;
            }

            setState(State.Idle);

            const res = await response.json() as ApiError | null;
            if (res && "message" in res) {
                setError(res.message);
                return;
            }

            setError("An unknown error occurred");
        },
        [guildId, id, onDelete]
    );

    return (<>
        <Button
            className="text-red-400"
            variant="link"
            onClick={del}
            icon={<HiX />}
            loading={state === State.Loading}
        >
            Delete
        </Button>
        {error && <p className="text-red-400">{error}</p>}
    </>);
}