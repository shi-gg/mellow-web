import { Section } from "@/components/section";
import { cn } from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import type { ReactNode } from "react";

import { Commands } from "../commands.component";

const lexend = Lexend({ subsets: ["latin"] });

interface Props {
    children: ReactNode;
}

export const generateMetadata = (): Metadata => {
    const title = "Status";
    const description = "Check the status of all clusters and voice chat nodes, double check if we screwed something up - again!";
    const url = getCanonicalUrl("status");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            url,
            type: "website",
            images: {
                url: `${getBaseUrl()}/waya-v3.webp`,
                type: "image/webp"
            }
        },
        twitter: {
            card: "summary",
            title,
            description,
            images: {
                url: `${getBaseUrl()}/waya-v3.webp`,
                alt: title
            }
        }
    };
};

export default function RootLayout({
    children
}: Props) {

    return (<>
        <h1
            className={cn(lexend.className, "lg:text-5xl text-4xl font-bold dark:text-neutral-100 text-neutral-900 break-words mb-2")}
        >
            <span className="bg-linear-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent h-20 break-keep">Wamellow</span>
            {" status"}
        </h1>

        <div
            className="text-lg font-medium mb-6"
        >
            Double check if we just didn&apos;t mess up something.
        </div>

        <div className="mb-12">
            {children}
        </div>

        <Section title="Commands">
            The most popular commands and interactions!
        </Section>

        <Commands limit={100} />
    </>);
}