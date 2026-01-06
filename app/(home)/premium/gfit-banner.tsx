"use client";
import Notice from "@/components/notice";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { getGift } from "./api";

export function GiftBanner() {
    const search = useSearchParams();
    const giftId = search.get("gift");

    if (!giftId) {
        return null;
    }

    return (
        <Suspense
            fallback={<Skeleton className="h-12 w-full rounded-lg mb-4" />}
        >
            <InnerGiftBanner giftId={giftId} />
        </Suspense>
    );
}

async function InnerGiftBanner({ giftId }: { giftId: string; }) {
    const gift = await getGift(giftId);

    if (!gift || "message" in gift) {
        return (
            <Notice message={gift?.message || "Gift not found"} />
        );
    }

    return (
        <Notice message={`${gift.days} day trial will be applied at checkout`} />
    );
}