import Comment from "@/components/comment";
import { OverviewLink } from "@/components/overview-link";
import { Button } from "@/components/ui/button";
import { Anchor } from "@/components/ui/typography";
import BotStylePic from "@/public/docs-assets/bot-style.webp";
import { cn } from "@/utils/cn";
import { MONTHLY_PRICES } from "@/utils/premium";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import {
    HiBell,
    HiChat,
    HiCheckCircle,
    HiCog,
    HiColorSwatch,
    HiGlobe,
    HiHand,
    HiLightningBolt,
    HiShieldCheck,
    HiSparkles,
    HiSpeakerphone,
    HiStar,
    HiSwitchHorizontal,
    HiTemplate,
    HiTrendingUp,
    HiVolumeUp
} from "react-icons/hi";

import type { Feature } from "./card";
import { PricingCard } from "./card";
import { Subscribe } from "./subscribe";

const lexend = Lexend({ subsets: ["latin"] });

const freeFeatures: Feature[] = [
    { label: "Text to Speech", icon: <HiVolumeUp /> },
    { label: "Social notifications", icon: <HiBell /> },
    { label: "Custom commands", icon: <HiChat /> },
    { label: "Leaderboards", icon: <HiTrendingUp /> },
    { label: "Dailyposts", icon: <HiSpeakerphone /> },
    { label: "Fast support", icon: <HiCheckCircle /> }
];

const premiumFeatures: Feature[] = [
    { label: "Everything in Free", icon: <HiSparkles /> },
    { label: "100,000 translation characters", icon: <HiGlobe /> },
    { label: "Unlimited Text to Speech", icon: <HiVolumeUp /> },
    { label: "Unlimited notifications", icon: <HiBell /> },
    { label: "Unlimited custom commands", icon: <HiTemplate /> },
    { label: "Unlimited transcribtions", icon: <HiChat /> },
    { label: "Customize Avatar, Banner & Bio", icon: <HiColorSwatch /> },
    { label: "Customize Notification Avatar & Banner", icon: <HiCog /> },
    { label: "Notification crosspost", icon: <HiSwitchHorizontal /> },
    { label: "Bypass voting & Passport verification", icon: <HiShieldCheck /> },
    { label: "More welcome roles & pings", icon: <HiHand /> },
    { label: "Premium role", icon: <HiStar /> }
];

export const revalidate = 3_600;

export const generateMetadata = (): Metadata => {

    const title = "Premium (˶˃ ᵕ ˂˶)";
    const description = "Get epic premium+ ULTRA HD features for wamellow to upgrade your servers to a whole new experience and unlock tons of premium features.";
    const url = getCanonicalUrl("premium");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            type: "website",
            url,
            images: `${getBaseUrl()}/waya-v3.webp`
        },
        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images: `${getBaseUrl()}/waya-v3.webp`
        }
    };
};

export default function Home() {
    return (
        <div className="w-full">
            <h1
                className={cn(lexend.className, "md:text-5xl text-4xl font-bold dark:text-neutral-100 text-neutral-900 wrap-break-words mb-2 flex gap-4")}
            >
                <span className="hidden md:block">Wamellow</span>
                <span className="bg-linear-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent break-keep">Premium</span>
                <span className="text-pink-400 rotate-2 ml-2">
                    (˶˃ ᵕ ˂˶)
                </span>
            </h1>

            <div className="text-lg font-medium" >
                Support the mission of accessibility for everyone.
            </div>

            <div className="flex flex-col-reverse md:flex-row gap-6 justify-center mt-8 md:mt-12 mb-12 md:mb-18">
                <PricingCard
                    title="Wamellow Free"
                    price="0"
                    priceSuffix="forever"
                    features={freeFeatures}
                    accentColor="text-green-400"
                    action={
                        <Button
                            asChild
                            className="w-full"
                        >
                            <Link
                                href="/login?invite=true"
                                prefetch={false}
                            >
                                <BsDiscord />
                                Invite Wamellow
                            </Link>
                        </Button>
                    }
                />

                <PricingCard
                    title="Wamellow Premium"
                    price={MONTHLY_PRICES[0].toString()}
                    priceSuffix="per month"
                    features={premiumFeatures}
                    accentColor="text-violet-400"
                    badge="Most Popular"
                    highlighted
                    action={<Subscribe />}
                />
            </div>

            <Comment
                username="@mwlica"
                avatar="/luna.webp"
                bio="Developer"
                content="my goal isn't to make profit, but rather to create something that people will love — but I also have to cover server costs, and buy food"
            />

            <Image
                alt="Custom bot branding"
                src={BotStylePic}
                className="rounded-xl w-full object-cover mt-10"
                placeholder="blur"
            />

            <OverviewLink
                className="mt-4"
                title="Donate one-time instead"
                message="Support me and the project by donating to me on Ko-fi (˶˃ ᵕ ˂˶)"
                url="https://ko-fi.com/mwlica"
                icon={<HiLightningBolt />}
            />

            <div className="opacity-60">
                By donating or subscribing, you agree to our <Anchor href="/terms/payment" target="_blank">Payment Terms</Anchor>.
                Contact <Anchor href="mailto:billing@wamellow.com" target="_blank">billing@wamellow.com</Anchor> for billing issues.
            </div>

        </div>
    );
}