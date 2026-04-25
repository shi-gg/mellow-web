import { getUser } from "@/lib/discord/user";

export const revalidate = 691_200; // 8 days

export async function GET() {
    const user = await getUser("821472922140803112");

    const avatar = await fetch(user?.avatarUrl
        ? user.avatarUrl + "?size=256"
        : "https://cdn.discordapp.com/embed/avatars/5.png"
    )
        .then((r) => r.arrayBuffer());

    return new Response(
        avatar,
        {
            headers: {
                "Cache-Control": "public, s-maxage=691200, immutable",
                "Content-Type": "image/webp"
            }
        }
    );
}