import { getUser } from "@/lib/discord/user";
import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import type { AnchorHTMLAttributes, DetailedHTMLProps, HTMLAttributes } from "react";

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
type LinkProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

export async function Person({
    id,
    social,
    compact
}: {
    id: string;
    social?: string;
    compact?: boolean;
}) {
    const user = await getUser(id);
    if (!user) return;

    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${user.avatar?.startsWith("a_") ? "gif" : "webp"}?size=64`
        : "/discord.webp";

    if (compact) {
        return (
            <Image
                alt={user.username}
                className="rounded-full shrink-0 aspect-square size-10"
                height={48}
                src={avatarUrl}
                width={48}
            />
        );
    }

    return (
        <Linkish
            className={cn(
                "flex items-center gap-3 h-14 px-2 pl-1.25 pr-4 hover:bg-wamellow rounded-full cursor-default",
                social && "duration-100 outline-violet-500 hover:outline-solid cursor-pointer"
            )}
            href={social}
            target={social && "_blank"}
        >
            <Image
                alt={user.username}
                className="rounded-full shrink-0 aspect-square size-11"
                height={48}
                src={avatarUrl}
                width={48}
            />

            <div className="mr-2">
                <div className="text-lg text-neutral-200 font-semibold -mb-1.5">{user.globalName || user.username}</div>
                <span className="text-muted-foreground">{user.username}</span>
            </div>
        </Linkish>
    );
}

function isLinkProps(props: DivProps | LinkProps): props is LinkProps {
    return "href" in props && Boolean(props.href);
}

function Linkish(props: DivProps | LinkProps) {
    if (isLinkProps(props)) {
        return <Link href={props.href as string} {...props}>{props.children}</Link>;
    }

    return <div {...props}>{props.children}</div>;
}