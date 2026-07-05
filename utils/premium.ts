import type { ApiV1UsersMeBillingGetResponse } from "@/typings";

export enum PremiumPeriod {
    Month = "month",
    Year = "year"
}

export const PERIODS = [PremiumPeriod.Month, PremiumPeriod.Year] as const;
export const MONTHLY_PRICES = [4, 8, 12, 18, 25] as const;
export const YEARLY_PRICES = [40, 50, 60, 80, 100] as const;
export const MAX_PREMIUM_GUILDS = 1;

export function isActive(status: ApiV1UsersMeBillingGetResponse["status"]): status is "active" | "trialing" | "past_due" {
    return status === "active" || status === "trialing" || status === "past_due";
}