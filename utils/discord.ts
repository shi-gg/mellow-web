const DISCORD_BOT_USER_AGENT = "Discordbot";

export function isDiscord(header: string | null | undefined | Headers) {
    if (!header) return false;

    if (header && typeof header === "object" && "get" in header) {
        const agent = header.get("user-agent");
        if (!agent) return false;

        return agent.includes(DISCORD_BOT_USER_AGENT);
    }

    return header.includes(DISCORD_BOT_USER_AGENT);
}