import type { ApiV1GuildsChannelsGetResponse, ApiV1GuildsEmojisGetResponse, ApiV1GuildsRolesGetResponse } from "@/typings";
import { ChannelType, PermissionFlagsBits } from "discord-api-types/v10";
import Image from "next/image";
import { HiAtSymbol, HiHashtag, HiMenuAlt2, HiNewspaper, HiVolumeUp } from "react-icons/hi";

type Item = ApiV1GuildsChannelsGetResponse | ApiV1GuildsRolesGetResponse;
type PermissionNames = keyof typeof PermissionFlagsBits | "RoleHirachy";

const zero = BigInt(0);

function parsePermissions(permissions: number, required: PermissionNames[]) {
    if (permissions === -1 && required.includes("RoleHirachy")) return ["Role is above Wamellow"];

    return required
        .filter((perm) => perm !== "RoleHirachy")
        .map((perm) => (BigInt(permissions) & PermissionFlagsBits[perm]) === zero ? perm : false)
        .filter(Boolean);
}

export function createSelectableItems<T extends Item>(
    items: T[] | undefined,
    requiredPermissions?: (PermissionNames | null)[],
    allowedTypes: ChannelType[] = [ChannelType.GuildText, ChannelType.GuildAnnouncement]
) {
    if (!items?.length) return [];

    if (requiredPermissions === undefined && "type" in items[0]) {
        requiredPermissions = ["ViewChannel", "SendMessages", "EmbedLinks"];
    }

    return items
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((item) => "type" in item ? allowedTypes.includes(item.type) : true)
        .map((item) => ({
            icon: getIconByType("type" in item ? item.type : -1),
            name: item.name,
            value: item.id,
            color: "color" in item ? item.color : undefined,
            error: "permissions" in item
                ? parsePermissions(item.permissions, requiredPermissions?.filter((perm) => perm !== null) || []).join(", ")
                : undefined
        }));
}

export function createSelectableEmojiItems(emojis: ApiV1GuildsEmojisGetResponse[] = []) {
    return [
        { icon: "👋", name: "Wave", value: "👋" },
        { icon: "☕", name: "Coffee", value: "☕" },
        ...emojis
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => ({
                icon: <Image
                    src={`https://cdn.discordapp.com/emojis/${c.id}.webp?size=64&quality=lossless`}
                    className="rounded-md h-6 w-6"
                    alt={c.name}
                    height={64}
                    width={64}
                />,
                name: c.name.replace(/-|_/g, " "),
                value: c.id
            }))
    ];
}

function getIconByType(type: ChannelType | -1) {
    switch (type) {
        case ChannelType.GuildVoice: return <HiVolumeUp />;
        case ChannelType.GuildCategory: return <HiMenuAlt2 />;
        case ChannelType.GuildAnnouncement: return <HiNewspaper />;
        case -1: return <HiAtSymbol />;
        default: return <HiHashtag />;
    }
}