"use client";

import Ad from "@/components/ad";
import Modal from "@/components/modal";
import Notice, { NoticeType } from "@/components/notice";
import { Share } from "@/components/share";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Code } from "@/components/ui/typography";
import type { ApiError, ApiV1GuildsGetResponse, ApiV1GuildsTopmembersPaginationGetResponse } from "@/typings";
import { intl } from "@/utils/numbers";
import { getCanonicalUrl } from "@/utils/urls";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useState } from "react";
import { BsDiscord } from "react-icons/bs";
import { HiAnnotation, HiLink, HiTrash, HiViewGridAdd, HiVolumeUp } from "react-icons/hi";

export default function Side({
    guild,
    pagination
}: {
    guild: ApiV1GuildsGetResponse | ApiError | undefined;
    pagination: ApiV1GuildsTopmembersPaginationGetResponse | ApiError | undefined;
}) {
    const cookies = useCookies();
    const router = useRouter();

    const [modal, setModal] = useState(false);

    return (
        <div className="flex flex-col gap-3">

            {guild && "id" in guild &&
                <Share
                    title="Share leaderboard"
                    url={getCanonicalUrl("leaderboard", guild.id)}
                    text={`Check out the leaderboard for ${guild.name} on #wamellow! ${guild.inviteUrl ? `Join ${guild.inviteUrl.split("://")[1]} and get to be the top #discord member :p` : ""}`}
                />
            }

            {guild && "inviteUrl" in guild && guild.inviteUrl &&
                <Button
                    asChild
                    className="justify-start"
                    variant="secondary"
                >
                    <Link
                        href={guild.inviteUrl}
                        target="_blank"
                    >
                        <BsDiscord />
                        Join {guild.name}
                    </Link>
                </Button>
            }

            <Ad />

            <Accordion
                type="multiple"
                defaultValue={["1", "2", "3"]}
            >
                {guild && "id" in guild && cookies.get("devTools") && (
                    <AccordionItem value="1">
                        <AccordionTrigger>Admin tools</AccordionTrigger>
                        <AccordionContent className="mb-2">
                            <Button
                                className="w-full justify-start"
                                onClick={() => setModal(true)}
                            >
                                <HiTrash />
                                Reset member stats
                            </Button>
                            <Button
                                asChild
                                className="w-full justify-start mt-2"
                            >
                                <Link
                                    href={getCanonicalUrl("dashboard", guild.id)}
                                >
                                    <HiViewGridAdd />
                                    Dashboard
                                </Link>
                            </Button>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {pagination && "messages" in pagination && (
                    <AccordionItem value="3">
                        <AccordionTrigger>About {guild && "name" in guild ? guild?.name : "this server"}</AccordionTrigger>
                        <AccordionContent className="mb-2">
                            {guild && "description" in guild && (guild as { description?: string | null; }).description && (
                                <p className="mb-6">
                                    {guild.description as string}
                                </p>
                            )}

                            <div className="flex items-center gap-1">
                                <HiAnnotation className="mr-1" />
                                <span className="font-semibold">{intl.format(pagination.messages.total)}</span> messages
                            </div>
                            <div className="flex items-center gap-1">
                                <HiVolumeUp className="mr-1" />
                                <span className="font-semibold">{pagination.voiceminutes.formattedTotal}</span> in voice
                            </div>
                            <div className="flex items-center gap-1">
                                <HiLink className="mr-1" />
                                <span className="font-semibold"> {intl.format(pagination.invites.total)}</span> invites
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                <AccordionItem value="2">
                    <AccordionTrigger>How this works</AccordionTrigger>
                    <AccordionContent className="mb-2">
                        Users are sorted from most to least active for each category, updates once per minute.
                        <br />
                        <br />
                        The percentage {
                            cookies.get("lbc") === "server"
                                ? "reflects the contribution of server activity from that user"
                                : "indicates the gap in messages needed to surpass the next user"
                        }.
                    </AccordionContent>
                </AccordionItem>

                {guild && "id" in guild && guild?.inviteUrl && (
                    <AccordionItem value="4">
                        <AccordionTrigger>Invite privacy</AccordionTrigger>
                        <AccordionContent className="mb-2">
                            The invite on this sidebar is taken from the widget, if you want to remove the invite from this page, disable the widget in your discord server settings or remove <Code>Manage Guild</Code> permission from the bot.
                            <br />
                            <br />
                            <strong>NOTE: </strong> It might take up to an hour for this page to update.
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>

            <Modal
                title="Reset @everyone's stats"
                buttonName="Reset"
                variant="destructive"
                isOpen={modal}
                onClose={() => setModal(false)}
                onSubmit={() => {
                    return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild && "id" in guild ? guild?.id : ""}/top-members`, {
                        method: "DELETE",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                }}
                onSuccess={() => {
                    router.refresh();
                }}
            >
                <Notice
                    type={NoticeType.Info}
                    message="Takes a few seconds to apply"
                />
                Are you sure you want to delete the leaderboard? It will be gone forever, probably, who knows.
            </Modal>
        </div>
    );
}