import { cacheOptions, getData } from "@/lib/api";
import { useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";

export type ApiEdit<T> = <K extends keyof T>(key: K, value: T[K]) => void;

export function useApi<T>(url: string, enabled?: boolean) {

    const { data, isLoading, error, ...props } = useQuery(
        url,
        () => getData<T>(url),
        {
            enabled: enabled || true,
            ...cacheOptions
        }
    );

    const queryClient = useQueryClient();

    const edit = useCallback(
        <K extends keyof T>(key: K, value: T[K]) => {
            queryClient.setQueryData<T>(url, () => ({
                ...data,
                [key]: value
            } as T));
        },
        [data, queryClient, url]
    );

    if (data && typeof data === "object" && "message" in data && typeof data.message === "string") {
        return { data: undefined, isLoading, error: data.message || "unknown error", edit, ...props };
    }

    return {
        data: data as T,
        isLoading,
        error: error ? `${error}` : undefined,
        edit,
        ...props
    };
}