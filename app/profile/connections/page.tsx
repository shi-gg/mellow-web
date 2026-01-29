"use client";

import { ControlledInput } from "@/components/inputs/controlled-input";
import Modal from "@/components/modal";
import Notice, { NoticeType } from "@/components/notice";
import { ScreenMessage } from "@/components/screen-message";
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/api/hook";
import { type ApiV1UsersMeConnectionsGetResponse, ConnectionType } from "@/typings";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { useState } from "react";
import { BsSpotify } from "react-icons/bs";
import { HiFingerPrint, HiTrash } from "react-icons/hi";
import { SiBluesky } from "react-icons/si";

const CONNECTION_TYPES = Object
    .entries(ConnectionType)
    .filter(([key, value]) => typeof key === "string" && typeof value === "number") as [string, ConnectionType][];

export default function Home() {
    const url = "/users/@me/connections" as const;

    const { isLoading, data, error } = useApi<ApiV1UsersMeConnectionsGetResponse[]>(url);

    if (error) {
        return <ScreenMessage description={error} />;
    }

    if (isLoading || !data) return <></>;

    return (
        <div className="space-y-2">
            <Notice
                type={NoticeType.Info}
                message="This is still in testing, don&apos;t expect it to work properly yet!"
            />

            {CONNECTION_TYPES.map(([name, type]) => (
                <Connection key={name} name={name} type={type} data={data} />
            ))}
        </div>
    );
}

function Connection(
    { name, type, data }:
    { name: string; type: ConnectionType; data: ApiV1UsersMeConnectionsGetResponse[]; }
) {
    const connection = data.find((entry) => entry.type === type);
    const disabled = type === ConnectionType.Spotify && !connection;

    return (
        <div
            key={name}
            className="flex gap-3 justify-between p-4 bg-wamellow rounded-xl w-full"
        >
            {connection
                ? <Image
                    alt={`user's ${name} avatar`}
                    className="rounded-full size-12 shrink-0"
                    height={56}
                    src={connection?.avatar || "/discord.webp"}
                    width={56}
                />
                : (
                    <div className="bg-wamellow-100 rounded-full size-12 flex items-center justify-center text-neutral-300 shrink-0">
                        <Icon type={type} />
                    </div>
                )
            }

            <div className="truncate">
                <span className={cn("font-medium text-lg text-red-400 ", connection && "text-neutral-100")}>
                    {connection ? connection.username : "Not connected"}
                </span>
                <div className="flex items-center gap-1">
                    <Icon type={type} />
                    {name}
                </div>
            </div>

            <div className="ml-auto flex items-center">
                {type === ConnectionType.Bluesky && !connection && (
                    <BlueskyConnectPDS />
                )}

                <Button
                    onClick={() => {
                        if (disabled) return;
                        window.location.href = `/login/${name.toLowerCase()}${connection ? "?logout=true" : ""}`;
                    }}
                    disabled={disabled}
                >
                    {connection ? <HiTrash /> : <HiFingerPrint />}
                    {connection ? "Disconnect" : "Connect"}
                </Button>
            </div>
        </div>
    );
}

function Icon({ type }: { type: ConnectionType; }) {
    switch (type) {
        case ConnectionType.Spotify: return <BsSpotify />;
        case ConnectionType.Bluesky: return <SiBluesky />;
    }
}

function BlueskyConnectPDS() {
    const [handle, setHandle] = useState("");
    const [open, setOpen] = useState<boolean>(false);

    return (
        <div>
            <Button
                className="text-neutral-300 hidden sm:block"
                variant="link"
                onClick={() => setOpen(true)}
            >
                Connect using 3rd-party PDS
            </Button>

            <Modal
                title="Connect 3rd-party PDS"
                isOpen={open}
                onClose={() => setOpen(false)}
                onSubmit={() => {
                    window.location.href = `/login/bluesky?handle=${handle}`;
                    return undefined;
                }}
                buttonName="Continue"
            >
                <ControlledInput
                    label="Your Bluesky or Atproto Handle"
                    placeholder="shi.gg"
                    value={handle}
                    setValue={setHandle}
                />
            </Modal>
        </div>
    );
}