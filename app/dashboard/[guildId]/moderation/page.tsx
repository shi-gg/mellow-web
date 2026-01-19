"use client";

import { guildStore } from "@/common/guilds";
import { InputMultiSelect } from "@/components/inputs/multi-select-menu";
import { InputSwitch } from "@/components/inputs/switch";
import { InputText } from "@/components/inputs/text-input";
import Notice from "@/components/notice";
import { useApi } from "@/lib/api/hook";
import { type ApiV1GuildsModulesAutomodGetResponse, AutomodType } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";
import { ChannelType } from "discord-api-types/v10";
import { useParams } from "next/navigation";

const AUTOMOD_TYPES = Object
    .values(AutomodType)
    .filter((type) => typeof type === "string");

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const url = `/guilds/${params.guildId}/modules/automod` as const;
    const { data, isLoading, error, edit } = useApi<ApiV1GuildsModulesAutomodGetResponse>(url);

    const enabled = data && !("message" in data) && (Object.values(data.status).some(Boolean) || data.keywordFilter.length);

    if (isLoading) return <></>;

    if (!data || error) return (
        <div>
            {error && <Notice message={error} />}
        </div>
    );

    return (<>
        {AUTOMOD_TYPES.map((type) => (
            <InputSwitch
                key={type}
                label={`Block ${type.replace(/_/g, " ").replace(/(^| +)\w/g, (c) => c.toUpperCase())}`}
                description={`Prevent ${type.replace(/_/, " ")} links from being sent.`}
                endpoint={`${url}/${type}`}
                k="enabled"
                defaultState={data.status[type] || false}
                onSave={(value) => {
                    data.status[type] = value;
                    edit("status", data.status);
                }}
            />
        ))}

        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <InputMultiSelect
                    label="Whitelist channels"
                    url={url}
                    dataName="whitelistChannelIds"
                    items={createSelectableItems(guild?.channels, [], [ChannelType.GuildCategory, ChannelType.GuildText, ChannelType.GuildAnnouncement])}
                    description="Select channels where messages should not be moderated in."
                    defaultState={data.whitelistChannelIds}
                    max={50}
                    disabled={!enabled}
                    onSave={(value) => {
                        edit("whitelistChannelIds", value);
                    }}
                />
            </div>
            <div className="lg:w-1/2">
                <InputMultiSelect
                    label="Whitelist roles"
                    url={url}
                    dataName="whitelistRoleIds"
                    items={createSelectableItems(guild?.roles)}
                    description="Select roles by who messages should not be moderated for."
                    defaultState={data.whitelistRoleIds}
                    max={20}
                    disabled={!enabled}
                    onSave={(value) => {
                        edit("whitelistRoleIds", value);
                    }}
                />
            </div>
        </div>

        <InputText
            label="Keyword filter"
            url={url}
            dataName="keywordFilter"
            description="Separate words or phrases with a comma (dog, cat, tiger) or new line. For each word, use * at the beginning, end, or both for partial matching."
            defaultState={data.keywordFilter.join(", ")}
            max={Infinity}
            onSave={(value) => {
                edit("keywordFilter", (value)?.split(/,|\n/).map((word) => word.trim()) || []);
            }}
        />
    </>);
}