"use client";

import { guildStore } from "@/common/guilds";
import Fetch from "@/components/button-fetch";
import { CreateSplash } from "@/components/dashboard/lists/create-splash";
import { useList } from "@/components/dashboard/lists/hook";
import { Navigation } from "@/components/dashboard/lists/navigation";
import { ItemSelector } from "@/components/dashboard/lists/selector";
import MessageCreatorEmbed from "@/components/embed-creator";
import MultiSelectMenu from "@/components/inputs/multi-select-menu";
import SelectMenu from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import TextInput from "@/components/inputs/text-input";
import { ScreenMessage } from "@/components/screen-message";
import { AvatarBadge } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cacheOptions } from "@/lib/api";
import { type ApiV1GuildsModulesNotificationsGetResponse, BlueskyNotificationFlags, GuildFlags, NotificationFlags, NotificationType, YoutubeNotificationFlags } from "@/typings";
import { BitfieldManager, bitfieldToArray, transformer } from "@/utils/bitfields";
import { createSelectableItems } from "@/utils/create-selectable-items";
import { getCanonicalUrl } from "@/utils/urls";
import { LoaderCircleIcon } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { type ReactNode, useMemo } from "react";
import { HiChat, HiViewGridAdd } from "react-icons/hi";
import { useQuery } from "react-query";

import { hasBlueskyPost } from "./api";
import { DeleteNotification } from "./delete.component";
import { CreateNotificationSelect, Icon, Style } from "./select.component";
import { NotificationStyle } from "./style.component";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const premium = ((guild?.flags || 0) & GuildFlags.Premium) === GuildFlags.Premium;

    const url = `/guilds/${params.guildId}/modules/notifications` as const;
    const {
        item,
        items,
        setItemId,
        editItem,
        editObj,
        addItem,
        removeItem,
        isLoading,
        error
    } = useList<ApiV1GuildsModulesNotificationsGetResponse>({ url });

    const platformFlags = getFlags(item?.type || 0);
    const flags = useMemo(() => new BitfieldManager(item?.flags || 0), [item?.flags]);

    if (error) {
        return (
            <ScreenMessage
                top="20vh"
                description={error}
                href={`/dashboard/${guild?.id}`}
                button="Go back to overview"
                icon={<HiViewGridAdd />}
            />
        );
    }

    if (isLoading || !items) return <></>;

    if (!item) {
        return (
            <ItemSelector<ApiV1GuildsModulesNotificationsGetResponse>
                items={items}

                set={setItemId}
                sort={(a, b) => a.creator.username.localeCompare(b.creator.username)}
                name={(item) => item.creator.username}

                docs="/notifications"

                createButton={(options) => (
                    <CreateNotificationSelect
                        style={options.style}
                        add={addItem}
                        set={setItemId}
                    />
                )}

                deleteButton={(options) => (
                    <DeleteNotification
                        id={options.id}
                        name={options.name}
                        remove={removeItem}
                    />
                )}

                item={(item) => {
                    const channel = guild?.channels?.find((channel) => channel.id === item.channelId);

                    return (<>
                        <AvatarBadge
                            className="aspect-square bg-[#1c1b1f]"
                            content={<Icon type={item.type} className="size-4 mt-0.5" />}
                        >
                            {item.creator.avatarUrl
                                ? <Image
                                    alt={`${item.creator.username}'s avatar`}
                                    className="rounded-full"
                                    src={item.creator.avatarUrl}
                                    width={46}
                                    height={46}
                                />
                                : <div className="size-[46px] flex items-center justify-center bg-wamellow rounded-full select-none font-medium text-lg text-neutral-200">
                                    {item.creator.username.slice(0, 2)}
                                </div>
                            }
                        </AvatarBadge>

                        <div className="flex flex-col items-start">
                            <span className="flex gap-2 text-neutral-100 text-lg font-medium -mb-[0.5]">
                                {item.creator.username}
                            </span>

                            <div className="bg-blurple/50 text-neutral-100 px-1 rounded-md">
                                #{channel?.name || "unknown"}
                            </div>
                        </div>
                    </>);
                }}
            >
                <CreateSplash
                    name="notifications"
                    description="Notify your community when new videos are released."
                >
                    <CreateNotificationSelect
                        style={Style.Big}
                        add={addItem}
                        set={setItemId}
                    />
                </CreateSplash>
            </ItemSelector>
        );
    }

    return (<>
        <Navigation
            href="/notifications"
            docs="/notifications"

            avatar={item.creator.avatarUrl
                ? <Image
                    alt={`${item.creator.username}'s avatar`}
                    className="rounded-full"
                    src={item.creator.avatarUrl}
                    width={24}
                    height={24}
                />
                : <div className="size-6 flex items-center justify-center bg-wamellow rounded-full select-none font-medium text-sm text-neutral-200">
                    {item.creator.username.slice(0, 2)}
                </div>
            }
            name={item.creator.username}
            icon={<Icon type={item.type} className="text-white size-3" />}
        />

        <div className="flex md:gap-4 gap-2">
            <SelectMenu
                name="Channel"
                url={url + "/" + item.id}
                dataName="channelId"
                items={createSelectableItems(guild?.channels, ["ViewChannel", "SendMessages", "EmbedLinks", item.username ? "ManageWebhooks" : null, item.roleId ? "MentionEveryone" : null])}
                description="Select a channel where notifications should be send into."
                defaultState={item.channelId}
                onSave={(o) => editItem("channelId", o as string)}
            />

            <TestButton
                type={item.type}
                creatorId={item.creatorId}
            >
                <Fetch
                    className="w-1/3 md:w-1/6 relative top-8"
                    url={url + "/" + item.id + "/test"}
                    icon={<HiChat className="min-h-4 min-w-4" />}
                    label="Test Message"
                    method="POST"
                    size="lg"
                />
            </TestButton>
        </div>

        <div className="flex md:gap-4 gap-2">
            <SelectMenu
                className="md:w-1/2 w-full"
                name="Ping role"
                url={url + "/" + item.id}
                dataName="roleId"
                items={[
                    { name: "@everyone (everyone in server)", value: "everyone" },
                    { name: "@here (everyone online)", value: "here" },
                    ...createSelectableItems(guild?.roles)
                ]}
                description="Select a role which should get pinged on uploads."
                defaultState={item.roleId}
                onSave={(o) => editItem("roleId", o as string)}
                showClear
            />

            {platformFlags
                ? <MultiSelectMenu
                    className="md:w-1/2 w-full"
                    name="Filter"
                    url={url + "/" + item.id}
                    dataName="flags"
                    items={bitfieldToArray(platformFlags)}
                    description={item.type === NotificationType.Bluesky
                        ? "Select the types of posts to send in addition to regular posts."
                        : "Select the types of content to send."
                    }
                    defaultState={flags.toArray()}
                    onSave={(o) => {
                        const flags = o.map((flag) => Number(flag));
                        editItem("flags", flags.reduce((a, b) => a | b, 0));
                    }}
                />
                : <TextInput
                    className="md:w-1/2 w-full"
                    name={flags.has(NotificationFlags.MustNotMatchRegex)
                        ? "Blacklist regex"
                        : "Whitelist regex"
                    }
                    url={url + "/" + item.id}
                    dataName="regex"
                    description={flags.has(NotificationFlags.MustNotMatchRegex)
                        ? "Posts that match the provided regex will be ignored."
                        : "Only posts that match the provided regex will be sent."
                    }
                    defaultState={item.regex || ""}
                    onSave={(value) => editItem("regex", value)}
                />
            }
        </div>

        {platformFlags && (
            <TextInput
                className="md:w-1/2 w-full"
                name={flags.has(NotificationFlags.MustNotMatchRegex)
                    ? "Blacklist regex"
                    : "Whitelist regex"
                }
                url={url + "/" + item.id}
                dataName="regex"
                description={flags.has(NotificationFlags.MustNotMatchRegex)
                    ? "Posts that match the provided regex will be ignored."
                    : "Only posts that match the provided regex will be sent."
                }
                defaultState={item.regex || ""}
                onSave={(value) => editItem("regex", value)}
            />
        )}

        <Switch
            className="mt-2"
            label="Inverted regex (blacklist)"
            endpoint={url + "/" + item.id}
            k="flags"
            defaultState={(item.flags & NotificationFlags.MustNotMatchRegex) !== 0}
            transform={(value) => value ? [NotificationFlags.MustNotMatchRegex] : []} // very fucked up
            onSave={(value) => editItem("flags", transformer(value, item.flags, NotificationFlags.MustNotMatchRegex))}
        />

        {item.type === NotificationType.Twitch && (
            <Switch
                className="mt-2"
                label="Delete after stream ends"
                endpoint={url + "/" + item.id}
                k="flags"
                defaultState={(item.flags & NotificationFlags.DeleteAfterStream) !== 0}
                transform={(value) => value ? [NotificationFlags.DeleteAfterStream] : []} // very fucked up
                onSave={(value) => editItem("flags", transformer(value, item.flags, NotificationFlags.DeleteAfterStream))}
            />
        )}

        <NotificationStyle
            item={item}
            premium={premium}
            onEdit={editObj}
        />

        <MessageCreatorEmbed
            key={item.id}
            name="Message"
            url={url + "/" + item.id}
            dataName="message"
            defaultMessage={item.message}
            user={premium && item.username
                ? {
                    username: item.username || "",
                    avatar: item.avatar ? `https://r2.wamellow.com/avatars/webhooks/${item.avatar}` : "/discord.webp",
                    bot: true
                }
                : undefined
            }
            onSave={(value) => editItem("message", { content: value.content ?? null, embed: value.embed })}
        />
    </>);
}

function TestButton(
    { type, creatorId, children }:
    { type: NotificationType; creatorId: string; children: ReactNode; }
) {

    const { data, isLoading } = useQuery(
        [type, creatorId],
        () => hasBlueskyPost(creatorId),
        {
            ...cacheOptions,
            enabled: type === NotificationType.Bluesky
        }
    );

    if (type === NotificationType.Bluesky && (data === false || isLoading)) {
        return (
            <Button
                className="w-1/3 md:w-1/6 relative top-8 flex"
                onClick={() => {
                    window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(`I'm just trying out #wamellow for my discord server -> ${getCanonicalUrl("bluesky")}`)}`);
                }}
                size="lg"
                variant="flat"
                disabled={isLoading}
            >
                {isLoading
                    ? <LoaderCircleIcon className="animate-spin" />
                    : <HiChat className="min-h-4 min-w-4" />
                }

                Test Message
            </Button>
        );
    }

    if (type === NotificationType.Reddit) {
        return (
            <Button
                className="w-1/3 md:w-1/6 relative top-8 flex"
                onClick={() => {
                    window.open(`https://reddit.com/r/${creatorId}/submit?title=${encodeURIComponent("Testing Wamellow's Reddit to Discord Notifications")}&url=${encodeURIComponent(getCanonicalUrl("docs", "notifications"))}`);
                }}
                size="lg"
                variant="flat"
            >
                <HiChat className="min-h-4 min-w-4" />
                Test Message
            </Button>
        );
    }

    return children;
}

function getFlags(type: NotificationType) {
    switch (type) {
        case NotificationType.Bluesky: return BlueskyNotificationFlags;
        case NotificationType.YouTube: return YoutubeNotificationFlags;
        default: return null;
    }
}