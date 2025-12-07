"use client";

import { guildStore } from "@/common/guilds";
import { StatsBar } from "@/components/counter";
import MessageCreatorEmbed from "@/components/embed-creator";
import SelectInput from "@/components/inputs/select-menu";
import TextInput from "@/components/inputs/text-input";
import { ScreenMessage } from "@/components/screen-message";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cacheOptions, getData } from "@/lib/api";
import { Permissions } from "@/lib/discord/enum/permissions";
import type { ApiV1GuildsModulesTagsGetResponse } from "@/typings";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { HiViewGridAdd } from "react-icons/hi";
import { useQuery, useQueryClient } from "react-query";

import { CreateTag, Style } from "./create.component";
import { DeleteTag } from "./delete.component";

export default function Home() {
    const guild = guildStore((g) => g);
    const pathname = usePathname();
    const search = useSearchParams();
    const router = useRouter();
    const params = useParams();
    const queryClient = useQueryClient();

    const url = `/guilds/${params.guildId}/modules/tags` as const;

    const { data, isLoading, error } = useQuery(
        url,
        () => getData<ApiV1GuildsModulesTagsGetResponse[]>(url),
        {
            enabled: Boolean(params.guildId),
            ...cacheOptions
        }
    );

    const id = search.get("id");
    const tag = (Array.isArray(data) ? data : []).find((t) => t.id === id);

    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(search);
        params.set(name, value);

        return params.toString();
    }, [search]);

    const setTagId = (id: string) => {
        router.push(pathname + "?" + createQueryString("id", id));
    };

    useEffect(() => {
        if (!Array.isArray(data)) return;
        if (data && !tag && data[0]) setTagId(data[0].id);
    }, [data]);

    if (error || (data && "message" in data)) {
        return (
            <ScreenMessage
                top="20vh"
                title="Something went wrong on this page.."
                description={
                    (data && "message" in data ? data.message : `${error}`)
                    || "An unknown error occurred."}
                href={`/dashboard/${guild?.id}`}
                button="Go back to overview"
                icon={<HiViewGridAdd />}
            />
        );
    }

    if (isLoading || !data) return <></>;

    const editTag = <T extends keyof ApiV1GuildsModulesTagsGetResponse>(k: keyof ApiV1GuildsModulesTagsGetResponse, value: ApiV1GuildsModulesTagsGetResponse[T]) => {
        if (!tag) return;

        queryClient.setQueryData<ApiV1GuildsModulesTagsGetResponse[]>(url, () => [
            ...(data?.filter((t) => t.id !== tag.id) || []),
            { ...tag, [k]: value }
        ]);
    };

    const addTag = (tag: ApiV1GuildsModulesTagsGetResponse) => {
        queryClient.setQueryData<ApiV1GuildsModulesTagsGetResponse[]>(url, () => [
            ...(data || []),
            tag
        ]);
    };

    const removeTag = (id: string) => {
        queryClient.setQueryData<ApiV1GuildsModulesTagsGetResponse[]>(url, () => (
            data?.filter((t) => t.id !== id) || []
        ));
    };

    return (<>
        <div className="flex flex-wrap items-center gap-2 -mt-2 mb-5">
            {data
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((tag) => (
                    <Button
                        key={"guildTags-" + tag.id}
                        className="rounded-full h-8"
                        onClick={() => setTagId(tag.id)}
                    >
                        <span className="opacity-50 text-sm">
                            {tag.applicationCommandId ? "/" : "wm -"}
                        </span>
                        {tag.name}
                    </Button>
                ))
            }

            <CreateTag
                guildId={guild?.id as string}
                style={Style.Compact}
                addTag={addTag}
                setTagId={setTagId}
            />

            <div className="ml-auto flex items-center gap-4">
                <Tooltip>
                    <TooltipTrigger>
                        <span className="dark:text-neutral-600 text-neutral-400 cursor-default">
                            {data.length}/{30}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{data.length} created tags / {30} limit</p>
                    </TooltipContent>
                </Tooltip>

                <DeleteTag
                    guildId={guild?.id as string}
                    id={id}
                    name={tag?.name}
                    removeTag={removeTag}
                />
            </div>

        </div>

        {tag && <>
            <div className="relative rounded-md overflow-hidden p-px">
                <StatsBar
                    items={[
                        {
                            name: "All time Unique Users",
                            number: 420,
                            gained: 69,
                            append: "yesterday"
                        },
                        {
                            name: "All time Command Uses",
                            number: 69_420,
                            gained: 42,
                            append: "yesterday"
                        }
                    ]}
                />

                <div className="absolute top-0 left-0 flex flex-col justify-center items-center w-full h-full backdrop-blur-md backdrop-brightness-75" >
                    <div className="text-3xl dark:text-neutral-100 text-neutral-900 font-semibold mb-2">Nothing to see here.. yet..</div>
                    <div className="text-md dark:text-neutral-400 text-neutral-600 font-semibold">Here will be the usage of your custom commands soon</div>
                </div>
            </div>

            <div className="lg:flex gap-3 mt-6">
                <div className="lg:w-1/2">
                    <TextInput
                        key={tag.id}
                        name="Name"
                        url={url + "/" + tag.id}
                        dataName="name"
                        description="The name of the custom command."
                        defaultState={tag.name}
                        resetState={tag.name}
                        disabled={Boolean(tag.applicationCommandId)}
                        onSave={(value) => editTag("name", value)}
                    />
                </div>

                <div className="lg:w-1/2">
                    <SelectInput
                        key={tag.id}
                        name="Permissions"
                        url={url + "/" + tag.id}
                        items={
                            Permissions.sort((a, b) => a.localeCompare(b)).map((p) => (
                                { name: convertCamelCaseToSpaced(p), value: p }
                            )) || []
                        }
                        dataName="permission"
                        description="The permissions needed to execute this tag."
                        defaultState={tag.permission}
                        onSave={(option) => editTag("permission", option.value)}
                        showClear
                    />
                </div>
            </div>

            <MessageCreatorEmbed
                key={tag.id}
                name="Message"
                url={url + "/" + tag.id}
                dataName="message"
                defaultMessage={tag.message}
                onSave={(value) => editTag("message", value)}
            />
        </>}

        {!data.length &&
            <div
                className="w-full flex flex-col items-center justify-center"
                style={{ marginTop: "20vh" }}
            >
                <div>

                    <div className="mb-10 flex flex-col items-center text-center">
                        <span className="text-4xl dark:text-neutral-100 text-neutral-900 font-semibold">You dont have any tags yet</span> <br />
                        <span className="text-lg dark:text-neutral-400 text-neutral-600 font-semibold">Create new custom commands to get started</span>
                    </div>

                    <div className="w-full flex flex-col items-center">
                        <CreateTag
                            guildId={guild?.id as string}
                            style={Style.Big}
                            addTag={addTag}
                            setTagId={setTagId}
                        />
                    </div>

                </div>
            </div>
        }

    </>);
}

function convertCamelCaseToSpaced(input: string): string {
    const spacedString = input.replace(/([A-Z])/g, " $1");
    return spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
}