import type { ReadonlyHeaders } from "next/dist/server/web/spec-extension/adapters/headers";

const DISCORD_BOT_USER_AGENT = "Discordbot/2.0;";

export function isDiscord(header: string | null | undefined | ReadonlyHeaders) {
    if (!header) return false;

    if (header && typeof header === "object" && "get" in header) {
        const agent = header.get("user-agent");
        if (!agent) return false;

        return agent.includes(DISCORD_BOT_USER_AGENT);
    }

    return header.includes(DISCORD_BOT_USER_AGENT);
}