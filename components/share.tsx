import Link from "next/link";
import { BsTwitter } from "react-icons/bs";
import { HiShare } from "react-icons/hi";
import { SiBluesky } from "react-icons/si";

import { CopyToClipboardButton } from "./copy-to-clipboard";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const FIRST_WORD_CHAR_REGEX = /^\w/;

const PLATFORMS = ["twitter", "bluesky"] as const;

export function Share({
    title,
    url,
    text
}: {
    title: string;
    url: string;
    text: string;
}) {
    return (
        <div className="flex gap-2">
            <CopyToClipboardButton
                title={title}
                text={url}
                icon={<HiShare />}
            />

            {PLATFORMS.map((platform) => (
                <ShareButton
                    key={platform}
                    platform={platform}
                    url={url}
                    text={text}
                />
            ))}
        </div>
    );
}

function ShareButton({
    platform,
    url,
    text
}: {
    platform: string;
    url: string;
    text: string;
}) {
    const intentUrl = getIntentLink(platform, url, text + "\n");

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button asChild>
                    <Link
                        href={intentUrl}
                        target="_blank"
                    >
                        <Icon platform={platform} />
                    </Link>
                </Button>
            </TooltipTrigger>

            <TooltipContent>
                Share on {platform.replace(FIRST_WORD_CHAR_REGEX, (char) => char.toUpperCase())}
            </TooltipContent>
        </Tooltip>
    );
}

function getIntentLink(platform: string, url: string, text: string) {
    switch (platform) {
        case "twitter": return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        case "bluesky": return `https://bsky.app/intent/compose?text=${encodeURIComponent(text + url)}`;
    }

    return "";
}

function Icon({ platform }: { platform: string; }) {
    switch (platform) {
        case "twitter": return <BsTwitter />;
        case "bluesky": return <SiBluesky />;
    }
}