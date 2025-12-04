/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-img-element */

import { getGuild } from "@/lib/api";
import { intl } from "@/utils/numbers";
import { truncate } from "@/utils/truncate";
import { getCanonicalUrl } from "@/utils/urls";
import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

import { getTopMembers } from "../api";
import Icon from "../icon.component";

interface Props {
    params: Promise<{ guildId: string; }>;
}

export const revalidate = 3_600; // 1 hour

const fonts = {
    regular: await readFile(new URL("../../../../assets/Poppins-Regular.ttf", import.meta.url)),
    medium: await readFile(new URL("../../../../assets/Poppins-Medium.ttf", import.meta.url)),
    semiBold: await readFile(new URL("../../../../assets/Poppins-SemiBold.ttf", import.meta.url)),
    extraBold: await readFile(new URL("../../../../assets/Poppins-ExtraBold.ttf", import.meta.url))
};

export async function GET(request: NextRequest, { params }: Props) {
    const { guildId } = await params;

    let type = request.nextUrl.searchParams.get("type");
    if (type !== "messages" && type !== "voiceminutes" && type !== "invites") type = "messages";

    const guild = await getGuild(guildId);
    const members = await getTopMembers(guildId, { page: 1, type: "messages" }, { force: true });

    const guildExists = guild && "id" in guild;

    return new ImageResponse(
        (
            <div tw="bg-[#07050c] p-18 flex flex-col w-full h-full text-6xl text-white">
                <div tw="flex mb-6">
                    <span tw="text-3xl bg-[#2c2146] text-[#895af6] opacity-80 pt-2 px-4 rounded-xl pb-2" style={{ fontWeight: 500 }}>
                        Leaderboard
                    </span>
                </div>
                <div tw="flex mb-3 items-center">
                    <img
                        alt=""
                        src={guildExists && guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : getCanonicalUrl("discord.png")}
                        tw="h-20 w-20 rounded-2xl mr-5"
                        width={20 * 4}
                        height={20 * 4}
                    />
                    <div
                        className="break-keep"
                        style={{ fontWeight: 800, fontSize: "5rem" }}
                    >
                        {truncate(guildExists ? guild.name : "unknown", 19)}
                    </div>
                </div>

                <div tw="text-3xl text-gray-500 mb-42" style={{ fontWeight: 500 }}>
                    {guildExists && guild?.description
                        ? guild.description
                        : "Explore the vibrant community dynamics"
                    }
                </div>

                {Array.isArray(members) &&
                    <div tw="flex justify-between">
                        {members.slice(0, 3).map((member) => (
                            <div key={member.id} tw="flex flex-col">
                                <div tw="flex items-center mb-2 text-5xl" style={{ fontWeight: 600 }}>
                                    <img
                                        alt=""
                                        src={member?.avatar ? `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.png` : getCanonicalUrl("discord.png")}
                                        tw="h-14 w-14 rounded-full mb-2.5 mr-4"
                                        width={14 * 4}
                                        height={14 * 4}
                                    />
                                    {truncate(member.globalName || member.username || "unknown", 10)}
                                </div>

                                <div tw="text-3xl text-gray-400 flex text-3xl" style={{ fontWeight: 500 }}>
                                    <span tw="mr-2">{intl.format(member.activity.messages)}</span>
                                    <Icon type={type as "messages"} />
                                </div>
                            </div>
                        ))}
                    </div>
                }

            </div>
        ),
        {
            width: 1_200,
            height: 630,
            fonts: [
                {
                    name: "Poppins",
                    data: fonts.regular,
                    style: "normal",
                    weight: 400
                },
                {
                    name: "Poppins",
                    data: fonts.medium,
                    style: "normal",
                    weight: 500
                },
                {
                    name: "Poppins",
                    data: fonts.semiBold,
                    style: "normal",
                    weight: 600
                },
                {
                    name: "Poppins",
                    data: fonts.extraBold,
                    style: "normal",
                    weight: 800
                }
            ]
        }
    );
}