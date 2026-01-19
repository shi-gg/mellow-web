"use client";

import { ControlledInput } from "@/components/inputs/controlled-input";
import Modal from "@/components/modal";
import Notice from "@/components/notice";
import { Button } from "@/components/ui/button";
import type { ApiV1GuildsModulesTagsGetResponse } from "@/typings";
import { useState } from "react";
import { HiPencil } from "react-icons/hi";

export enum Style {
    Compact = 1,
    Big = 2
}

interface Props {
    guildId: string;
    style: Style;

    addTag: (tag: ApiV1GuildsModulesTagsGetResponse) => void;
    setTagId: (id: string) => void;
}

export function CreateTag({ guildId, style, addTag, setTagId }: Props) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");

    return (<>
        {style === Style.Compact
            ?
            <Button
                className="rounded-full h-8"
                onClick={() => setOpen(true)}
            >
                <HiPencil />
                Create
            </Button>
            :
            <Button
                variant="secondary"
                onClick={() => setOpen(true)}
            >
                <HiPencil />
                Create a new Tag
            </Button>
        }

        <Modal<ApiV1GuildsModulesTagsGetResponse>
            title="Create new tag"
            isOpen={open}
            onClose={() => setOpen(false)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/tags`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ name: name.trim() || "new-tag" })
                });
            }}
            onSuccess={(tag) => {
                addTag(tag);
                setTagId(tag.id);
            }}
            isDisabled={!name}
        >
            <Notice message="Start the name with a '/' to create a slash command" />

            <ControlledInput
                label="Command Name"
                placeholder="new-tag"
                value={name}
                setValue={(val) => setName((val || "").toLowerCase())}
                max={32}
            />
        </Modal>
    </>);
}