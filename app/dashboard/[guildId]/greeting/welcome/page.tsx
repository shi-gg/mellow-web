"use client";
import { guildStore } from "@/common/guilds";
import { userStore } from "@/common/user";
import Fetch from "@/components/button-fetch";
import MessageCreatorEmbed from "@/components/embed-creator";
import ImageUrlInput from "@/components/inputs/image-url-input";
import MultiSelectMenu from "@/components/inputs/multi-select-menu";
import NumberInput from "@/components/inputs/number-input";
import SelectMenu from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import Notice from "@/components/notice";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/api/hook";
import { type ApiV1GuildsModulesWelcomeGetResponse, GuildFlags } from "@/typings";
import { transformer } from "@/utils/bitfields";
import { cn } from "@/utils/cn";
import { createSelectableEmojiItems, createSelectableItems } from "@/utils/create-selectable-items";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HiArrowLeft, HiChat, HiExternalLink } from "react-icons/hi";

export default function Home() {
    const guild = guildStore((g) => g);
    const user = userStore((s) => s);

    const params = useParams();
    const { data, isLoading, error, edit } = useApi<ApiV1GuildsModulesWelcomeGetResponse>(`/guilds/${params.guildId}/modules/welcome`);

    const enabled = (guild!.flags & GuildFlags.WelcomeEnabled) !== 0;

    if (isLoading) return <></>;

    if (!data || error) return (
        <div>
            <Head guildId={params.guildId as string} />
            {error && <Notice message={error} />}
        </div>
    );

    return (<>
        <Head guildId={params.guildId as string} />

        <Switch
            label="Enable Welcome"
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={enabled}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.WelcomeEnabled)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.WelcomeEnabled) })}
        />

        <Switch
            label="Restore roles and nickname on rejoin"
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={(guild!.flags & GuildFlags.WelcomeRestore) !== 0}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.WelcomeRestore)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.WelcomeRestore) })}
        />

        <Switch
            label="Delete welcome message after leave"
            description="This only takes affect if the user joined less than 24h ago."
            endpoint={`/guilds/${guild?.id}/modules/welcome`}
            k="deleteAfterLeave"
            defaultState={data.deleteAfterLeave || false}
            disabled={!enabled}
            onSave={(s) => edit("deleteAfterLeave", s)}
        />

        <NumberInput
            label="After how many seconds the message should be deleted"
            description="Set to 0 to disable."
            url={`/guilds/${guild?.id}/modules/welcome`}
            dataName="deleteAfter"
            defaultState={data.deleteAfter ?? 0}
            disabled={!enabled}
            onSave={(n) => edit("deleteAfter", n)}
        />

        <div className="flex md:gap-4 gap-2">
            <SelectMenu
                className="w-2/3 md:w-5/6"
                name="Channel"
                url={`/guilds/${guild?.id}/modules/welcome`}
                dataName="channelId"
                items={createSelectableItems(guild?.channels)}
                description="Select the channel where the welcome message should be send into."
                defaultState={data.channelId}
                disabled={!enabled}
                showClear
                onSave={(o) => edit("channelId", o as string)}
            />

            <Fetch
                className="w-1/3 md:w-1/6 relative top-8"
                url={`/guilds/${params.guildId}/modules/welcome/test`}
                icon={<HiChat className="min-h-4 min-w-4" />}
                label="Test Message"
                method="POST"
                size="lg"
            />
        </div>

        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="Roles"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="roleIds"
                    items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                    description="Select roles which members should get."
                    defaultState={data.roleIds}
                    max={5}
                    disabled={!enabled}
                    onSave={(o) => edit("roleIds", o)}
                />
            </div>

            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="Pings"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="pingIds"
                    items={createSelectableItems(guild?.channels, ["ViewChannel", "SendMessages"])}
                    description="Select in what channels user should get ghostpinged."
                    defaultState={data.pingIds}
                    max={5}
                    disabled={!enabled}
                    onSave={(o) => edit("pingIds", o)}
                />
            </div>
        </div>

        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="First user message reactions"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="reactions.firstMessageEmojis"
                    items={createSelectableEmojiItems(guild?.emojis)}
                    description="Select emotes which will be reacted with on members first message."
                    defaultState={data.reactions?.firstMessageEmojis}
                    max={2}
                    disabled={!enabled}
                    onSave={(o) => {
                        edit("reactions", {
                            ...data.reactions,
                            firstMessageEmojis: o
                        });
                    }}
                />
            </div>

            <div className="lg:w-1/2">
                <MultiSelectMenu
                    name="Welcome message reactions"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="reactions.welcomeMessageEmojis"
                    items={createSelectableEmojiItems(guild?.emojis)}
                    description="Select emotes which will be reacted with on welcome messages."
                    defaultState={data.reactions?.welcomeMessageEmojis}
                    max={2}
                    disabled={!enabled}
                    onSave={(o) => {
                        edit("reactions", {
                            ...data.reactions,
                            welcomeMessageEmojis: o
                        });
                    }}
                />
            </div>
        </div>

        <MessageCreatorEmbed
            name="Message"
            url={`/guilds/${guild?.id}/modules/welcome`}
            dataName="message"
            defaultMessage={data.message}
            messageAttachmentComponent={(guild!.flags & GuildFlags.WelcomeCard) !== 0 && (
                <Image
                    src={`https://images-v2.wamellow.com/api/greet?type=join&username=${encodeURIComponent(user!.username)}&member_count=${guild!.memberCount}&avatar_url=${encodeURIComponent(`https://cdn.discordapp.com/avatars/${user!.id}/${user!.avatar!}.png`)}${data.card.background ? `&background_url=${encodeURIComponent(data.card.background)}` : ""}`}
                    width={1_024 / 2}
                    height={(256 + 16) / 2}
                    loading="lazy"
                    alt=""
                />
            )}
            showMessageAttachmentComponentInEmbed={(guild!.flags & GuildFlags.WelcomeCardInEmbed) !== 0}
            disabled={!enabled}
            onSave={(message) => edit("message", message)}
        >

            <div className={cn("mt-2 mb-4 border-2 dark:border-wamellow border-wamellow-100 rounded-xl p-6", (guild!.flags & GuildFlags.WelcomeCard) === 0 && "pb-0")}>
                <Switch
                    label="Show image card"
                    endpoint={`/guilds/${guild?.id}`}
                    k="flags"
                    defaultState={(guild!.flags & GuildFlags.WelcomeCard) !== 0}
                    disabled={!enabled}
                    transform={(value) => transformer(value, guild!.flags, GuildFlags.WelcomeCard)}
                    onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.WelcomeCard) })}
                />

                {(guild!.flags & GuildFlags.WelcomeCard) !== 0 && (<>
                    <Switch
                        label="Set image inside embed"
                        endpoint={`/guilds/${guild?.id}`}
                        k="flags"
                        defaultState={(guild!.flags & GuildFlags.WelcomeCardInEmbed) !== 0}
                        disabled={!enabled || (guild!.flags & GuildFlags.WelcomeCard) === 0}
                        transform={(value) => transformer(value, guild!.flags, GuildFlags.WelcomeCardInEmbed)}
                        onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.WelcomeCardInEmbed) })}
                    />

                    <ImageUrlInput
                        name="Card Background"
                        url={`/guilds/${guild?.id}/modules/welcome`}
                        ratio="aspect-4/1"
                        dataName="card.background"
                        description="Enter a url which should be the background for the image card. The recommended resolution is 906x256px."
                        defaultState={data.card.background || ""}
                        disabled={!enabled || (guild!.flags & GuildFlags.WelcomeCard) === 0}
                        onSave={(s) => {
                            edit("card", {
                                ...data.card,
                                background: s
                            });
                        }}
                    />
                </>)}
            </div>

        </MessageCreatorEmbed>

        <MessageCreatorEmbed
            name="Direct Message"
            url={`/guilds/${guild?.id}/modules/welcome`}
            dataName="dm.message"
            defaultMessage={data.dm?.message}
            isCollapseable={true}
            disabled={!enabled}
            onSave={(message) => {
                edit("dm", {
                    ...data.dm,
                    message
                });
            }}
        >

            <div className="m-2">
                <Switch
                    label="Enable DM"
                    endpoint={`/guilds/${guild?.id}`}
                    k="flags"
                    defaultState={(guild!.flags & GuildFlags.WelcomeDirectMessage) !== 0}
                    disabled={!enabled}
                    transform={(value) => transformer(value, guild!.flags, GuildFlags.WelcomeDirectMessage)}
                    onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.WelcomeDirectMessage) })}
                />
            </div>

        </MessageCreatorEmbed>

        <Section
            className="mb-6"
            title="Click to say hi!"
        >
            Bring Discord&apos;s &quot;Wave to say hi!&quot; feature on customized messages, just with a random greet!
        </Section>

        <Switch
            label="Enable button"
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={(guild!.flags & GuildFlags.WelcomeButton) !== 0}
            disabled={!enabled}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.WelcomeButton)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.WelcomeButton) })}
        />

        <Switch
            label="Ping new member"
            description="Whenever the mention in the greet message should ping or not."
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={(guild!.flags & GuildFlags.WelcomeButtonPing) !== 0}
            disabled={!enabled}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.WelcomeButtonPing)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.WelcomeButtonPing) })}
        />

        <div className="lg:flex gap-3 pt-3">
            <div className="lg:w-1/2">
                <SelectMenu
                    name="Button color"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="button.style"
                    items={
                        [
                            ["292b34", "Grey", 2],
                            ["5865f2", "Blurple", 1],
                            ["248046", "Green", 3],
                            ["da373c", "Red", 4]
                        ]
                            .map(([color, name, id]) => ({
                                icon: <div className="rounded-md h-6 w-6" style={{ backgroundColor: `#${color}` }} />,
                                name: name as string,
                                value: id
                            }))
                    }
                    description="Select the color of the button."
                    defaultState={data.button?.style || 1}
                    disabled={!enabled || (guild!.flags & GuildFlags.WelcomeButtonPing) === 0}
                    onSave={(o) => {
                        edit("button", {
                            ...data.button,
                            style: o as 1
                        });
                    }}
                />
            </div>
            <div className="lg:w-1/2">
                <SelectMenu
                    name="Button emoji"
                    url={`/guilds/${guild?.id}/modules/welcome`}
                    dataName="button.emoji"
                    items={createSelectableEmojiItems(guild?.emojis)}
                    description="Select an emoji which will be used in the button."
                    defaultState={data.button?.emoji}
                    disabled={!enabled || (guild!.flags & GuildFlags.WelcomeButtonPing) === 0}
                    onSave={(o) => {
                        edit("button", {
                            ...data.button,
                            emoji: o as string
                        });
                    }}
                />
            </div>
        </div>

        <div className="h-[138px]" />
    </>);
}

function Head({ guildId }: { guildId: string; }) {
    return (
        <div className="flex justify-between relative bottom-2 mb-3">
            <Button
                asChild
                size="sm"
            >
                <Link href={`/dashboard/${guildId}/greeting`}>
                    <HiArrowLeft />
                    Back
                </Link>
            </Button>
            <Button
                asChild
                size="sm"
            >
                <Link
                    href="/docs/greetings"
                    target="_blank"
                >
                    <HiExternalLink />
                    Read docs & view placeholders
                </Link>
            </Button>
        </div>
    );
}