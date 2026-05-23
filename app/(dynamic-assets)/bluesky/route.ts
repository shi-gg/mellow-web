import { isDiscord } from "@/utils/discord";
import { redirect } from "next/navigation";

export const revalidate = 691_200; // 8 days

export function GET(request: Request) {
    const agent = request.headers.get("user-agent");

    if (isDiscord(agent)) {
        redirect("/wamellow-bluesky-like.webp");
    }

    if (agent?.includes("Bluesky Card")) {
        redirect("https://bsky.app/profile/did:plc:jjtrsxiaw4amuujelxrxy7by/post/3lketwsywwc2r");
    }

    redirect("https://www.reddit.com/r/BlueskySocial/comments/1jbjmc4/like_bluesky_posts_inside_of_discord_with_wamellow/");
}