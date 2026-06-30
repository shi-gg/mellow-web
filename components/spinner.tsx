import { cn } from "@/utils/cn";
import { LoaderCircleIcon } from "lucide-react";

export function Spinner({ className = "" }: { className?: string; }) {
    return (
        <LoaderCircleIcon className={cn("animate-spin size-8", className)} strokeWidth={2.5} />
    );
}