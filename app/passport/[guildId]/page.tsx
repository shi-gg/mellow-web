import ImageReduceMotion from "@/components/image-reduce-motion";
import { ListFeature } from "@/components/list";
import Notice, { NoticeType } from "@/components/notice";
import { OverviewLink } from "@/components/overview-link";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { getGuild } from "@/lib/api";
import paintPic from "@/public/paint.webp";
import { GuildFlags } from "@/typings";
import { intl } from "@/utils/numbers";
import { getCanonicalUrl } from "@/utils/urls";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { HiChartBar, HiCheck, HiInformationCircle, HiLightningBolt, HiLockClosed, HiStar, HiUsers, HiX } from "react-icons/hi";

import { getPassport } from "./api";
import { Verify } from "./verify.component";

interface Props {
    params: Promise<{ guildId: string; }>;
    searchParams: Promise<{ page: string; type: string; }>;
}

export const revalidate = 60;

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
    const { guildId } = await params;

    const guild = await getGuild(guildId);
    const name = guild && "name" in guild ? guild.name : "Unknown";

    const title = `Verify in ${name}`;
    const description = `Easily verify yourself in ${name} with a simple and safe captcha in the web to gain access all channels.`;
    const url = getCanonicalUrl("passport", guildId);

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
            images: guild && "icon" in guild && guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp?size=256` : "/discord.png"
        },
        twitter: {
            card: "summary",
            title,
            description
        },
        robots: guild && "id" in guild ? "index, follow" : "noindex"
    };
};

export default async function Home({ params }: Props) {
    const { guildId } = await params;
    const jar = await cookies();

    const [guild, passport] = await Promise.all([
        getGuild(guildId),
        getPassport(guildId)
    ]);

    const guildExists = guild && "id" in guild;

    return (<>
        {passport && "message" in passport &&
            <Notice type={NoticeType.Error} message={passport.message} />
        }

        {guildExists && guild?.id === "1125063180801036329" && (
            <Alert
                className="mb-4 flex items-center justify-between"
                variant="secondary"
            >
                <AlertTitle className="flex gap-3">
                    <HiInformationCircle className="size-5 relative left-1" />
                    This is a demo server to test out passport verification.
                </AlertTitle>

                <Button asChild>
                    <Link
                        href="https://discord.gg/2nrK8DfjPt"
                        target="_blank"
                    >
                        <BsDiscord className="relative right-1 mt-px" />
                        Join Server
                    </Link>
                </Button>
            </Alert>
        )}

        <div className="grid md:flex md:gap-6">

            <div className="w-full md:max-w-[384px] overflow-hidden rounded-xl dark:bg-wamellow bg-wamellow-100 relative">
                <Image
                    alt=""
                    className="w-full object-cover h-[216px]"
                    src={guild && "banner" in guild && guild.banner ? `https://cdn.discordapp.com/banners/${guild?.id}/${guild?.banner}?size=512` : paintPic.src}
                    width={960}
                    height={540}
                />

                <div
                    className="absolute top-0 w-full h-[216px]"
                    style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgb(30, 23, 43) 100%)" }}
                />

                <div className="text-lg flex gap-5 items-center absolute top-[146px] rounded-3xl z-20 left-[4px] md:left-1.5 py-4 px-5 backdrop-blur-3xl backdrop-brightness-90 shadow-md">
                    <ImageReduceMotion
                        alt="Server icon"
                        className="rounded-full h-14 w-14 ring-offset-(--background-rgb) ring-2 ring-offset-2 ring-violet-400/40"
                        url={guildExists ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}` : "/discord"}
                        size={128}
                    />

                    <div className="flex flex-col gap-1">
                        <div className="text-2xl dark:text-neutral-200 text-neutral-800 font-medium max-w-64 truncate">
                            {guildExists ? guild.name : "Unknown Server"}
                        </div>
                        <div className="text-sm font-semibold flex items-center gap-1">
                            <HiUsers /> {guildExists ? intl.format(guild?.memberCount) : 0}

                            <Image src="https://cdn.discordapp.com/emojis/875797879401361408.webp?size=32" width={18} height={18} alt="boost icon" className="ml-2" />
                            <span className="ml-2">Level {guildExists ? guild?.premiumTier : 0}</span>
                        </div>
                    </div>
                </div>

                <div className="mx-4 mb-4 mt-10 font-medium">
                    <span className="text-sm font-bold text-muted-foreground">GET ACCESS TO</span>
                    <ul>
                        {[
                            "Secure server",
                            `${guildExists ? intl.format(guild?.memberCount) : 0} members`
                        ].map((name) => (
                            <li key={name} className="flex gap-1 items-center">
                                <HiCheck className="text-violet-400 relative top-px" />
                                {name}
                            </li>
                        ))}
                        <li className="flex gap-1 items-center" title="The cake is a lie">
                            <HiX className="text-red-400 relative top-px" />
                            Cakes
                        </li>
                    </ul>

                    {
                        guildExists &&
                        passport &&
                        "enabled" in passport &&
                        passport.enabled &&
                        <Verify
                            guild={guild}
                            isLoggedIn={Boolean(jar.get("session")?.value)}
                        />
                    }
                </div>

            </div>

            <div>
                <div className="hidden md:block w-full h-min overflow-hidden rounded-xl bg-wamellow py-4 px-5 mb-6">

                    <div className="mb-4 text-neutral-100 font-semibold text-xl">Modern, Simple, Wamellow 👋</div>
                    <ListFeature
                        items={[
                            { icon: <HiLockClosed />, title: "Secure", description: "Wamellow does not store your IP, Geolocation or similar, nothing is kept, no logs.", color: 0xA8_4B_56 },
                            { icon: <BsDiscord />, title: "Integration", description: "Unparalleled Discord integration, setting us apart from the rest.", color: 0x47_52_C4 },
                            { icon: <HiStar />, title: "Easy", description: "The most user-friendly and visually appealing verification process.", color: 0x7F_43_D8 },
                            { icon: <HiLightningBolt />, title: "Fast", description: "Welcome new members easily with the fastest verification method available.", color: 0xFF_91_56 }
                        ]}
                    />
                </div>

                {guildExists && (guild.flags & GuildFlags.PrivateLeaderboard) === 0 && (
                    <OverviewLink
                        title="View Leaderboard"
                        message="Easily access and view the top chatters, voice timers, and inviters from this server in the web."
                        url={`/leaderboard/${guildId}`}
                        icon={<HiChartBar />}
                    />
                )}
            </div>

        </div>
    </>);
}