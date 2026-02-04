import { cn } from "@/utils/cn";
import { HiCheck } from "react-icons/hi";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "large";
}

export default function DiscordAppBadge({
    className,
    children,
    variant = "default",
    ...props
}: Props) {
    return (
        <div
            className={cn(
                "text-xxs! text-white bg-blurple rounded-sm py-px px-1 h-4 inline-flex items-center",
                variant === "large" && "h-10 px-3 text-lg! rounded-md",
                className
            )}
            {...props}
        >
            <HiCheck className={cn(variant === "large" && "size-6")} />
            <span className={cn("ml-1 font-semibold", variant === "large" && "ml-2")}>
                {children || "APP"}
            </span>
        </div>
    );
}