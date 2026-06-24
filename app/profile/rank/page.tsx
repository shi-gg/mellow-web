"use client";

import { InputColor } from "@/components/inputs/color-input";
import { InputImageUrl } from "@/components/inputs/image-url-input";
import { InputSelect } from "@/components/inputs/select-menu";
import { ScreenMessage } from "@/components/screen-message";
import { Section } from "@/components/section";
import { useApi } from "@/lib/api/hook";
import type { ApiV1UsersMeGetResponse } from "@/typings";
import { RankSubTextType } from "@/typings";
import { deepMerge } from "@/utils/deep-merge";

import { CardSyle } from "./card-style.component";
import { LeaderboardStyle } from "./leaderboard-style.component";

export default function Home() {
    const { data, isLoading, error, edit } = useApi<ApiV1UsersMeGetResponse>("/users/@me");

    if (isLoading) return null;
    if (!data || error) {
        return <ScreenMessage description={error || "An unknown error occurred."} />;
    }

    return (<>
        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <InputSelect
                    label="Secondary text"
                    endpoint="/users/@me/rank"
                    k="subText.type"
                    description="This text will be displayed bellow the /rank progressbar."
                    items={[
                        {
                            name: "None",
                            value: RankSubTextType.Off
                        },
                        {
                            name: "ETA to next milestone reach date",
                            value: RankSubTextType.Date
                        },
                        {
                            name: "ETA to next milestone reach relative date",
                            value: RankSubTextType.RelativeDate
                        },
                        {
                            name: "Custom text",
                            value: RankSubTextType.Custom,
                            error: "Not done yet"
                        }
                    ]}
                    defaultState={data.rank?.subText?.type}
                    onSave={(value) => edit("rank", deepMerge(data.rank, { subText: { type: value! } })!)}
                />
            </div>

            <div className="lg:w-1/2 flex gap-2 w-full">
                <div className="w-1/2">
                    <InputColor
                        label="Text color"
                        endpoint="/users/@me/rank"
                        k="textColor"
                        description="Color used for your username."
                        defaultState={data.rank?.textColor ?? 0}
                        onSave={(value) => edit("rank", deepMerge(data.rank, { textColor: value })!)}
                    />
                </div>
                <div className="w-1/2">
                    <InputColor
                        label="Bar color"
                        endpoint="/users/@me/rank"
                        k="barColor"
                        description="Color used for the progress bar."
                        defaultState={data.rank?.barColor ?? 0}
                        onSave={(value) => edit("rank", deepMerge(data.rank, { barColor: value })!)}
                    />
                </div>
            </div>
        </div>

        <InputImageUrl
            label="Background"
            endpoint="/users/@me/rank"
            ratio="aspect-4/1"
            k="background"
            description="Enter a url which should be the background of your /rank card. The recommended resolution is 906x256px."
            defaultState={data.rank?.background || ""}
            onSave={(value) => edit("rank", deepMerge(data.rank, { background: value })!)}
        />

        <Section
            title="/leaderboard style"
        >
            Choose how your personal /leaderboard should look like.
        </Section>

        <LeaderboardStyle />

        <Section
            title="Web leaderboard card style"
        >
            Customize your card for web leaderboards.
        </Section>

        <CardSyle />
    </>);
}