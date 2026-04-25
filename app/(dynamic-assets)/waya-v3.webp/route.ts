import { getUser } from "@/lib/discord/user";

export const revalidate = 691_200; // 8 days

export async function GET() {
    const user = await getUser(process.env.NEXT_PUBLIC_CLIENT_ID as string);

    const res = await fetch(user?.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=256`
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
