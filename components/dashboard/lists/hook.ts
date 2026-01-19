import { cacheOptions, getData } from "@/lib/api";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";

interface UseDataQueryOptions {
    url: string;
}

export function useList<T extends { id: string; }>({ url }: UseDataQueryOptions) {
    const router = useRouter();
    const params = useParams();
    const search = useSearchParams();
    const pathname = usePathname();

    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery(
        url,
        () => getData<T[]>(url),
        {
            enabled: Boolean(params.guildId),
            ...cacheOptions
        }
    );

    const itemId = search.get("id") as string;
    const item = (Array.isArray(data) ? data : []).find((i) => i.id === itemId);

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(search);
            params.set(name, value);

            return params.toString();
        },
        [search]
    );

    const setItemId = useCallback(
        (id: string) => router.push(`${pathname}?${createQueryString("id", id)}`),
        [router, pathname, createQueryString]
    );

    const editItem = useCallback(
        <K extends keyof T>(key: K, value: T[K]) => {
            if (!item || !Array.isArray(data)) return;

            queryClient.setQueryData<T[]>(url, () => [
                ...(data?.filter((t) => t.id !== item.id) || []),
                { ...item, [key]: value }
            ]);
        },
        [item, data, url, queryClient]
    );

    const editObj = useCallback(
        <K extends keyof T>(payload: Record<K, T[K]>) => {
            if (!item || !Array.isArray(data)) return;

            queryClient.setQueryData<T[]>(url, () => [
                ...(data?.filter((t) => t.id !== item.id) || []),
                { ...item, ...payload }
            ]);
        },
        [item, data, url, queryClient]
    );

    const addItem = useCallback(
        (newItem: T) => {
            if (!Array.isArray(data)) return;

            queryClient.setQueryData<T[]>(url, () => [
                ...(data || []),
                newItem
            ]);
        },
        [data, url, queryClient]
    );

    const removeItem = useCallback(
        (id: string) => {
            if (!Array.isArray(data)) return;

            queryClient.setQueryData<T[]>(url, () =>
                data?.filter((t) => t.id !== id) || []
            );
        },
        [data, url, queryClient]
    );

    return {
        item,
        items: Array.isArray(data) ? data : [],
        setItemId,
        editItem,
        editObj,
        addItem,
        removeItem,
        isLoading,
        error: error as string || (data && "message" in data ? JSON.stringify(data.message) : (error ? `${error}` : undefined))
    };
}