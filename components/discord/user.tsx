import { cn } from "@/utils/cn";
import { BsMicMuteFill } from "react-icons/bs";

import DiscordAppBadge from "./app-badge";
import { UserAvatar } from "../ui/avatar";

interface Props {
    username: string;
    avatar: string;
    isBot?: boolean;
    isTalking?: boolean;
    isMuted?: boolean;
}

export default function DiscordUser({
    username,
    avatar,
    isBot,
    isTalking,
    isMuted
}: Props) {
    return (
        <div className={cn("flex items-center space-x-2", isTalking && "text-primary-foreground")}>
            <UserAvatar
                alt={`${username}'s avatar`}
                className={cn("size-6 shrink-0", isTalking && "outline-2 outline-green-500")}
                src={avatar}
                username={username}
            />
            <div className="font-medium whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer" >
                {username}
            </div>
            {isBot && (
                <DiscordAppBadge />
            )}
            {isMuted && !isTalking && (
                <BsMicMuteFill className="ml-auto" />
            )}
        </div>
    );
}