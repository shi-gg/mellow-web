"use client";
import { userStore } from "@/common/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InputBase, InputBaseAdornment, InputBaseAdornmentButton, InputBaseControl, InputBaseInput } from "@/components/ui/input-base";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type HTMLProps, useState } from "react";
import { HiArrowDown, HiArrowUp, HiLightningBolt, HiOutlineInformationCircle } from "react-icons/hi";

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

    const basePrice = period === "year" ? 40 : 4;
    const currentPrice = basePrice + donation;
    const prices = period === "year" ? [40, 50, 60, 80, 100] : [4, 8, 12, 18, 25];

    return (
        <div className="w-full">
            <div className="flex items-center justify-center gap-3 mb-4">
                <button
                    className={cn("text-sm font-medium transition-colors cursor-pointer", period === "month" ? "text-neutral-200" : "text-muted-foreground")}
                    onClick={() => setPeriod("month")}
                >
                    Monthly
                </button>
                <Switch
                    checked={period === "year"}
                    onCheckedChange={(checked) => {
                        setPeriod(checked ? "year" : "month");
                        setDonation(checked ? donation * 10 : Math.round(donation / 10));
                    }}
                />
                <button
                    className={cn("text-sm font-medium transition-colors flex items-center gap-2 cursor-pointer", period === "year" ? "text-neutral-200" : "text-muted-foreground")}
                    onClick={() => setPeriod("year")}
                >
                    Yearly
                    <Badge variant="flat" size="xs" className="text-green-400 bg-green-400/10">
                        -17%
                    </Badge>
                </button>
            </div>

            {header && (
                <div className="flex gap-2 justify-center mb-2">
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

            <div className="w-full flex justify-center my-2">
                <span className="text-muted-foreground font-medium text-xs uppercase">choose what to pay</span>
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