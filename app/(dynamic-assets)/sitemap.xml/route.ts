import { client } from "@/lib/api";
import { source } from "@/lib/source";
import { getCanonicalUrl } from "@/utils/urls";

export const revalidate = 691_200; // 8 days

interface Sitemap {
    url: string;
    priority: number;
}

const sitemap = [
    {
        url: getCanonicalUrl(),
        priority: 1
    },
    {
        url: getCanonicalUrl("premium"),
        priority: 0.9
    },
    {
        url: getCanonicalUrl("status"),
        priority: 0.9
    },
    {
        url: getCanonicalUrl("text-to-speech"),
        priority: 0.9
    },
    {
        url: getCanonicalUrl("dashboard"),
        priority: 0.8
    },
    {
        url: getCanonicalUrl("profile"),
        priority: 0.8
    },
    {
        url: getCanonicalUrl("team"),
        priority: 0.7
    },
    {
        url: getCanonicalUrl("support"),
        priority: 0.7
    },
    {
        url: getCanonicalUrl("login"),
        priority: 0.5
    },
    {
        url: getCanonicalUrl("terms"),
        priority: 0.2
    },
    {
        url: getCanonicalUrl("terms", "payment"),
        priority: 0.2
    },
    {
        url: getCanonicalUrl("privacy"),
        priority: 0.2
    }
] satisfies Sitemap[];

export async function GET() {
    const res = await client.get<string[]>("/guilds");

    for (const page of source.getPages()) sitemap.push({ url: getCanonicalUrl("docs", ...page.slugs), priority: 0.6 });
    for (const guildId of res.data || []) sitemap.push({ url: getCanonicalUrl("leaderboard", guildId), priority: 0.5 });

    return new Response(`
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${sitemap.map((site) => `
            <url>
                <loc>${site.url}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>daily</changefreq>
                <priority>${site.priority}</priority>
            </url>
            `)}
        </urlset>`
        .replaceAll(",", ""), {
        headers: {
            "Content-Type": "text/xml"
        }
    });
}