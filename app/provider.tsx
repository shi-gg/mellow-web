"use client";

import { guildStore } from "@/common/guilds";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/utils/cn";
import { usePathname } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

interface Props {
    children: React.ReactNode;
    className?: string;
}

export function Provider({ children, className }: Props) {
    const cookies = useCookies();
    const path = usePathname();

    useEffect(() => {
        cookies.set(
            "lastpage",
            path,
            {
                secure: process.env.NEXT_PUBLIC_BASE_URL?.startsWith("https://"),
                sameSite: "none",
                domain: process.env.NEXT_PUBLIC_BASE_URL?.split("://")[1],
                expires: 28
            }
        );

        if (!path.startsWith("/dashboard/")) guildStore.setState(undefined);
    }, [path, cookies]);

    return (
        <TooltipProvider>
            <QueryClientProvider client={queryClient}>
                <main className={cn("text-neutral-400 flex flex-col items-center justify-between md:p-5 p-3 w-full max-w-7xl mt-2 md:mt-10", className)}>
                    {children}
                </main>
            </QueryClientProvider>
        </TooltipProvider>
    );
}