"use client";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { HiExclamation, HiSparkles } from "react-icons/hi";

import { getGift } from "./api";

export function GiftBanner() {
    const search = useSearchParams();
    const giftId = search.get("gift");

    if (!giftId) {
        return null;
    }

    return (
        <Suspense
            fallback={<Skeleton className="h-9.5 w-full rounded-lg my-3" />}
        >
            <InnerGiftBanner giftId={giftId} />
        </Suspense>
    );
}

async function InnerGiftBanner({ giftId }: { giftId: string; }) {
    const gift = await getGift(giftId);

    if (!gift || "message" in gift) {
        return (
            <Alert className="my-3" variant="secondary">
                <HiExclamation className="size-4 mt-0.5" />

                <AlertTitle>
                    {gift?.message || "Someone else already claimed this gift."}
                </AlertTitle>
            </Alert>
        );
    }
    return (
        <Alert className="my-3">
            <HiSparkles className="size-4" />

            <AlertTitle>
                <span className="font-bold">{gift.days} day free trial</span> will be applied at checkout.
            </AlertTitle>
        </Alert>
    );
}