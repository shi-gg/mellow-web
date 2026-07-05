"use client";
import { userStore } from "@/common/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { cn } from "@/utils/cn";
import { MONTHLY_PRICES, PERIODS, PremiumPeriod, YEARLY_PRICES } from "@/utils/premium";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { HiLightningBolt } from "react-icons/hi";

const FIRST_WORD_CHAR_REGEX = /^\w/;

export function Subscribe() {
    const search = useSearchParams();

    const premium = userStore((user) => user?.premium && user.premium > 0);
    const [donation, setDonation] = useState(0);
    const [period, setPeriod] = useState<PremiumPeriod>(PremiumPeriod.Month);

    if (premium) {
        return (
            <Button
                asChild
                variant="secondary"
            >
                <Link
                    className="w-full"
                    href="/profile/billing"
                >
                    <HiLightningBolt />
                    Manage Subscription
                </Link>
            </Button>
        );
    }

    const basePrice = period === "year" ? YEARLY_PRICES[0] : MONTHLY_PRICES[0];
    const prices = period === "year" ? YEARLY_PRICES : MONTHLY_PRICES;
    const currentPrice = basePrice + donation;

    const checkoutParams = new URLSearchParams({
        donation: donation.toString(),
        gift: search.get("gift") || "",
        period
    });

    return (
        <div className="w-full space-y-2">
            <GradientButton
                className="w-full flex items-center gap-2"
                asChild
            >
                <Link
                    prefetch={false}
                    href={`/premium/checkout?${checkoutParams.toString()}`}
                >
                    <HiLightningBolt />
                    Subscribe
                </Link>
            </GradientButton>

            <div className="w-full flex justify-center">
                <span className="text-muted-foreground font-medium text-xs uppercase">choose what to pay</span>
            </div>

            <div className="flex gap-1 w-full">
                {PERIODS.map((p) => (
                    <Button
                        key={p}
                        className={cn("h-7 w-1/2", p === period && "bg-violet-400/20 hover:bg-violet-400/40")}
                        onClick={() => {
                            setPeriod(p);

                            const currentTotal = basePrice + donation;
                            const targetPrices = p === "year" ? YEARLY_PRICES : MONTHLY_PRICES;
                            const targetBase = p === "year" ? YEARLY_PRICES[0] : MONTHLY_PRICES[0];

                            const projectedTotal = p === "year" ? currentTotal * 10 : currentTotal / 10;

                            const nearest = targetPrices.reduce((prev, curr) => {
                                const prevDiff = Math.abs(prev - projectedTotal);
                                const currDiff = Math.abs(curr - projectedTotal);

                                if (currDiff < prevDiff) return curr;
                                if (currDiff === prevDiff) return curr > prev ? curr : prev;
                                return prev;
                            });

                            setDonation(nearest - targetBase);
                        }}
                    >
                        {p.replace(FIRST_WORD_CHAR_REGEX, (char) => char.toUpperCase())}ly
                        {p === "year" && (
                            <Badge
                                variant="flat"
                                radius="rounded"
                                size="sm"
                                className={period === "month" ? "text-green-400 bg-green-400/10" : "text-violet-400 bg-violet-400/10"}
                            >
                                Save {Math.round((1 - YEARLY_PRICES[0] / (MONTHLY_PRICES[0] * 12)) * 100)}%
                            </Badge>
                        )}
                    </Button>
                ))}
            </div>

            <div className="flex gap-1 w-full">
                {prices.map((amount) => (
                    <Button
                        key={amount}
                        className={cn("h-7 w-1/5", amount === currentPrice && "bg-violet-400/20 hover:bg-violet-400/40")}
                        onClick={() => setDonation(amount - basePrice)}
                    >
                        {amount}€
                    </Button>
                ))}
            </div>
        </div>
    );
}