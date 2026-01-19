"use client";

import { type User, userStore } from "@/common/user";
import ColorInput from "@/components/inputs/color-input";
import ImageUrlInput from "@/components/inputs/image-url-input";
import SelectInput from "@/components/inputs/select-menu";
import { Section } from "@/components/section";
import { deepMerge } from "@/utils/deepMerge";

import CardSyle from "./card-style.component";
import LeaderboardStyle from "./leaderboard-style.component";

export default function Home() {
    const user = userStore((s) => s);

    if (user?.id && !user.extended) return <></>;

    return (<>
        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <SelectInput
                    name="Secondary text"
                    url="/users/@me/rank"
                    dataName="subText.type"
                    description="This text will be displayed bellow the /rank progressbar."
                    items={[
                        {
                            name: "None",
                            value: 0
                        },
                        {
                            name: "ETA to next milestone reach date",
                            value: 1
                        },
                        {
                            name: "ETA to next milestone reach relative date",
                            value: 2
                        },
                        {
                            name: "Custom text",
                            value: 3,
                            error: "Not done yet"
                        }
                    ]}
                    defaultState={user?.extended?.rank?.subText?.type}
                    onSave={(value) => {
                        userStore.setState(deepMerge<User>(user, { extended: { rank: { subText: { type: Number(value) as 0 | 1 | 2 | 3 } } } }));
                    }}
                />
            </div>

            <div className="lg:w-1/2 flex gap-2 w-full">
                <div className="w-1/2">
                    <ColorInput
                        name="Text color"
                        url="/users/@me/rank"
                        dataName="textColor"
                        description="Color used for your username."
                        defaultState={user?.extended?.rank?.textColor ?? 0}
                        onSave={(value) => {
                            userStore.setState(deepMerge<User>(user, { extended: { rank: { textColor: Number(value) } } }));
                        }}
                    />
                </div>
                <div className="w-1/2">
                    <ColorInput
                        name="Bar color"
                        url="/users/@me/rank"
                        dataName="barColor"
                        description="Color used for the progress bar."
                        defaultState={user?.extended?.rank?.barColor ?? 0}
                        onSave={(value) => {
                            userStore.setState(deepMerge<User>(user, { extended: { rank: { barColor: Number(value) } } }));
                        }}
                    />
                </div>
            </div>
        </div>

        <ImageUrlInput
            name="Background"
            url="/users/@me/rank"
            ratio="aspect-4/1"
            dataName="background"
            description="Enter a url which should be the background of your /rank card. The recommended resolution is 906x256px."
            defaultState={user?.extended?.rank?.background || ""}
            onSave={(value) => {
                userStore.setState(deepMerge<User>(user, { extended: { rank: { background: value } } }));
            }}
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