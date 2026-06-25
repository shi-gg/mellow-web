import { defaultFetchOptions } from "@/lib/api";
import type { ApiError } from "@/typings";

export interface ApiCluster {
    id: number;
    name: string;
    ping: number;
    uptime: string;
    memory: number;
    guilds: number;
    users: number;
}

export interface ApiNode {
    id: string;
    uptime: string;
    memory: number;
    players: number;
}

export interface ApiV1StatusGetResponse {
    clusters: ApiCluster[];
    nodes: ApiNode[];
}

export async function getStatus(): Promise<ApiV1StatusGetResponse | ApiError | null> {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/status`,
        {
            ...defaultFetchOptions,
            next: { revalidate: 60 }
        }
    );

    if (!res.ok) return null;
    return res.json();
}