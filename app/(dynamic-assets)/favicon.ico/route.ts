import { getUser } from "@/lib/discord/user";
import sharp from "sharp";

export const revalidate = 691_200; // 8 days

export async function GET() {
    const user = await getUser(process.env.NEXT_PUBLIC_CLIENT_ID as string);

    const avatar = await fetch(user?.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=64`
        : "https://cdn.discordapp.com/embed/avatars/5.png"
    )
        .then((r) => r.arrayBuffer());

    const { data, info } = await sharp(Buffer.from(avatar))
        .resize(64, 64)
        .toBuffer({ resolveWithObject: true });

    const svgCircle = `
      <svg width="${info.width}" height="${info.height}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${info.width / 2}" cy="${info.height / 2}" r="${info.width / 2}" fill="white"/>
      </svg>
    `;

    const icon = await sharp(data)
        .composite([{
            input: Buffer.from(svgCircle),
            blend: "dest-in"
        }])
        .toFormat("png")
        .toBuffer();

    // does anything even care if it's an actual x-icon lol
    return new Response(
        new Uint8Array(icon),
        {
            headers: {
                "Content-Type": "image/png",
                "Cache-Control": "public, immutable, no-transform, max-age=691200"
            }
        }
    );
}