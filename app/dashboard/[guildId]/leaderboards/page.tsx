"use client";

import { type Guild, guildStore } from "@/common/guilds";
import { InputImageUrl } from "@/components/inputs/image-url-input";
import { InputMultiSelect } from "@/components/inputs/multi-select-menu";
import { InputSwitch } from "@/components/inputs/switch";
import { ScreenMessage } from "@/components/screen-message";
import { Section, SubSection } from "@/components/section";
import { useApi } from "@/lib/api/hook";
import { type ApiV1GuildsModulesLeaderboardGetResponse, GuildFlags } from "@/typings";
import { transformer } from "@/utils/bitfields";
import { createSelectableItems } from "@/utils/create-selectable-items";
import { ChannelType } from "discord-api-types/v10";
import { useParams } from "next/navigation";
import { HiChartBar, HiViewGridAdd } from "react-icons/hi";

import Permissions from "./permissions.component";
import ResetLeaderboard from "./reset.component";
import UpdatingLeaderboardCard from "./updating.component";
import DiscordWidget from "./widget.component";
import { OverviewLink } from "../../../../components/overview-link";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const url = `/guilds/${params.guildId}/modules/leaderboard` as const;
    const { data, isLoading, error } = useApi<ApiV1GuildsModulesLeaderboardGetResponse>(url);

    if (isLoading) return <></>;

    if (!data || error) {
        return (
            <ScreenMessage
                top="0rem"
                description={error}
                href={`/dashboard/${guild?.id}`}
                button="Go back to overview"
                icon={<HiViewGridAdd />}
            />
        );
    }

    return (<>
        <div className="flex flex-col-reverse md:flex-row gap-6">
            <div className="w-full">
                <OverviewLink
                    title="View Leaderboard"
                    message="Easily access and view the top chatters, voice timers, and inviters from this server in the web."
                    url={`/leaderboard/${params.guildId}`}
                    icon={<HiChartBar />}
                />

                <InputImageUrl
                    label="Enabled"
                    url={url}
                    ratio="aspect-4/1"
                    dataName="banner"
                    description="Enter a url which should be the banner of the leaderboard web page. The recommended resolution is 906x256px."
                    defaultState={data.bannerUrl || ""}
                />
            </div>

            <Permissions
                className="w-full md:w-1/3 lg:w-1/4 shrink-0"
                guild={guild}
            />
        </div>

        <Section
            title="Roles"
        >
            Select roles which should be assigned to the top members. (left to right - 1st to 3rd place)
        </Section>

        <div className="lg:flex gap-3 mt-5">
            <div className="lg:w-1/2">
                <InputMultiSelect
                    label="Top messager roles"
                    url={url}
                    dataName="roles.messages"
                    items={createSelectableItems(guild?.roles)}
                    description="Select roles which should be assigned to the top message members."
                    defaultState={data.roles?.messages || []}
                    max={3}
                />
            </div>
            <div className="lg:w-1/2">
                <InputMultiSelect
                    label="Blacklisted roles"
                    url={url}
                    dataName="roles.voiceminutes"
                    items={createSelectableItems(guild?.roles)}
                    description="Select roles which should be assigned to the top voice members."
                    defaultState={data.roles?.voiceminutes || []}
                    max={3}
                />
            </div>
        </div>

        <div className="lg:w-1/2">
            <InputMultiSelect
                label="Blacklisted channels"
                url={url}
                dataName="blacklistChannelIds"
                items={createSelectableItems(guild?.channels, [], [ChannelType.GuildCategory, ChannelType.GuildText, ChannelType.GuildAnnouncement, ChannelType.GuildVoice])}
                description="Select channels which should not be counted."
                defaultState={data.blacklistChannelIds || []}
                max={500}
            />
        </div>

        <Section
            title="Updating"
        >
            These leaderboards will be sent in a channel and update roughly every 20 minutes.
        </Section>

        <div className="w-full grid gap-4 md:flex md:gap-0 md:items-center my-10">
            <UpdatingLeaderboardCard guild={guild as Guild} lb={data.updating.find((lb) => lb.type === "messages")} type="messages" />
            <UpdatingLeaderboardCard guild={guild as Guild} lb={data.updating.find((lb) => lb.type === "voiceminutes")} type="voiceminutes" />
            <UpdatingLeaderboardCard guild={guild as Guild} lb={data.updating.find((lb) => lb.type === "invites")} type="invites" />
        </div>

        <Section
            title="Privacy"
        >
            Manage the privacy of the leaderboard.
        </Section>

        <InputSwitch
            label="Hide leaderboard website"
            description="Disable the public website for the leaderboard."
            endpoint={`/guilds/${params.guildId}`}
            k="flags"
            defaultState={(guild!.flags & GuildFlags.PrivateLeaderboard) !== 0}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.PrivateLeaderboard)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.PrivateLeaderboard) })}
        />

        <DiscordWidget guild={guild as Guild} />

        <SubSection
            title="Removal"
            description="Reset the leaderboard to start fresh. This action cannot be undone"
        >
            <ResetLeaderboard guild={guild as Guild} />
        </SubSection>
    </>);
}