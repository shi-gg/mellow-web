import { GlowingImage } from "@/components/glowing-image";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListTab } from "@/components/list";
import { getGuild } from "@/lib/api";
import paintPic from "@/public/paint.webp";
import { isDiscord } from "@/utils/discord";
import { intl } from "@/utils/numbers";
import { getCanonicalUrl } from "@/utils/urls";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { HiAnnotation, HiLink, HiUsers, HiVolumeUp } from "react-icons/hi";

import { getDesign, getPagination } from "./api";
import Side from "./side.component";

interface Props {
    params: Promise<{ guildId: string; }>;
    children: React.ReactNode;
}

export const revalidate = 3_600;

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { guildId } = await params;

    const guild = await getGuild(guildId);
    const name = guild && "name" in guild ? guild.name : "Unknown";

    const title = `${name}'s Leaderboard`;
    const description = `Discover the most active chatters, voice timers, and top inviters. ${name ? `Explore the community of the ${name} discord server right from your web browser.` : ""}`;
    const url = getCanonicalUrl("leaderboard", guildId);

    const date = new Date();
    const cacheQuery = `${date.getDate()}${date.getHours()}`;

    const images = {
        url: getCanonicalUrl("leaderboard", guildId, `open-graph.png?cachfeaa=${cacheQuery}`),
        alt: description,
        height: 630,
        width: 1_200
    };

    if (isDiscord(await headers())) {
        return {
            title,
            description: undefined,
            openGraph: {
                title,
                description: undefined,
                url,
                type: "article",
                images
            },
            twitter: {
                card: "summary_large_image",
                title,
                description: undefined,
                images
            }
        };
    }

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
            type: "profile",
            images
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images
        },
        robots: guild && "id" in guild ? "index, follow" : "noindex"
    };
};

export default async function RootLayout({ params, children }: Props) {
    const { guildId } = await params;

    const [guild, design, pagination] = await Promise.all([
        getGuild(guildId),
        getDesign(guildId),
        getPagination(guildId)
    ]);

    const guildExists = guild && "id" in guild;

    return (
        <div className="w-full">

            <div className="relative mb-14 w-full">
                <GlowingImage
                    alt=""
                    className="w-full object-cover"
                    src={design && "bannerUrl" in design && design.bannerUrl ? design.bannerUrl : paintPic.src}
                    width={3_840 / 2}
                    height={2_160 / 2}
                />

                <div
                    className="text-lg flex gap-5 items-center absolute bottom-[-44px] md:bottom-[-34px] left-[12px] md:left-8 py-4 px-5 rounded-3xl z-20 backdrop-blur-3xl backdrop-brightness-75 shadow-md"
                >
                    <ImageReduceMotion
                        alt="Server icon"
                        className="rounded-full h-14 w-14 ring-offset-(--background-rgb) ring-2 ring-offset-2 ring-violet-400/40"
                        url={guildExists ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : "/discord"}
                        size={128}
                    />

                    <div className="flex flex-col gap-1">
                        <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium max-w-md truncate">
                            {guildExists ? guild.name : "Unknown Server"}
                        </div>
                        <div className="text-sm font-semibold flex items-center gap-1">
                            <HiUsers /> {guildExists ? intl.format(guild?.memberCount) : 0}

                            <Image src="https://cdn.discordapp.com/emojis/875797879401361408.webp?size=32" width={18} height={18} alt="boost icon" className="ml-2" />
                            <span className="ml-2">Level {guildExists ? guild?.premiumTier : 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            <ListTab
                tabs={[
                    {
                        name: "Messages",
                        value: "messages",
                        icon: <HiAnnotation />
                    },
                    {
                        name: "Voicetime",
                        value: "voiceminutes",
                        icon: <HiVolumeUp />
                    },
                    {
                        name: "Invites",
                        value: "invites",
                        icon: <HiLink />
                    }
                ]}
                url={`/leaderboard/${guildId}`}
                searchParamName="type"
                disabled={!guild}
            />

            <div className="md:flex">

                <div
                    itemScope
                    itemType="https://schema.org/ItemList"
                    className="lg:w-3/4 md:w-2/3 w-full md:mr-6"
                >
                    {guildExists && <h2 itemProp="name" className="display-hidden sr-only">Top 10 users in {guild?.name}</h2>}
                    <link itemProp="itemListOrder" href="https://schema.org/ItemListOrderDescending" />

                    {children}

                </div>

                <div className="lg:w-1/4 md:w-1/3 mt-8 md:mt-0">
                    <Side
                        guild={guild}
                        pagination={pagination}
                    />
                </div>

            </div>

        </div>
    );
}