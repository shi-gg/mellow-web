import { cn } from "@/utils/cn";
import { Patrick_Hand } from "next/font/google";
import Image, { type StaticImageData } from "next/image";
import { HiChevronRight } from "react-icons/hi";

const handwritten = Patrick_Hand({ subsets: ["latin"], weight: "400" });

interface Props {
    username: string;
    bio?: React.ReactNode;
    avatar: string | StaticImageData;
    content: string | React.ReactNode;
}

export default function Comment({
    username,
    bio,
    avatar,
    content
}: Props) {
    return (
        <div className="w-full mb-6 mt-9">
            <div className="flex gap-4 items-center mb-2">
                <span className="flex items-center gap-3">
                    <Image
                        alt={`${username}'s profile picture`}
                        className="size-12 rounded-full"
                        height={64}
                        src={avatar}
                        width={64}
                    />
                    <div>
                        <p className="text-xl font-semibold text-foreground -mb-0.5">
                            {username}
                        </p>
                        <p className="text-muted-foreground">
                            {bio}
                        </p>
                    </div>
                </span>
                <HiChevronRight className="size-8 text-muted-foreground" />
            </div>
            <span className={cn(handwritten.className, "text-2xl wrap-break-words")}>
                „{content}“
            </span>
        </div>
    );
}