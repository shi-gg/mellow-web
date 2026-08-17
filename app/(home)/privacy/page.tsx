import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";
import type { Metadata } from "next";

import { LegalMarkdown } from "../../../components/legal-markdown";

export const revalidate = false;

export const generateMetadata = (): Metadata => {

    const title = "Privacy";
    const description = "We take your privacy seriously. Read about Wamellow's Privacy Policy to learn how.";
    const url = getCanonicalUrl("privacy");

    return {
        title,
        description,
        alternates: {
            canonical: url
        },
        openGraph: {
            title,
            description,
            type: "website",
            url,
            images: `${getBaseUrl()}/waya-v3.webp`
        },
        twitter: {
            card: "summary",
            site: "wamellow.com",
            title,
            description,
            images: `${getBaseUrl()}/waya-v3.webp`
        }
    };
};

export default function Home() {
    return <LegalMarkdown file="privacy.mdx" />;
}