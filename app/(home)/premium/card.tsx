import { Badge } from "@/components/ui/badge";
import MrBeastPic from "@/public/mrbeast.webp";
import { cn } from "@/utils/cn";
import { Lexend } from "next/font/google";
import Image from "next/image";
import type { ReactNode } from "react";

import { GiftBanner } from "./gift-banner";

export interface Feature {
    label: string;
    icon: ReactNode;
}

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

const lexend = Lexend({ subsets: ["latin"] });

export function PricingCard({ title, price, priceSuffix, features, accentColor, badge, highlighted, action }: PricingCardProps) {
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
                            <span className={cn("size-5 shrink-0 flex items-center justify-center [&>svg]:size-4.5", accentColor)}>
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