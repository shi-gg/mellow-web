import { Section } from "@/components/section";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/cn";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";
import type { Metadata } from "next";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

export const revalidate = false;

const imprint = Buffer.from(process.env.IMPRINT_BASE64!, "base64").toString();

export const generateMetadata = (): Metadata => {

    const title = "Impressum";
    const description = "Erfahren Sie mehr über die rechtlichen Angaben und Kontaktinformationen unseres Unternehmens im Impressum. Transparenz und Vertrauen stehen bei uns an erster Stelle.";
    const url = getCanonicalUrl("impressum");

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
    return (
        <div>
            <h1 className="mt-6 mb-2 cursor-pointer dark:text-neutral-100 text-neutral-900 hover:underline w-fit text-2xl font-semibold">
                Impressum
            </h1>
            <Separator className="mb-3" />

            {imprint
                .replaceAll("'", "\n")
                .split("\n")
                .map((item) => (
                    <div className={cn(item.endsWith(";") && "mb-2.5")} key={item}>
                        {item.replace(/;/g, "")}
                    </div>
                ))
            }

            <Section title="Online-Streitbeilegung">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit, die hier verfügbar ist: <Link className="text-violet-400 hover:underline" href="https://ec.europa.eu/consumers/odr" prefetch={false}>ec.europa.eu/consumers/odr <HiExternalLink className="inline" /></Link>
                <br />
                Ich bin weder bereit noch verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </Section>
        </div>
    );
}