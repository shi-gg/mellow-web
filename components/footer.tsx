import TopggIcon from "@/components/icons/topgg";
import { getUser } from "@/lib/discord/user";
import BlahajPic from "@/public/blahaj.webp";
import { cn } from "@/utils/cn";
import Image from "next/image";
import Link from "next/link";
import type { HTMLProps } from "react";
import { BiCopyright, BiLogoGithub, BiLogoGmail, BiLogoReddit, BiLogoYoutube } from "react-icons/bi";
import { BsDiscord } from "react-icons/bs";
import { FaBluesky } from "react-icons/fa6";
import { HiBookOpen, HiCloud, HiCube, HiGlobe, HiHand, HiLibrary, HiUserAdd } from "react-icons/hi";
import { SiDiscord, SiKofi } from "react-icons/si";

import { Badge } from "./ui/badge";

export async function Footer(props: HTMLProps<HTMLDivElement>) {

    // do not change
    const dev = await getUser("821472922140803112");

    return (
        <div
            className={cn("text-primary/75 w-full mt-10 text-left", props.className)}
            {...props}
        >

            <div className="flex items-center gap-1 font-semibold">
                <BsDiscord className="relative top-px text-[#f8746e]" />
                <span className="text-xl bg-linear-to-r from-red-400 to-yellow-400 bg-clip-text text-transparent">Wamellow</span>
                <span className="text-xl bg-linear-to-r from-yellow-400 to-blue-400 bg-clip-text text-transparent">for</span>
                <span className="text-xl bg-linear-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Discord</span>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-2 justify-between">
                <div>
                    <div className="mb-3">
                        <span className="flex gap-1 items-center">
                            <BiCopyright />
                            <span>
                                <Link href="/" className="hover:underline">Wamellow {new Date(1_635_609_600_000).getFullYear()} - {new Date().getFullYear()}</Link>,
                                not affiliated with Discord Inc.
                            </span>
                        </span>
                        <span className="flex gap-1 items-center">
                            <HiCube />
                            <span className="flex items-center">
                                Made by
                                <Link href="/team">
                                    <Badge
                                        className="relative top-[3px] ml-0.5"
                                        radius="rounded"
                                    >
                                        <Image
                                            src={dev?.avatarUrl || "/discord.webp"}
                                            alt="avatar"
                                            width={18}
                                            height={18}
                                            className="rounded-full relative right-1.5 px-px"
                                        />
                                        {dev?.username}
                                    </Badge>
                                </Link>
                            </span>
                        </span>
                    </div>

                    <Socials />
                </div>

                <Links />
            </div>

            <Link
                className="w-full flex justify-center mt-20 mb-4 hover:rotate-2 duration-500"
                href="https://blahaj.4k.pics"
                target="_blank"
            >
                <Image
                    alt="Blahaj"
                    src={BlahajPic}
                    height={Math.round(775 / 2)}
                    width={1_500 / 2}
                />
            </Link>
        </div>
    );
}

function Socials() {
    return (
        <div className="ml-auto svg-max flex flex-wrap items-center gap-2 mt-2 md:mt-0">
            <Link href="https://discord.com/discovery/applications/1125449347451068437" className="text-white/75 hover:text-white duration-200 size-5" aria-label="Wamellow in the Discord Bot Directory">
                <SiDiscord />
            </Link>
            <Link href="https://youtube.com/@wamellow" className="text-white/75 hover:text-white duration-200 size-6" aria-label="Wamellow on YouTube">
                <BiLogoYoutube />
            </Link>
            <Link href="https://bsky.app/profile/shi.gg" className="text-white/75 hover:text-white duration-200 size-6" aria-label="Wamellow on Twitter (X.com)">
                <FaBluesky className="p-0.5" />
            </Link>
            <Link href="https://github.com/shi-gg" className="text-white/75 hover:text-white duration-200 size-6" aria-label="Wamellow's developers on GitHub">
                <BiLogoGithub />
            </Link>
            <Link href="https://reddit.com/r/wamellow" className="text-white/75 hover:text-white duration-200 size-6" aria-label="Wamellow on Reddit">
                <BiLogoReddit />
            </Link>
            <Link href="mailto:support@wamellow.com" className="text-white/75 hover:text-white duration-200 size-6" aria-label="Contact Wamellow via email">
                <BiLogoGmail />
            </Link>
            <Link href="https://ko-fi.com/mwlica" className="text-white/75 hover:text-white duration-200 h-[22px] w-[22px]" aria-label="Support Wamellow's developers monetarily on Kofi">
                <SiKofi />
            </Link>
            <Link href="/vote" className="text-[#ff3366] duration-200 size-6" aria-label="Vote for Wamellow on top.gg">
                <TopggIcon />
            </Link>
        </div>
    );
}

function Links() {
    return (
        <div className="flex gap-12 dark:text-neutral-400 text-neutral-600 select-none">
            <div>
                <div className="font-medium dark:text-neutral-200 text-neutral-800 mb-1">Legal blah blah</div>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/terms"
                >
                    <HiLibrary />
                    Terms of Service
                </Link>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/privacy"
                >
                    <HiHand />
                    Privacy Policy
                </Link>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/impressum"
                >
                    <HiGlobe />
                    Impressum
                </Link>
            </div>
            <div>
                <div className="font-medium dark:text-neutral-200 text-neutral-800 mb-1">Links</div>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/support"
                >
                    <BsDiscord />
                    Support
                </Link>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/docs/index"
                >
                    <HiBookOpen />
                    Documentation
                </Link>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/status"
                >
                    <HiCloud />
                    Status
                </Link>
                <Link
                    className="text-primary/75 hover:text-primary/65 duration-200 flex items-center gap-2"
                    href="/login?invite=true"
                    prefetch={false}
                >
                    <HiUserAdd />
                    Invite
                </Link>
            </div>
        </div>
    );
}