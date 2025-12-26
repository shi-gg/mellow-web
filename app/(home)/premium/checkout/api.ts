import type { ApiError } from "@/typings";

interface CheckoutResponse {
    url: string;
}

export async function createCheckout(
    session: string,
    body: {
        donationQuantity: number;
        giftId: string | null;
        referer: string | null;
    }
) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/billing/subscriptions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`
        },
        body: JSON.stringify(body)
    });

    const res = await response.json() as CheckoutResponse | ApiError;

    if ("message" in res || !res.url) throw new Error("message" in res && res.message ? res.message : "unknown error");
    return res.url;
}