"use client";

import { guildStore } from "@/common/guilds";
import { ControlledInput } from "@/components/inputs/controlled-input";
import { InputSelect } from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import { Section } from "@/components/section";
import { type ApiV1GuildsModulesNotificationsGetResponse, NotificationType } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";
import { useState } from "react";

const URL_CHANNEL_REGEX = /^https?:\/\/((www|m)\.)?bsky\.app\/profile\/did:plc:[\da-z]{20,30}$/;
const URL_HANDLE_REGEX = /^https?:\/\/((www|m)\.)?bsky\.app\/profile\/[\dA-Za-z-]+(\.[\dA-Za-z-]+)+$/;
const CHANNEL_ID = /^did:plc:[\da-z]{20,30}$/;
const CHANNE_HANDLE = /^@?[\dA-Za-z-]+(\.[\dA-Za-z-]+)+$/;

function validateAccount(input: string) {
    if (URL_CHANNEL_REGEX.test(input)) return input.split("/profile/")[1];
    if (URL_HANDLE_REGEX.test(input)) return input.split("/profile/")[1];

    if (CHANNEL_ID.test(input)) return input;
    if (CHANNE_HANDLE.test(input)) return input.replace("@", "");

    return null;
}

interface Props {
    add: (notification: ApiV1GuildsModulesNotificationsGetResponse) => void;
    set: (id: string) => void;

    isOpen: boolean;
    onClose: () => void;
}

export function BlueskyNotificationModal({
    add,
    set,

    isOpen,
    onClose
}: Props) {
    const guildId = guildStore((g) => g?.id);
    const channels = guildStore((g) => g?.channels);

    const [name, setName] = useState("");
    const [channelId, setChannelId] = useState<string | null>(null);

    return (<>
        <Modal<ApiV1GuildsModulesNotificationsGetResponse>
            title="Create new notification"
            isOpen={isOpen}
            onClose={onClose}
            onSubmit={() => {
                const validated = validateAccount(name);
                if (!validated && name.startsWith("https://")) return new Error("Invalid channel url");
                if (!validated) return new Error("Invalid channel id or handle");

                const isId = CHANNEL_ID.exec(validated);

                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: NotificationType.Bluesky,
                        channelId,
                        creatorHandle: isId ? undefined : validated,
                        creatorId: isId ? validated : undefined
                    })
                });
            }}
            onSuccess={(tag) => {
                add(tag);
                set(tag.id);

                setName("");
                setChannelId(null);
            }}
            isDisabled={!name || !channelId}
        >
            <ControlledInput
                name="Bluesky user"
                placeholder="wamellow.bsky.social"
                value={name}
                setValue={setName}
            />

            <InputSelect
                label="Channel"
                items={createSelectableItems(channels)}
                description="Select a channel where notifications should be send into."
                onSave={(o) => {
                    setChannelId(o as string);
                }}
            />

            <Section tight title="How to get a users handle">
                Your handle is likely something like <code className="break-all">tolgchu.bsky.social</code>, some others may have a handle like <code>shi.gg</code>.
                <br />
                <br />

                Though, you can also use the link of the user&apos;s profile.
            </Section>
        </Modal>
    </>);
}