/* eslint-disable @next/next/no-img-element */
import metadata from "@/public/docs/meta.json";
import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

interface Props {
    params: Promise<{ pathname: string[]; }>;
}

export const revalidate = 3_600;

const fonts = {
    medium: await readFile(new URL("../../../../assets/Poppins-Medium.ttf", import.meta.url)),
    extraBold: await readFile(new URL("../../../../assets/Poppins-ExtraBold.ttf", import.meta.url)),
    lexend: await readFile(new URL("../../../../assets/Lexend-Bold.ttf", import.meta.url))
};

const iconSvg = await readFile(new URL("../../../../public/icon.svg", import.meta.url));
const iconDataUrl = `data:image/svg+xml;base64,${iconSvg.toString("base64")}`;

const noisePng = await readFile(new URL("../../../../public/noise.png", import.meta.url));
const noiseDataUrl = `data:image/png;base64,${noisePng.toString("base64")}`;

export async function GET(_request: NextRequest, { params }: Props) {
    const pathname = (await params).pathname.join("/").toLowerCase();

    if (!pathname.endsWith(".png")) {
        return new Response("Not Found", { status: 404 });
    }

    const meta = metadata.pages.find((page) => page.file === `${pathname.slice(0, -".png".length)}.md`);

    const title = meta?.file === "index.md"
        ? "Documentation"
        : meta?.name || "Documentation";

    const description = meta?.description || "Your portal to the extensive and detailed Wamellow documentation!";

    const icon = meta?.name?.split(" ").shift() || "";
    const nameWithoutIcon = meta?.name?.replace(icon, "").trim() || title;

    return new ImageResponse(
        (
            <div
                tw="p-18 flex flex-col w-full h-full text-6xl text-white"
                style={{ backgroundImage: "linear-gradient(165deg, #1f1140 0%, #07050c 75%)" }}
            >
                <img
                    src={noiseDataUrl}
                    alt=""
                    tw="absolute top-0 left-0 w-full h-full"
                    width={2_409}
                    height={2_409}
                    style={{ objectFit: "cover", opacity: 0.05 }}
                />

                <div tw="flex mb-6">
                    <span tw="text-3xl bg-[#2c2146] text-[#895af6] opacity-80 pt-2 px-4 rounded-xl pb-2 font-medium">
                        Documentation
                    </span>
                </div>
                <div tw="flex mb-5 items-center">
                    {icon}
                    <div
                        tw="ml-8 font-extrabold"
                        style={{ fontSize: "5rem" }}
                    >
                        {nameWithoutIcon}
                    </div>
                </div>

                <div tw="text-4xl text-gray-500 mt-3 font-medium">
                    {description}
                </div>

                <div tw="absolute right-11 bottom-10 flex items-center text-white" style={{ fontFamily: "Lexend" }}>
                    <img src={iconDataUrl} tw="mt-1 mr-4" width={42} height={42} alt="" />
                    <span tw="text-5xl">Wamellow</span>
                    <span tw="mt-3.5 -ml-1 text-2xl opacity-60">.com</span>
                </div>
            </div>
        ),
        {
            width: 1_200,
            height: 630,
            headers: {
                "Cache-Control": "public, no-transform, max-age=691200, stale-while-revalidate=600"
            },
            fonts: [
                {
                    name: "Poppins",
                    data: fonts.medium,
                    style: "normal",
                    weight: 500
                },
                {
                    name: "Poppins",
                    data: fonts.extraBold,
                    style: "normal",
                    weight: 800
                },
                {
                    name: "Lexend",
                    data: fonts.lexend,
                    style: "normal",
                    weight: 600
                }
            ]
        }
    );
}