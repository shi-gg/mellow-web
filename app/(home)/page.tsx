import Box from "@/components/box";
import Comment from "@/components/comment";
import DiscordAppBadge from "@/components/discord/app-badge";
import DiscordChannel from "@/components/discord/channel";
import DiscordChannelCategory from "@/components/discord/channel-category";
import { DiscordMarkdown } from "@/components/discord/markdown";
import DiscordMessage from "@/components/discord/message";
import DiscordMessageEmbed from "@/components/discord/message-embed";
import DiscordUser from "@/components/discord/user";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { AvatarGroup, UserAvatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Code } from "@/components/ui/typography";
import { defaultFetchOptions } from "@/lib/api";
import CaptchaPic from "@/public/captcha.webp";
import ArrowPic from "@/public/icons/arroww.webp";
import LeaderboardPic from "@/public/leaderboard.webp";
import NotificationsPic from "@/public/notifications-thumbnail.webp";
import SpacePic from "@/public/space.webp";
import WaifuPic from "@/public/waifu.webp";
import WelcomePic from "@/public/welcome.webp";
import type { ApiV1TopguildsGetResponse } from "@/typings";
import { cn } from "@/utils/cn";
import { toFixedArrayLength } from "@/utils/fixed-array-length";
import { actor } from "@/utils/tts";
import { getCanonicalUrl } from "@/utils/urls";
import dynamic from "next/dynamic";
import { Montserrat, Patrick_Hand } from "next/font/google";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { BsDiscord, BsYoutube } from "react-icons/bs";
import { HiArrowNarrowRight, HiArrowRight, HiCash, HiCheck, HiFire, HiLockOpen, HiUserAdd } from "react-icons/hi";

import { Commands } from "./commands.component";
import { Ratings } from "./ratings.component";

const Faq = dynamic(() => import("./faq.component").then((m) => m.Faq), {
    ssr: false
});

const montserrat = Montserrat({ subsets: ["latin"] });
const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

export const revalidate = 43_200;

const styles = {
    h2: cn(montserrat.className, "lg:text-5xl text-4xl bg-linear-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-300 font-bold mb-4"),
    h3: cn(montserrat.className, "lg:text-2xl text-xl bg-linear-to-b bg-clip-text text-transparent from-neutral-200 from-40% to-neutral-300 font-semibold")
};

const messageProps = (command?: string) => ({
    mode: "DARK" as const,
    commandUsed: command
        ? {
            name: command,
            username: "@mwlica",
            avatar: "/luna.webp",
            bot: false
        }
        : undefined,
    user: {
        username: "Wamellow",
        avatar: "/waya-v3.webp",
        bot: true
    }
});

export default async function Home() {
    const topGuildsPromise = fetch(`${process.env.NEXT_PUBLIC_API}/top-guilds`, defaultFetchOptions)
        .then((res) => res.json())
        .catch(() => null) as Promise<ApiV1TopguildsGetResponse[] | null>;

    const heads = await headers();
    const isEmbedded = heads.get("sec-fetch-dest") === "iframe";

    const topGuilds = await topGuildsPromise;

    return (
        <div className="flex items-center flex-col w-full">

            <div className="flex w-full items-center gap-8 mb-16 md:mb-12 min-h-[500px] h-[calc(100svh-14rem)] md:h-[calc(100dvh-16rem)]">
                <div className="md:min-w-96 w-full md:w-2/3 xl:w-1/2 flex flex-col space-y-6">

                    <Suspense fallback={<Skeleton className="w-60 h-6! m-0!" isLoading={true} />}>
                        <Ratings />
                    </Suspense>

                    <h1 className={cn(montserrat.className, "lg:text-7xl md:text-6xl text-5xl font-semibold dark:text-neutral-100 text-neutral-900 break-words")}>
                        <span className="bg-linear-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">
                            Accessibility
                        </span>
                        {" for "}
                        <span className="break-keep inline-flex items-center">
                            Discord
                            <DiscordAppBadge className="mt-1 scale-[250%] md:scale-[300%] lg:scale-[360%] relative left-12 md:left-14 lg:left-20" />
                        </span>
                    </h1>

                    <span className="text-lg font-medium max-w-152 mb-4">
                        Accessibility where it&apos;s needed the most: Discord Voice Chats.
                        Social notifications to stay connected and up to date with anyone, anywhere.
                        Simple, customizable, free, and built in public.
                    </span>

                    <AvatarGroup className="mr-auto md:hidden">
                        {toFixedArrayLength(topGuilds || [], 8)
                            ?.map((guild) => (
                                <UserAvatar
                                    key={"mobileGuildGrid-" + guild.id}
                                    alt={guild.name}
                                    className="-mr-2"
                                    src={guild.icon ? guild.icon + "?size=128" : "/discord.webp"}
                                />
                            ))
                        }
                    </AvatarGroup>

                    <div className="space-y-4">
                        <Link
                            className="flex gap-1 items-center text-violet-400 hover:underline w-fit"
                            href={getCanonicalUrl("dashboard")}
                        >
                            Go to Dashboard <HiArrowNarrowRight />
                        </Link>

                        <div className="flex gap-2">
                            <Button
                                asChild
                                className="w-1/2 lg:w-fit text-lg font-medium"
                                variant="secondary"
                            >
                                <Link
                                    prefetch={false}
                                    href="/login?invite=true"
                                >
                                    <HiUserAdd className="mx-1" />
                                    <span className="block sm:hidden">Invite</span>
                                    <span className="hidden sm:block">Invite Wamellow</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                className="w-1/2 lg:w-fit text-lg"
                            >
                                <Link
                                    prefetch={false}
                                    href="/support"
                                >
                                    <BsDiscord className="mx-1 mt-px" />
                                    <span className="block sm:hidden">Support</span>
                                    <span className="hidden sm:block">Join Support</span>
                                </Link>
                            </Button>
                        </div>

                        <span className={cn("lg:ml-auto flex gap-2 text-neutral-500 font-medium opacity-80 pl-20 lg:pr-20 rotate-2 scale-110 relative pt-0.5", handwritten.className)}>
                            <Image src={ArrowPic} width={24} height={24} alt="arrow up" className="size-5" draggable={false} />
                            Get started here in seconds
                        </span>

                    </div>
                </div>

                <div className="ml-auto w-fit xl:w-1/2 hidden md:block">
                    <div className="flex gap-4 rotate-6 relative left-14 w-fit">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={"guildGridThing-" + i}
                                className={cn(
                                    "flex flex-col gap-4",
                                    i % 2 === 1 ? "mt-4 animate-guilds" : "animate-guilds-2",
                                    (i === 0 || i === 3) && "hidden xl:flex")
                                }
                            >
                                {toFixedArrayLength(topGuilds || [], 12)
                                    .slice(i * 3, (i * 3) + 3)
                                    .map((guild, i2) => (
                                        <Link
                                            key={"guildGrid-" + guild.id + i + i2}
                                            className="relative md:h-32 h-24 md:w-32 w-24 hover:scale-110 duration-200"
                                            href={getCanonicalUrl("leaderboard", guild.id)}
                                            prefetch={false}
                                        >
                                            <ImageReduceMotion
                                                alt="server"
                                                className="rounded-xl bg-wamellow"
                                                url={(guild.icon || "/discord.webp")?.split(".").slice(0, -1).join(".")}
                                                size={128}
                                            />
                                        </Link>
                                    ))
                                }
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="animate-scroll rounded-medium rotate-180 md:rounded-3xl md:rotate-0">
                <div className="animate-scroll-wheel" />
            </div>

            <article
                itemScope
                itemType="http://schema.org/Article"
                className="flex flex-col gap-28 my-10"
            >

                <div>
                    <h2 className={styles.h2}>Next-Level text to speech 🔊</h2>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2 flex flex-col items-start">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCash />
                                100% free forever
                            </Badge>

                            <h3 className={styles.h3}>97 Voices in 10 Languages</h3>

                            <div className="pt-6">
                                You can either generate files using <Code>/tts file</Code>, talk in voice chats with <Code>/tts voice</Code> or setup a dedicated channel!
                                Great for people with aphonia, dysphonia, or other speech impairments.
                            </div>

                            <Link href="/docs/text-to-speech#voices">
                                <AvatarGroup className="mt-4">
                                    {["us", "fr", "de", "es", "br", "pt", "id", "it", "jp", "kr"].map((lang) => {
                                        const name = Object
                                            .entries(actor)
                                            .find(([, [, langCode]]) => langCode === lang)
                                            ?.[1][0] || lang;

                                        return (
                                            <UserAvatar
                                                key={"ttsLang-" + lang}
                                                alt={name}
                                                className="-mr-2 size-8"
                                                src={`/icons/${lang}.webp`}
                                            />
                                        );
                                    })}
                                </AvatarGroup>
                            </Link>

                            <div className="flex gap-2 mt-5">
                                <Invite />
                                <Button asChild>
                                    <Link
                                        prefetch={false}
                                        href="https://youtu.be/NS5fZ1ltovE?si=I3nViYb4sx3n3Uvo"
                                        target="_blank"
                                    >
                                        <BsYoutube />
                                        Watch YouTube Video
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 ">

                            <div
                                className="bg-discord-gray px-8 py-6 md:py-12 rounded-lg flex flex-col sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center gap-4 min-h-56"
                            >
                                <DiscordChannelCategory name="#/voice/dev/null">
                                    <DiscordChannel
                                        type="voice"
                                        name="• Public"
                                    >
                                        <DiscordUser username="mwlica" avatar="/luna.webp" />
                                        <DiscordUser username="Space" avatar="/space.webp" />
                                        <DiscordUser username="Wamellow" avatar="/waya-v3.webp" isTalking />
                                    </DiscordChannel>
                                </DiscordChannelCategory>

                                <div className="bg-[#313338] h-0.5 w-full sm:w-0.5 sm:h-32 md:h-0.5 md:w-full lg:w-0.5 lg:h-32 rounded-full ml-2" />

                                <DiscordMessage {...messageProps("tts voice")}>
                                    Now talking...
                                </DiscordMessage>
                            </div>

                            <span className="text-sm mt-1 opacity-75">
                                English, French, German, Spanish, Portuguese, Indonesian, Italian, Japanese, Korean.
                            </span>

                        </div>

                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Stylish Social Notifications 📢</h2>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCash />
                                Free styling — 30 channels
                            </Badge>

                            <h3 className={styles.h3}>YouTube, Twitch, Bluesky & Reddit</h3>

                            <div className="pt-6">
                                Set up notifications with free custom messages and embeds for up to 30 channels and get notified in less than a minute.

                                <ol className="mt-4">
                                    {[
                                        "Youtube, Twitch, Bluesky and Reddit",
                                        "Custom message & embed",
                                        "Up to 30 channels",
                                        "Insanely fast"
                                    ].map((name) => (
                                        <li key={name} className="flex gap-1 items-center">
                                            <HiCheck className="text-violet-400" />
                                            {name}
                                        </li>
                                    ))}
                                </ol>
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <Button asChild>
                                    <Link
                                        prefetch={false}
                                        href="https://youtu.be/xizs-hrwK4I?si=6pIYALygtNhUwpph"
                                        target="_blank"
                                    >
                                        <BsYoutube />
                                        Watch Tutorial
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link
                                        prefetch={false}
                                        href="/dashboard?to=notifications"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        Setup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps()}>
                                <DiscordMarkdown mode={"DARK"} text="Hey **@everyone**, Linus Tech Tips just posted a new video!\n[youtube.com/watch?v=tN-arR2UoRk](https://youtube.com/watch?v=tN-arR2UoRk)" />
                                <DiscordMessageEmbed
                                    mode="DARK"
                                    title="My wife insisted I do this for her"
                                    color={0x8A_57_FF}
                                >
                                    <Image
                                        alt=""
                                        className="rounded-md shadow-md w-full mt-2"
                                        itemProp="image"
                                        loading="lazy"
                                        src={NotificationsPic}
                                    />
                                </DiscordMessageEmbed>
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Watchin{"'"} Anime ❤️</h2>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCash />
                                100% sexy for free
                            </Badge>

                            <h3 className={styles.h3}>/anime command</h3>

                            <div className="pt-6">
                                Unleash the magic of anime right within your Discord server with Wamellow{"'"}s 25+ categories.
                                Dive into a world of adorable nekos, charming waifus, and much more, all at your fingertips.
                                Whether it{"'"}s sharing the cutest characters or discovering stunning artwork, bring the joy of anime directly to your community, making your server a hub for all things anime-related.
                            </div>
                            {!isEmbedded && (
                                <div className="p-4 pb-3 border border-divider rounded-lg my-8">
                                    <Badge
                                        className="mb-2"
                                        variant="flat"
                                        radius="rounded"
                                    >
                                        <HiFire />
                                        Supports NSFW
                                    </Badge>
                                    <div className="text-base">
                                        Find spicy nekos, waifus, and more in nsfw marked channels.
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-2 mt-6">
                                <Invite />
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps("anime")}>
                                <Image
                                    alt=""
                                    className="rounded-md shadow-md w-64 md:w-56 lg:w-72 md:w-unset max-w-xs mt-2"
                                    height={905 / 3}
                                    itemProp="image"
                                    loading="lazy"
                                    src={WaifuPic}
                                    width={640 / 3}
                                />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Fun leveling and leaderboards 🦄</h2>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCash />
                                Free custom backgrounds
                            </Badge>

                            <h3 className={styles.h3}>/leaderboard & /rank</h3>

                            <div className="pt-6">
                                Enhance your server{"’"}s engagement with text-, voice- and invite based leaderboards, tailored to track and reward your most active members.
                                By motivating your members to communicate, you{"’"}ll cultivate a more active server community.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <Button asChild>
                                    <Link
                                        href="/leaderboard/828676951023550495"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        View Leaderboard
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps("leaderboard")}>
                                <Image
                                    alt="example leaderboard card"
                                    src={LeaderboardPic}
                                    height={1_024 / 4}
                                    itemProp="image"
                                    loading="lazy"
                                    width={2_048 / 4}
                                />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Fun with Starboards ⭐</h2>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCash />
                                My lawyer said that title below
                            </Badge>

                            <h3 className={styles.h3}>POGBOARD DEEZ NUTS</h3>

                            <div className="pt-6">
                                With Starboards, you have the power to highlight remarkable messages in your server.
                                When you come across a message that is either funny or hilarious, simply react with a star, and if enough people star the message, it will be posted to the set starboard channel.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <Button asChild>
                                    <Link
                                        href="/dashboard?to=starboard"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        Setup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps()}>
                                <DiscordMessageEmbed
                                    mode={"DARK"}
                                    color={0xBD_7F_D6}
                                    author={{
                                        text: "@mwlica",
                                        icon_url: "/luna.webp"
                                    }}
                                >
                                    I DONT EVEN HAVE A CAR

                                    <div className="flex gap-1 mt-4 mb-1">
                                        <span className="font-bold flex gap-1 items-center">⭐ 38</span>
                                        •
                                        <span className="text-blue-500 hover:underline cursor-pointer">#lounge</span>
                                    </div>

                                    <DiscordMarkdown mode={"DARK"} text="**Replied to @drijon**" />
                                    <DiscordMarkdown mode={"DARK"} text="As if someone creates a discord account being like: OH I NEED TO KNOW THE GAS PRICES. THERE IS A NICE WAY FOR IT. MEE6 PREMIUM!" />
                                </DiscordMessageEmbed>
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Heyho and farewell @user 👋</h2>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCash />
                                w/ free image card backgrounds
                            </Badge>

                            <h3 className={styles.h3}>Greetings</h3>

                            <div className="pt-6">
                                Give a warm welcome to new members, introducing them to rules, and topics with a fully customized message.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <Button asChild>
                                    <Link
                                        href="/dashboard?to=greeting"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        Setup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg">
                            <DiscordMessage {...messageProps()}>
                                <DiscordMarkdown mode={"DARK"} text="Welcome @mwlica to **Someone's** 👋" />
                                <Image
                                    alt="example welcome card"
                                    src={WelcomePic}
                                    height={(256 + 16) / 2}
                                    itemProp="image"
                                    loading="lazy"
                                    width={1_024 / 2}
                                />
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Verify members w/ Passport</h2>

                    <Box className="flex flex-col md:flex-row gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCash />
                                Free and Secure
                            </Badge>

                            <h3 className={styles.h3}>Captcha verification</h3>

                            <div className="pt-6">
                                Protect your server from unwanted attacks, such as bot-raids, with our captcha verification system.
                                Ensure that only human members can access your channels, safeguarding your server from raider attacks and ensuring a safe and secure environment for all your members.
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <Button asChild>
                                    <Link
                                        href="/passport/1125063180801036329"
                                        target="_blank"
                                    >
                                        <HiLockOpen />
                                        Try it out
                                    </Link>
                                </Button>
                                <Button asChild>
                                    <Link
                                        href="/dashboard?to=greeting/passport"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        Setup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="w-full md:w-1/2 flex justify-center">
                            <Image
                                alt="anime captcha verification example"
                                className="max-w-56"
                                src={CaptchaPic}
                                height={1_530 / 5}
                                itemProp="image"
                                loading="lazy"
                                width={1_070 / 5}
                            />
                        </div>
                    </Box>
                </div>

                <div>
                    <h2 className={styles.h2}>Create Custom Responses 🖊️</h2>

                    <Box className="flex flex-col md:flex-row-reverse gap-10 items-center">
                        <div className="md:w-1/2">
                            <Badge
                                className="mb-2"
                                variant="flat"
                                radius="rounded"
                            >
                                <HiCash />
                                30 tags free
                            </Badge>

                            <h3 className={styles.h3}>Wamellow tags</h3>

                            <div className="pt-6">
                                Easily handle frequently asked questions, common queries, and repetitive tasks in a snap.
                                Empower your server with quick access to custom commands.
                                Boost engagement and create a knowledgeable community for free!
                            </div>
                            <div className="flex gap-2 mt-6">
                                <Invite />
                                <Button asChild>
                                    <Link
                                        href="/dashboard?to=custom-commands"
                                        target="_blank"
                                    >
                                        <HiArrowRight />
                                        Setup
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="bg-discord-gray w-full md:w-1/2 px-8 py-4 rounded-lg flex flex-col gap-4">
                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "mwlica",
                                    avatar: "/luna.webp",
                                    bot: false
                                }}
                            >
                                <DiscordMarkdown mode={"DARK"} text="wm - howto" />
                            </DiscordMessage>

                            <DiscordMessage
                                mode={"DARK"}
                                user={{
                                    username: "Wamellow",
                                    avatar: "/waya-v3.webp",
                                    bot: true
                                }}
                            >
                                <DiscordMessageEmbed
                                    mode={"DARK"}
                                    color={0xBC_7E_D4}
                                >
                                    <DiscordMarkdown mode={"DARK"} text="To create a custom command, go to [your server's dashboard](/dashboard?to=custom-commands), click on `Create`, fill in the response **content**, **embed title**, **embed description**, **embed color**, **embed images**, command **permissions** and more. When you're done you can start using the command 🎉" />
                                </DiscordMessageEmbed>
                            </DiscordMessage>
                        </div>
                    </Box>
                </div>

            </article>

            <Suspense fallback={<Skeleton className="w-full h-96" isLoading={true} />}>
                <Faq />
            </Suspense>

            <Comment
                username="Luna’s Grandpa <3"
                bio="likes feta and wine"
                avatar={SpacePic}
                content="FUCK EVERYTHING! EXCEPT LUNA, LUNA MUST BE PROTECTED AT ALL COSTS"
            />

            <Suspense>
                <Commands />
            </Suspense>

        </div>
    );
}

function Invite() {
    return (
        <Button
            variant="secondary"
            asChild
        >
            <Link
                href="/login?invite=true"
                prefetch={false}
            >
                <HiUserAdd />
                <span className="block sm:hidden">Invite</span>
                <span className="hidden sm:block">Invite Wamellow</span>
            </Link>
        </Button>
    );
}