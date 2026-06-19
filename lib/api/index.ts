import type { ApiError, ApiV1GuildsGetResponse } from "@/typings";

export interface ApiRequestOptions {
    force?: boolean;
}

export const cacheOptions = {
    gcTime: 1_000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false
};

export const defaultFetchOptions = {
    headers: { Authorization: process.env.API_SECRET as string },
    next: { revalidate: 60 * 60 }
};

export async function getData<T>(path: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}${path}`, {
        credentials: "include"
    });

    return response.json() as Promise<T | ApiError>;
}

export async function getGuild(guildId?: string | null, options?: ApiRequestOptions): Promise<ApiV1GuildsGetResponse | ApiError | undefined> {
    if (!guildId) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}`, {
        headers: { Authorization: process.env.API_SECRET as string },
        next: options?.force
            ? { revalidate: 0 }
            : { revalidate: 60 * 60 }
    });

    return res.json();
}