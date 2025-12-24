"use client";

import { guildStore } from "@/common/guilds";
import SelectMenu from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import { createSelectableItems } from "@/utils/create-selectable-items";
import { useState } from "react";
import { HiMail } from "react-icons/hi";

export default function FollowUpdates() {
    const guild = guildStore((g) => g);

    const [open, setOpen] = useState(false);
    const [channelId, setChannelId] = useState<string>();

    return (<>
        <div>
            <div className="text-sm mb-0.5">
                Posting updates {guild?.follownewsChannel?.name && "into"}
            </div>

            {guild?.follownewsChannel?.name &&
                <div className="text-2xl dark:text-neutral-100 text-neutral-900 font-medium">
                    #{guild?.follownewsChannel?.name}
                </div>
            }

            <button
                className="flex dark:text-violet-400/60 dark:hover:text-violet-400/90 text-violet-600/60 hover:text-violet-600/90 duration-200"
                onClick={() => setOpen(true)}
            >
                <HiMail className="relative top-1" />
                <span className="ml-2">
                    {guild?.follownewsChannel?.name
                        ? "Change "
                        : "Set "
                    }
                    channel
                </span>
            </button>
        </div>

        <Modal
            title="Wamellow updates"
            className="overflow-visible!"
            isOpen={open && Boolean(guild)}
            onClose={() => setOpen(false)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild?.id}/follow-updates`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        channelId
                    })
                });
            }}
            onSuccess={() => {
                guildStore.setState((g) => {
                    if (!g) return g;
                    const channel = g.channels?.find((c) => c.id === channelId);
                    return {
                        ...g,
                        follownewsChannel: {
                            name: channel?.name ?? "",
                            id: channelId!
                        }
                    };
                });
            }}
            isDisabled={!channelId}
        >
            <SelectMenu
                name="Channel"
                dataName="channelId"
                items={createSelectableItems(guild?.channels, ["ViewChannel", "ManageWebhooks"])}
                description="Select a channel where updates should be send into."
                defaultState={guild?.follownewsChannel?.id}
                onSave={(o) => {
                    setChannelId(o.value as string);
                }}
            />
        </Modal>
    </>);
}