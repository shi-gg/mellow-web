import { cn } from "@/utils/cn";
import { HiExclamation, HiExclamationCircle } from "react-icons/hi";

import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export enum NoticeType {
    Info = 0,
    Error = 1
}

interface Props {
    icon?: React.ReactNode;
    message: string;
    type?: NoticeType | typeof NoticeType;
    location?: "side" | "bottom";
    children?: React.ReactNode;
}

export default function Notice({
    icon,
    message,
    type = NoticeType.Info,
    location = "side",
    children
}: Props) {

    return (
        <Alert
            variant={type === NoticeType.Info ? "secondary" : "destructive"}
            className={cn("mb-4", location === "side" && "flex")}
        >
            {icon || (type === NoticeType.Info
                ? <HiExclamationCircle className="size-4" />
                : <HiExclamation className="size-4" />
            )}

            <AlertTitle className={cn(location !== "bottom" && "mb-0")}>
                {message}
            </AlertTitle>

            {children && (
                <AlertDescription
                    className={cn(location === "side" && "ml-auto")}
                >
                    {children}
                </AlertDescription>
            )}
        </Alert>
    );
}