"use client";

import { guildStore } from "@/common/guilds";
import { CreateSplash } from "@/components/dashboard/lists/create-splash";
import { useList } from "@/components/dashboard/lists/hook";
import { Navigation } from "@/components/dashboard/lists/navigation";
import { ItemSelector } from "@/components/dashboard/lists/selector";
import { InputMultiSelect } from "@/components/inputs/multi-select-menu";
import { InputSelect } from "@/components/inputs/select-menu";
import { ScreenMessage } from "@/components/screen-message";
import type { ApiV1GuildsModulesDailypostsGetResponse } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { HiViewGridAdd } from "react-icons/hi";

import { CreateDailypost, Style } from "./create.component";
import { DeleteDailypost } from "./delete.component";
import { generateHourArray, typeToIcon, typeToName } from "./util";

export default function Home() {
    const guild = guildStore((g) => g);
    const params = useParams();

    const date = useMemo(() => new Date(), []);
    const hoursArray = useMemo(() => generateHourArray(date), [date]);

    const url = `/guilds/${params.guildId}/modules/dailyposts` as const;
    const {
        item,
        items,
        setItemId,
        editItem,
        addItem,
        removeItem,
        isLoading,
        error
    } = useList<ApiV1GuildsModulesDailypostsGetResponse>({ url });

    if (error) {
        return (
            <ScreenMessage
                top="20vh"
                title="Something went wrong on this page.."
                description={error}
                href={`/dashboard/${guild?.id}`}
                button="Go back to overview"
                icon={<HiViewGridAdd />}
            />
        );
    }

    if (isLoading || !items) return <></>;

    if (!item) {
        return (
            <ItemSelector<ApiV1GuildsModulesDailypostsGetResponse>
                items={items}

                set={setItemId}
                sort={(a, b) => a.type - b.type}
                name={(item) => typeToName(item.type)}

                docs="/dailyposts"

                createButton={(options) => (
                    <CreateDailypost
                        style={options.style}
                        add={addItem}
                        set={setItemId}
                    />
                )}

                deleteButton={(options) => (
                    <DeleteDailypost
                        id={options.id}
                        name={options.name}
                        remove={removeItem}
                    />
                )}

                item={(item) => {
                    const channel = guild?.channels?.find((channel) => channel.id === item.channelId);

                    return (<>
                        <Image
                            alt={`${typeToName} icon`}
                            className="rounded-full"
                            src={typeToIcon(item.type)}
                            width={46}
                            height={46}
                        />

                        <div className="flex flex-col items-start">
                            <span className="text-neutral-100 text-lg font-medium -mb-[0.5]">
                                {typeToName(item.type)}
                            </span>

                            <div className="bg-blurple/50 text-neutral-100 px-1 rounded-md">
                                #{channel?.name || "unknown"}
                            </div>
                        </div>
                    </>);
                }}
            >
                <CreateSplash
                    name="dailyposts"
                    description="Send cute characters into your channels daily."
                >
                    <CreateDailypost
                        style={Style.Big}
                        add={addItem}
                        set={setItemId}
                    />
                </CreateSplash>
            </ItemSelector>
        );
    }

    return (<>
        <Navigation
            href="/dailyposts"
            docs="/dailyposts"

            icon={
                <Image
                    alt={`${typeToName} icon`}
                    className="rounded-full size-5.5"
                    src={typeToIcon(item.type)}
                    width={24}
                    height={24}
                />
            }
            name={typeToName(item.type)}
        />

        <div className="flex md:gap-4 gap-2">
            <InputSelect
                label="Channel"
                endpoint={url + "/" + item.id}
                k="channelId"
                items={createSelectableItems(guild?.channels, ["ViewChannel", "SendMessages", "AttachFiles"])}
                description="Select a channel where dailyposts should be send into."
                defaultState={item.channelId}
                onSave={(o) => editItem("channelId", o as string)}
            />

            {/* <Fetch
                className="w-1/3 md:w-1/6 relative top-8"
                url={url + "/" + item.id + "/test"}
                icon={<HiChat className="min-h-4 min-w-4" />}
                label="Test Message"
                method="POST"
                size="lg"
            /> */}
        </div>

        <div className="lg:flex gap-3">
            <InputSelect
                className="lg:w-1/2 w-full"
                label="Ping role"
                endpoint={url + "/" + item.id}
                k="roleId"
                items={[
                    { name: "@everyone (everyone in server)", value: "everyone" },
                    { name: "@here (everyone online)", value: "here" },
                    ...createSelectableItems(guild?.roles)
                ]}
                description="Select a role which should get pinged on posts."
                defaultState={item.roleId}
                onSave={(o) => editItem("roleId", o as string)}
                showClear
            />
            <InputMultiSelect
                className="lg:w-1/2 w-full"
                label="Run at"
                endpoint={url + "/" + item.id}
                k="runtimeHours"
                items={hoursArray}
                defaultState={item.runtimeHours.map(Number)}
                description="Select one or multiple hours when posts should be made."
            />
        </div>
    </>);
}