"use client";

import { guildStore } from "@/common/guilds";
import { ControlledInput } from "@/components/inputs/controlled-input";
import { InputSelect } from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import { Section } from "@/components/section";
import { type ApiV1GuildsModulesNotificationsGetResponse, NotificationType } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";
import { useState } from "react";

const URL_CHANNEL_REGEX = /^https?:\/\/((www|m|old|oauth)\.)?reddit\.com\/r\/(?=.{3,21}$)[A-Za-z]\w*\/?$/;
const CHANNE_HANDLE = /^((\/)?r\/)?(?=.{3,21}$)[A-Za-z]\w*$/;

function validateAccount(input: string) {
    if (URL_CHANNEL_REGEX.test(input)) return input.split("/r/")[1].replace(/\/$/, "");
    if (CHANNE_HANDLE.test(input)) return input.replace(/^(\/)?r\//, "");
    return null;
}

interface Props {
    add: (notification: ApiV1GuildsModulesNotificationsGetResponse) => void;
    set: (id: string) => void;

    isOpen: boolean;
    onClose: () => void;
}

export function RedditNotificationModal({
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
                if (!validated && name.startsWith("https://")) return new Error("Invalid subreddit url");
                if (!validated) return new Error("Invalid subreddit name");

                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: NotificationType.Reddit,
                        channelId,
                        creatorHandle: validated
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
                label="Subreddit"
                placeholder="r/wamellow"
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

            <Section tight title="How to get a subreddit name">
                The name is the string with the leading <code className="break-all">r/</code>, such as <code>r/wamellow</code>.
                <br />
                <br />

                Though, you can also use the link of the subreddit.
            </Section>
        </Modal>
    </>);
}