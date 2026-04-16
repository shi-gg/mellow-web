import { defaultFetchOptions } from "@/lib/api";
import type { ApiError } from "@/typings";

export async function getBillingDonators(): Promise<string[] | ApiError | null> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/billing/donations/donors`,
        {
            ...defaultFetchOptions,
            next: { revalidate: 60 }
        }
    );

    if (!res.ok) return null;
    return res.json();
}