import { ScreenMessage } from "@/components/screen-message";
import { getGuild } from "@/lib/api";
import { GuildFlags } from "@/typings";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getPagination, getTopMembers } from "./api";
import Member from "./member.component";
import Pagination from "./pagination.component";

export const revalidate = 3_600;

interface Props {
    params: Promise<{ guildId: string; }>;
    searchParams: Promise<{
        page: string;
        type: "messages" | "voiceminutes" | "invites";
    }>;
}

export default async function Home({ searchParams, params }: Props) {
    const search = await searchParams;
    const { guildId } = await params;

    const jar = await cookies();

    const type = search.type || "messages";
    const page = Number.parseInt(search.page || "1", 10);

    if (page !== 1 && !jar.get("session")) {
        redirect(`/login?callback=/leaderboard/${guildId}%3Ftype%3Dmessages%3Fpage=${page}`);
    }

    const [guild, members, pagination] = await Promise.all([
        getGuild(guildId),
        getTopMembers(guildId, { page, type }),
        getPagination(guildId)
    ]);

    let error = "";
    if (guild && "message" in guild) error = guild.message;
    if (members && "message" in members) error = members.message;
    if (pagination && "message" in pagination) error = pagination.message;

    if (error || !guild || !members || !pagination || "message" in pagination) {
        return (
            <ScreenMessage
                top="14rem"
                description={error}
            />
        );
    }

    if (!Array.isArray(members) || !members.length || ("flags" in guild && (guild.flags & GuildFlags.PrivateLeaderboard))) {
        return (
            <ScreenMessage
                top="14rem"
                title="No members to see here.."
                description="No members could be found on this page"
            />
        );
    }

    return (<>
        {members
            .sort((a, b) => (b.activity[type] ?? 0) - (a.activity[type] ?? 0))
            .map((member, i) => (
                <Member
                    key={`member-${member.id}-${type}`}
                    member={member}
                    index={i + (page * 20) - 19}
                    type={type}
                    pagination={pagination}
                    members={members}
                />
            ))
        }

        <Pagination
            key={type}
            searchParams={search}
            pages={pagination[type].pages}
        />
    </>);
}