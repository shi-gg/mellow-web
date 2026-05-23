import { defaultCookieOptions } from "@/lib/cookies";
import { isDiscord } from "@/utils/discord";
import { getCanonicalUrl } from "@/utils/urls";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSession } from "./api";

const permissions = [
    PermissionFlagsBits.AddReactions, // greetings
    PermissionFlagsBits.AttachFiles, // /tts, leaderboards
    PermissionFlagsBits.BanMembers, // passport
    PermissionFlagsBits.Connect, // /tts
    PermissionFlagsBits.CreatePublicThreads, // nsfw moderation
    PermissionFlagsBits.EmbedLinks, // everything
    PermissionFlagsBits.KickMembers, // passport
    PermissionFlagsBits.ManageChannels, // nsfw stuff, /tts, invite tracking
    PermissionFlagsBits.ManageGuild, // invite tracking
    PermissionFlagsBits.ManageMessages, // nsfw moderation
    PermissionFlagsBits.ManageRoles, // greetings
    PermissionFlagsBits.ManageWebhooks, // greetings
    PermissionFlagsBits.MentionEveryone, // notifications
    PermissionFlagsBits.ModerateMembers, // passport
    PermissionFlagsBits.ReadMessageHistory, // leaderboards, text commands
    PermissionFlagsBits.SendMessages, // leaderboards, text commands, nsfw moderation, passport
    PermissionFlagsBits.SendMessagesInThreads, // text commands, nsfw moderation
    PermissionFlagsBits.Speak, // /tts
    PermissionFlagsBits.UseExternalEmojis, // everything
    PermissionFlagsBits.ViewChannel // leaderboards, text commands, nsfw moderation, passport, activity tracking
];

export async function GET(request: Request) {
    if (isDiscord(request.headers.get("user-agent"))) redirect("/login/open-graph");

    const { searchParams } = new URL(request.url);
    const jar = await cookies();

    const logout = searchParams.get("logout");

    if (logout) {
        jar.set(
            "session",
            "",
            {
                ...defaultCookieOptions,
                expires: new Date(0)
            }
        );

        redirect("/");
    }

    const guildId = searchParams.get("guild_id");
    const invite = Boolean(searchParams.get("invite"));
    const code = searchParams.get("code");

    if (!code) {
        const callback = searchParams.get("callback");
        const lastpage = jar.get("lastpage");

        const url = generateOauthUrl(invite, callback || lastpage?.value, guildId);
        redirect(url);
    }

    const res = await createSession(code);
    let redirectUrl = getRedirectUrl(searchParams);

    if (!res || "status" in res) {
        const data = { statusCode: 500, message: res?.message || "An error occurred" };
        console.log(data);

        redirectUrl += "?error=" + JSON.stringify(data);
        redirect(redirectUrl);
    }

    jar.set(
        "session",
        res.session,
        defaultCookieOptions
    );

    redirect(redirectUrl);
}

function generateOauthUrl(invite: boolean, redirectUrl: string | undefined, guildId: string | null) {
    const params = new URLSearchParams();

    params.append("client_id", process.env.NEXT_PUBLIC_CLIENT_ID as string);
    params.append("redirect_uri", getCanonicalUrl("login"));
    params.append("permissions", permissions.reduce((acc, cur) => acc + Number(cur), 0).toString());
    params.append("prompt", "none");
    params.append("response_type", "code");
    params.append("state", encodeURIComponent(redirectUrl || "/"));

    if (invite) params.append("scope", "identify guilds bot");
    else params.append("scope", "identify guilds email");

    if (guildId) params.append("guild_id", guildId);

    return "https://discord.com/oauth2/authorize?" + params.toString();
}

function getRedirectUrl(searchParams: URLSearchParams) {
    const redirectUrl = parseRedirectUrlFromState(searchParams.get("state"));
    const guildId = searchParams.get("guild_id");

    if (guildId) return `/dashboard/${guildId}${redirectUrl}`;
    return redirectUrl;
}

function parseRedirectUrlFromState(state: string | null) {
    if (!state) return "/";

    const path = decodeURIComponent(state);
    if (path.includes("://")) return "/";

    return path || "/";
}