"use client";

import { guildStore } from "@/common/guilds";
import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { HiTrash } from "react-icons/hi";

interface Props {
    id: string | null;
    name: string;

    remove: (id: string) => void;
}

export function DeleteNotification({
    id,
    name,

    remove
}: Props) {
    const guildId = guildStore((g) => g?.id);
    const [open, setOpen] = useState(false);

    return (<>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setOpen(true)}
                    disabled={!id}
                >
                    <HiTrash />
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>Delete Notification</p>
            </TooltipContent>
        </Tooltip>

        <Modal
            buttonName="Delete"
            variant="destructive"
            title={"Delete Notification: " + name}
            isOpen={open}
            onClose={() => setOpen(false)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guildId}/modules/notifications/${id}`, {
                    method: "DELETE",
                    credentials: "include"
                });
            }}
            onSuccess={() => {
                if (id) remove(id);
            }}
        >
            Are you sure you want to delete the {"\""}{name}{"\""} channel from posting notifications? It will be gone forever, probably, who knows.
        </Modal>
    </>);
}