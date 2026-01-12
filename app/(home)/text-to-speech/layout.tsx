import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";
import type { Metadata } from "next";

export const generateMetadata = (): Metadata => {
    const title = "Generate TikTok-Like Text-to-Speech";
    const description = "Use 97+ voices in 10+ languages to create TikTok-like text-to-speech for free online and in discord.";
    const url = getCanonicalUrl("text-to-speech");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: {
                url: `${getBaseUrl()}/waya-v3.webp`,
                type: "image/webp"
            }
        },
        twitter: {
            card: "summary",
            title,
            description,
            images: {
                url: `${getBaseUrl()}/waya-v3.webp`,
                alt: title
            }
        }
    };
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex w-full flex-col gap-8 py-8">
            <div className="space-y-3">
                <h1 className="text-4xl font-semibold text-white">Create TikTok-like speech</h1>
                <p className="max-w-3xl text-neutral-400">
                    Generate natural-sounding clips with your favorite voice. Pick a voice, drop in text,
                    clear the captcha, and replay recent generations anytime.
                </p>
            </div>

            {children}
        </div>
    );
}