import type { ApiError } from "@/typings";

type Body = undefined | FormData | Record<string, unknown>;

export class ApiClient {
    constructor(private baseUrl: string) { }

    private async request<T extends object>(method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE", path: string, body?: Body): Promise<{ data: T; error: null; } | { data: null; error: string; }> {
        const headers: Record<string, string> = {};

        if (body && !(body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }

        const response = await fetch(`${this.baseUrl}${path}`, {
            credentials: "include",
            method,
            body: !body || body instanceof FormData ? body : JSON.stringify(body),
            headers
        });

        if (!response.headers.get("Content-Type")?.toLowerCase()?.startsWith("application/json")) {
            return { data: null, error: response.statusText };
        }

        const data = await response.json() as T | ApiError;

        if (data && "message" in data) {
            return { data: null, error: data.message };
        }

        return { data, error: null };
    }

    get<T extends object>(path: string) {
        return this.request<T>("GET", path);
    }

    post<T extends object>(path: string, body?: Body) {
        return this.request<T>("POST", path, body);
    }

    patch<T extends object>(path: string, body?: Body) {
        return this.request<T>("PATCH", path, body);
    }

    put<T extends object>(path: string, body?: Body) {
        return this.request<T>("PUT", path, body);
    }

    delete<T extends object>(path: string) {
        return this.request<T>("DELETE", path);
    }
}