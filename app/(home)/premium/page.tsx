import Comment from "@/components/comment";
import { OverviewLink } from "@/components/overview-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Anchor } from "@/components/ui/typography";
import BotStylePic from "@/public/docs-assets/bot-style.webp";
import MrBeastPic from "@/public/mrbeast.webp";
import { cn } from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
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

import { GiftBanner } from "./gift-banner";
import { Subscribe } from "./subscribe.component";

const lexend = Lexend({ subsets: ["latin"] });

interface Feature {
    label: string;
    icon: ReactNode;
}

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

interface PricingCardProps {
    title: string;
    price: string;
    priceSuffix: string;
    features: Feature[];
    accentColor: string;
    badge?: string;
    highlighted?: boolean;
    action: ReactNode;
}

function PricingCard({ title, price, priceSuffix, features, accentColor, badge, highlighted, action }: PricingCardProps) {
    return (
        <div className="relative w-full md:max-w-md">
            {badge && (
                <Badge
                    className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 bg-violet-500 text-white border-violet-500 uppercase tracking-wider text-[10px] font-bold px-3 py-1"
                >
                    {badge}
                </Badge>
            )}
            <div className={cn(
                "dark:bg-wamellow bg-wamellow-100 rounded-xl p-6 h-full flex flex-col duration-300",
                highlighted
                    ? "border border-violet-500/40 relative overflow-hidden"
                    : "border border-transparent hover:border-violet-500/20"
            )}>
                {highlighted && (
                    <div className="absolute inset-0 bg-violet-500/3 pointer-events-none" />
                )}

                <div className={cn("mb-6", highlighted && "relative")}>
                    <h2 className={cn("text-2xl font-semibold dark:text-neutral-100 text-neutral-900 mb-1", lexend.className)}>
                        {title}
                    </h2>
                    {price !== "0" && <GiftBanner />}
                    <div className="flex items-end gap-1 mt-2">
                        <span className="text-muted-foreground text-sm mb-1">€</span>
                        <span className={cn("text-4xl font-bold dark:text-neutral-100 text-neutral-900", lexend.className)}>{price}</span>
                        <span className="text-muted-foreground text-sm mb-1">/ {priceSuffix}</span>
                    </div>
                </div>

                <div className={cn("space-y-3 flex-1", highlighted && "relative")}>
                    {features.map((feature) => (
                        <div key={feature.label} className="flex items-center gap-3">
                            <span className={cn("size-5 shrink-0 flex items-center justify-center [&>svg]:size-[18px]", accentColor)}>
                                {feature.icon}
                            </span>
                            <span className="dark:text-neutral-300 text-neutral-700 text-sm">{feature.label}</span>
                        </div>
                    ))}
                    {price === "0" &&
                        <Image
                            src={MrBeastPic}
                            alt=""
                            className="h-65 w-auto rounded-lg mt-6 hidden md:block"
                        />}
                </div>

                <div className={cn("mt-8", highlighted && "relative")}>
                    {action}
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    return (
        <div className="w-full">
            <h1
                className={cn(lexend.className, "lg:text-5xl text-4xl font-bold dark:text-neutral-100 text-neutral-900 wrap-break-words mb-2 flex gap-4")}
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
                    price="4"
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