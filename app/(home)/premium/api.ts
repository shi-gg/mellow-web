import { defaultFetchOptions } from "@/lib/api";
import type { ApiError } from "@/typings";

export interface ApiV1GiftGetResponse {
    id: string;

    creatorId: string;
    recipientId: string | null;

    days: number;

    createdAt: string;
}

export async function getGift(giftId: string): Promise<ApiV1GiftGetResponse | ApiError | null> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/gifts/${giftId}`,
        {
            ...defaultFetchOptions,
            next: { revalidate: 1 }
        }
    );

    if (!res.ok) return null;
    return res.json();
}