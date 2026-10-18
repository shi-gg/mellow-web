"use client";
import { guildStore } from "@/common/guilds";
import DiscordMessage from "@/components/discord/message";
import { ControlledInput } from "@/components/inputs/controlled-input";
import { InputSelect } from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import { Section } from "@/components/section";
import { UserAvatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { type ApiError, type ApiV1GuildsGetResponse, type ApiV1GuildsStylePatchResponse, GuildFlags } from "@/typings";
import { State } from "@/utils/captcha";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { HiOutlineUpload, HiPencil, HiX } from "react-icons/hi";

const FILTERED_CHARS_REGEX = /@|#|:|```|discord|clyde/i;
const STYLE_NAME_REGEX = /([a-z])(?=[A-Z])/g;

const ALLOWED_FILE_TYPES = ["image/jpg", "image/jpeg", "image/png", "image/webp", "image/gif", "image/apng"];
const MAX_FILE_SIZE = 8 * 1_024 * 1_024;

export enum DisplayNameFont {
    GgSans = 11,
    Tempo = 12,
    Sakura = 3,
    Jellybean = 4,
    Modern = 6,
    Medieval = 7,
    EightBit = 8,
    Vampyre = 10,
    MonkeyBars = 13,
    MainFrame = 14,
    HeadBang = 15,
    Journal = 16
}

export enum DisplayNameEffect {
    Solid = 1,
    Gradient = 2,
    Neon = 3,
    Toon = 4,
    Pop = 5,
    Gummy = 8,
    Prism = 7
}

export function BotStyle() {
    const guild = guildStore((g) => g!);
    const premium = ((guild?.flags || 0) & GuildFlags.Premium) === GuildFlags.Premium;

    const [open, setOpen] = useState(false);

    const avatarUrl = premium && guild.style.avatar ? `https://cdn.discordapp.com/guilds/${guild.id}/users/${process.env.NEXT_PUBLIC_CLIENT_ID}/avatars/${guild.style.avatar}?size=256` : "/waya-v3.webp";
    const bannerUrl = premium && guild.style.banner ? `https://cdn.discordapp.com/guilds/${guild.id}/users/${process.env.NEXT_PUBLIC_CLIENT_ID}/banners/${guild.style.banner}?size=1024` : null;

    return (<>
        <div className="w-full relative overflow-hidden rounded-xl border border-border group p-px mb-5">
            <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite_reverse] bg-[conic-gradient(from_90deg_at_0%_50%,#8b5cf6_50%,var(--wamellow-rgb)_100%)]" />

            <div className="backdrop-blur-3xl backdrop-brightness-25 rounded-[10px] p-5 md:py-8 md:pl-10 flex flex-col md:flex-row gap-5 md:gap-0">
                <div className="flex gap-6 items-center">
                    <UserAvatar
                        alt={premium && guild.style.username ? guild.style.username : "Wamellow"}
                        className="size-24"
                        src={avatarUrl}
                    />

                    <div className="flex flex-col gap-2">
                        <span className="text-3xl font-medium text-primary-foreground">
                            {guild.style.username || "Wamellow"}
                        </span>
                        <div className="flex">
                            <Button onClick={() => setOpen(true)}>
                                <HiPencil />
                                Change Style
                            </Button>
                            {(guild.style.username || guild.style.avatar || guild.style.banner) && (
                                <DeleteStyleButton
                                    guildId={guild.id}
                                    onDelete={() => {
                                        guildStore.setState((g) => {
                                            if (!g) return g;
                                            return { ...g, style: { username: null, avatar: null, banner: null } };
                                        });
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <ExampleMessages />
            </div>
        </div>

        <ChangeStyleModal
            guildId={guild.id}

            username={guild.style.username}
            avatarUrl={avatarUrl}
            bannerUrl={bannerUrl}

            isOpen={open}
            onClose={() => setOpen(false)}
            onEdit={(style) => {
                guildStore.setState((g) => {
                    if (!g) return g;
                    return { ...g, style: { ...style } };
                });
            }}
        />
    </>);
}

function ExampleMessages() {
    return (
        <div className="w-full relative">
            <ExampleMessage className="top-1 md:-top-5 md:right-1 rotate-1 md:rotate-2 z-10" username="Kurzgesagt" avatarUrl="https://yt3.googleusercontent.com/ytc/AIdro_n1Ribd7LwdP_qKtqWL3ZDfIgv9M1d6g78VwpHGXVR2Ir4=s176-c-k-c0x00ffffff-no-rj-mo" />
            <ExampleMessage className="md:-bottom-5 right-0 md:-rotate-1" username="DarkViperAU" avatarUrl="https://yt3.googleusercontent.com/ytc/AIdro_lpNK9jpdw9D63LuUYt3SLbFpIQ5yD4DV0D5mwPrCp7cEw=s176-c-k-c0x00ffffff-no-rj-mo" />
        </div>
    );
}

function ExampleMessage({ className, username, avatarUrl }: { className?: string; username?: string; avatarUrl?: string; }) {
    return (
        <div className={cn("bg-discord-gray px-3 py-2 rounded-lg w-full md:max-w-sm relative md:absolute border border-wamellow shadow-lg", className)}>
            <DiscordMessage
                mode="DARK"
                commandUsed={{
                    name: "tts voice",
                    username: "@mwlica",
                    avatar: "/luna.webp",
                    bot: false
                }}
                user={{
                    username: username || "Wamellow",
                    avatar: avatarUrl || "/waya-v3.webp",
                    bot: true
                }}
            >
                Woooooooo!
            </DiscordMessage>
        </div>
    );
}

function isValidUsername(value: string | null): boolean {
    if (!value) return false;
    if (value.length < 2 || value.length > 32) return false;
    if (["everyone", "here"].includes(value.toLowerCase())) return false;
    if (FILTERED_CHARS_REGEX.test(value)) return false;
    return true;
}

interface Props {
    guildId: string;

    username: string | null;
    avatarUrl: string | null;
    bannerUrl: string | null;

    isOpen: boolean;
    onClose: () => void;
    onEdit: (opts: ApiV1GuildsGetResponse["style"]) => void;
}

export function ChangeStyleModal({
    guildId,

    username,
    avatarUrl,
    bannerUrl,

    isOpen,
    onClose,
    onEdit
}: Props) {
    const [name, setName] = useState(username);
    const [fontId, setFontId] = useState<DisplayNameFont>(DisplayNameFont.GgSans);
    const [effectId, setEffectId] = useState<DisplayNameEffect>(DisplayNameEffect.Solid);

    const [bio, setBio] = useState<string | null>(null);

    const [avatar, setAvatar] = useState<File | string | null>(avatarUrl);
    const [banner, setBanner] = useState<File | string | null>(bannerUrl);

    const [error, setError] = useState<string | null>(null);

    const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
    if (isOpen && !prevIsOpen) {
        setPrevIsOpen(true);
        setName(username);
        setAvatar(avatarUrl);
        setBanner(bannerUrl);
    } else if (!isOpen && prevIsOpen) {
        setPrevIsOpen(false);
    }

    const render = useCallback(
        (buf: File | string | null) => buf instanceof File
            ? URL.createObjectURL(buf)
            : buf,
        []
    );

    const renderableAvatar = useMemo(() => render(avatar), [avatar, render]);
    const renderableBanner = useMemo(() => render(banner), [banner, render]);

    return (<>
        <Modal<ApiV1GuildsStylePatchResponse>
            title="Edit Style"
            isOpen={isOpen}
            onClose={() => {
                onClose();
                setError(null);
            }}
            onSubmit={() => {
                const valid = isValidUsername(name);
                if (name && !valid) return new Error("Invalid name");

                const formData = new FormData();

                formData.append("json_payload", JSON.stringify({
                    username: name || null,
                    bio,
                    displayNameFontId: fontId,
                    displayNameEffectId: effectId
                }));

                if (avatar instanceof File) formData.append("file[0]", avatar, "avatar");
                if (banner instanceof File) formData.append("file[1]", banner, "banner");

                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/style`, {
                    method: "PATCH",
                    credentials: "include",
                    body: formData
                });
            }}
            onSuccess={(style) => {
                onEdit(style);
                setError(null);
            }}
            isDisabled={(!name && typeof avatar === "string" && typeof banner === "string") || Boolean(error)}
        >
            <ControlledInput
                label="Username"
                placeholder="Wamellow"
                value={name}
                setValue={setName}
                max={32}
            />

            <div className="flex gap-2">
                <InputSelect
                    label="Font"
                    items={
                        Object
                            .entries(DisplayNameFont)
                            .filter(([_, value]) => typeof value === "number")
                            .map(([key, value]) => ({
                                icon: (
                                    <Image
                                        alt={key}
                                        className="rounded-md h-6 w-9 relative"
                                        src={`https://media.wamellow.com/assets/docs/customization/font/${key.toLowerCase()}.webp`}
                                        width={146}
                                        height={96}
                                    />
                                ),
                                name: key.toString().replace(STYLE_NAME_REGEX, "$1 "),
                                value
                            }))}
                    onSave={(fontId) => setFontId(fontId as DisplayNameFont)}
                    defaultValue={fontId}
                />

                <InputSelect
                    label="Style"
                    items={
                        Object
                            .entries(DisplayNameEffect)
                            .filter(([_, value]) => typeof value === "number")
                            .map(([key, value]) => ({
                                icon: (
                                    <Image
                                        alt={key}
                                        className="rounded-md h-6 w-9 relative"
                                        src={`https://media.wamellow.com/assets/docs/customization/effect/${key.toLowerCase()}.webp`}
                                        width={146}
                                        height={96}
                                    />
                                ),
                                name: key.toString().replace(STYLE_NAME_REGEX, "$1 "),
                                value
                            }))}
                    onSave={(effectId) => setEffectId(effectId as DisplayNameEffect)}
                    defaultValue={effectId}
                />
            </div>

            <ControlledInput
                label="Bio"
                placeholder="gaming"
                value={bio}
                setValue={setBio}
                max={190}
                multiline
            />

            <div className="space-y-2">
                <FileUpload
                    name="Avatar"
                    hasFile={avatar instanceof File}
                    onUpload={setAvatar}
                    onRemove={() => setAvatar(avatarUrl)}
                />

                <FileUpload
                    name="Banner"
                    hasFile={banner instanceof File}
                    onUpload={setBanner}
                    onRemove={() => setBanner(bannerUrl)}
                />
            </div>

            <Section tight title="Preview">
                <div className="bg-discord-gray p-3 mt-1 rounded-lg w-full">
                    <DiscordMessage
                        mode="DARK"
                        commandUsed={{
                            name: "tts voice",
                            username: "@mwlica",
                            avatar: "/luna.webp",
                            bot: false
                        }}
                        user={{
                            username: name || "Wamellow",
                            avatar: renderableAvatar || "/waya-v3.webp",
                            bot: true
                        }}
                    >
                        Now talking...
                    </DiscordMessage>
                </div>

                {renderableBanner && (
                    <Image
                        alt="Guild Banner"
                        src={renderableBanner}
                        className="w-full h-auto aspect-17/6 object-cover rounded-lg mt-4"
                        width={680 * 2}
                        height={240 * 2}
                    />
                )}
            </Section>

        </Modal>
    </>);
}

function FileUpload({
    name,
    hasFile,
    onUpload,
    onRemove
}: {
    name?: string;
    hasFile: boolean;
    onUpload: (file: File) => void;
    onRemove: () => void;
}) {
    const ref = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<string | null>(null);

    return (<>
        <input
            accept={ALLOWED_FILE_TYPES.join()}
            className="hidden"
            onChange={(e) => {
                setError(null);

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

                onUpload(file);
            }}
            ref={ref}
            type="file"
        />

        <div className="flex">
            <Button onClick={() => ref.current?.click()}>
                <HiOutlineUpload />
                Upload {name}
            </Button>
            {hasFile && (
                <Button
                    className="text-red-400"
                    variant="link"
                    onClick={() => {
                        if (ref.current) ref.current.value = "";
                        onRemove();
                    }}
                >
                    <HiX />
                    Remove {name}
                </Button>
            )}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </>);
}

function DeleteStyleButton({
    guildId,
    onDelete
}: {
    guildId: string;
    onDelete: () => void;
}) {
    const [state, setState] = useState<State>(State.Idle);
    const [error, setError] = useState<string | null>(null);

    const del = useCallback(
        async () => {
            setState(State.Loading);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/style`, {
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
        [guildId, onDelete]
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