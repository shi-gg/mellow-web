"use client";
import { userStore } from "@/common/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputBase, InputBaseAdornment, InputBaseAdornmentButton, InputBaseControl, InputBaseInput } from "@/components/ui/input-base";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type HTMLProps, useState } from "react";
import { HiArrowDown, HiArrowUp, HiLightningBolt, HiOutlineInformationCircle } from "react-icons/hi";

export const MONTHLY_PRICES = [4, 8, 12, 18, 25] as const;
export const YEARLY_PRICES = [40, 50, 60, 80, 100] as const;
const PERIODS = ["month", "year"] as const;

export function Subscribe({ header }: { header?: boolean; }) {
    const search = useSearchParams();

    const premium = userStore((u) => u?.premium || false);
    const [donation, setDonation] = useState(0);
    const [period, setPeriod] = useState<"month" | "year">("month");

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

    return (
        <div className="w-full space-y-2">
            {header && (
                <div className="flex gap-2 justify-center">
                    <span className="dark:text-neutral-200 text-neutral-800 font-medium text-sm">Upgrade your experience further!</span>
                    <Badge
                        variant="flat"
                        radius="rounded"
                    >
                        €{currentPrice} /{period}
                    </Badge>
                </div>
            )}

            <div className="w-full relative overflow-hidden rounded-lg border border-border group p-px h-fit">
                <span className="absolute inset-[-1000%] animate-[spin_5s_linear_infinite_reverse] bg-[conic-gradient(from_90deg_at_0%_50%,#8b5cf6_50%,hsl(var(--input)/30)_7%)]" />
                <Button
                    asChild
                    className='w-full px-2 backdrop-blur-xs backdrop-brightness-50 md:backdrop-brightness-25 bg-none rounded-md hover:bg-[#8b5cf6]/50'
                >
                    <Link
                        prefetch={false}
                        href={`/premium/checkout?${new URLSearchParams({
                            donation: donation.toString(),
                            gift: search.get("gift") || "",
                            period
                        }).toString()}`}
                    >
                        <HiLightningBolt />
                        Subscribe
                    </Link>
                </Button>
            </div>

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
                        {p.replace(/^\w/, (char) => char.toUpperCase())}ly
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

interface DonationProps extends HTMLProps<HTMLDivElement> {
    donation: number;
    setDonation: (value: number) => void;
}

export function DonationSelect({ donation, setDonation, ...props }: DonationProps) {
    return (
        <InputBase {...props}>
            <InputBaseAdornment className="flex">
                <div className="relative right-1.5 flex gap-1">
                    <Button
                        className={cn("h-7", donation === 0 && "animate-bounce transition-all duration-800")}
                        size="icon"
                        onClick={() => setDonation(Math.min(donation + 1, 100))}
                        disabled={donation >= 100}
                    >
                        <HiArrowUp className="size-3! " />
                    </Button>
                    <Button
                        className="h-7"
                        size="icon"
                        onClick={() => setDonation(Math.max(donation - 1, 0))}
                        disabled={donation <= 0}
                    >
                        <HiArrowDown className="size-3!" />
                    </Button>
                </div>
                €
            </InputBaseAdornment>
            <InputBaseControl>
                <InputBaseInput
                    placeholder="extra donation"
                    defaultValue={0}
                    onChange={(e) => {
                        const num = Number(e.target.value);
                        if (Number.isNaN(num)) return;

                        setDonation(Math.max(Math.min(num, 100), 0));
                    }}
                    value={donation}
                />
            </InputBaseControl>
            <Tooltip>
                <InputBaseAdornment>
                    <InputBaseAdornmentButton asChild>
                        <TooltipTrigger>
                            <HiOutlineInformationCircle />
                        </TooltipTrigger>
                    </InputBaseAdornmentButton>
                </InputBaseAdornment>
                <TooltipContent>
                    <p>Extra donation</p>
                </TooltipContent>
            </Tooltip>
        </InputBase>
    );
}