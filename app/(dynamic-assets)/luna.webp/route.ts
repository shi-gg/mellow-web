import { getUser } from "@/lib/discord/user";

export const revalidate = 691_200; // 8 days

export async function GET() {
    const user = await getUser("821472922140803112");

    const res = await fetch(user?.avatarUrl
        ? user.avatarUrl + "?size=256"
        : "https://cdn.discordapp.com/embed/avatars/5.png"
    );
    const avatar = await res.arrayBuffer();
    const contentType = res.headers.get("Content-Type") ?? "application/octet-stream";

    return new Response(
        avatar,
        {
            headers: {
                "Cache-Control": "public, s-maxage=691200, immutable",
                "Content-Type": contentType
            }
        }
    );
}
