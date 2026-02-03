"use client";

import { Section } from "@/components/section";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Anchor, Code, Ol } from "@/components/ui/typography";
import { isValidElement } from "react";
import { HiBell, HiCash, HiChat, HiLockClosed, HiUserAdd } from "react-icons/hi";

const data = [
    {
        startContent: <HiUserAdd />,
        title: "How do I invite Wamellow to my Server?",
        subtitle: "Invite Wamellow to your server to get started!",
        content: (
            <Ol itemProp="text">
                <li>
                    Be sure to have the <Code>Manage Server</Code> permission on the server you want <Anchor href="/login?invite=true" target="_blank">invite Wamellow</Anchor> into.
                </li>
                <li>
                    Open Discord{"'"}s add-app flow at <Anchor href="/login?invite=true" target="_blank">wamellow.com/invite</Anchor>.
                </li>
                <li>
                    Select a server and click on {"\""}Continue{"\""}.
                </li>
                <li>
                    Do <span className="font-semibold">not uncheck</span> any permissions and click on {"\""}Authorize{"\""}.
                </li>
                <li>
                    <span className="font-semibold">Done!</span> 🎉 You should now find yourself on the Dashboard for your server!
                </li>
            </Ol>
        )
    },
    {
        startContent: <HiCash />,
        title: "Is Text to Speech free to use?",
        content: (
            <div itemProp="text">
                Yes, Text to Speech is free to use. However, you might have to <Anchor href="/vote" target="_blank">vote for Wamellow on top.gg</Anchor> if you start using it a lot.
            </div>
        )
    },
    {
        startContent: <HiChat />,
        title: "How do I set up Chat to Speech (TTS)?",
        content: (
            <div itemProp="text">
                <ol className="list-decimal list-inside marker:text-neutral-500 mb-4">
                    <li>
                        <Anchor href="/login?invite=true" target="_blank">Invite Wamellow</Anchor> to your Server. If you do not own it, ask the server Administrators to add Wamellow.
                    </li>
                    <li>
                        Go to the <Anchor href="/login?invite=true" target="_blank">Dashboard on wamellow.com/dashboard</Anchor>, find your server and click {"\""}manage{"\""}.
                    </li>
                    <li>
                        Select a channel to be used in the {"\""}Text to Speech{"\""} section.
                    </li>
                    <li>
                        Join any voice channel in your Server (be sure Wamellow can join it too).
                    </li>
                    <li>
                        Start writing messages in the selected channel for the app to speak.
                    </li>
                    <li>
                        <span className="font-semibold">Done!</span> 🎉
                    </li>
                </ol>

                You can also watch the video tutorial below or <Anchor href="https://youtu.be/NS5fZ1ltovE?si=8hE1o6BBELxAxJbH" target="_blank">watch it on YouTube</Anchor>.
                <iframe
                    className="mt-2 aspect-video rounded-lg"
                    width="100%"
                    src="https://www.youtube.com/embed/NS5fZ1ltovE?si=uODiGspuNGKPRQKp"
                    title="Wamellow Text to Speech tutorial"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
            </div>
        )
    },
    {
        startContent: <HiLockClosed />,
        title: "How do I disable a command for roles or channels?",
        content: (
            <div itemProp="text">
                <ol className="list-decimal list-inside marker:text-neutral-500 mb-4">
                    <li>
                        In the Discord App, click on your servers&apos; name and click {"\""}Settings{"\""}
                    </li>
                    <li>
                        Then go to the tab {"\""}Integrations{"\""} in the {"\""}Apps{"\""} category.
                    </li>
                    <li>
                        In the {"\""}Bots and Apps{"\""} list, find Wamellow and click on {"\""}Manage{"\""}.
                    </li>
                    <li>
                        You can choose to disable commands for everyone by their roles, or only in certain channels.
                    </li>
                    <li>
                        <span className="font-semibold">Done!</span> 🎉
                    </li>
                </ol>

                You can also watch the video tutorial below or <Anchor href="https://youtu.be/ehc0_whydu8?si=8hE1o6BBELxAxJbH" target="_blank">watch it on YouTube</Anchor>.
                <iframe
                    className="mt-2 aspect-video rounded-lg"
                    width="100%"
                    src="https://www.youtube.com/embed/ehc0_whydu8?si=uODiGspuNGKPRQKp"
                    title="How to disable slash commands from bots and apps in discord"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
            </div>
        )
    },
    {
        startContent: <HiBell />,
        title: "Which social platforms does Wamellow Notifications support?",
        content: (
            <div itemProp="text">
                Wamellow currently support YouTube videos, shorts and livestreams; Twitch live stream; Bluesky (bsky.app) posts, reposts and quote-replies; and Reddit posts.
            </div>
        )
    }
];

const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.map((item) => ({
        "@type": "Question",
        name: item.title,
        acceptedAnswer: {
            "@type": "Answer",
            text: extractText(item.content)
        }
    }))
};

export function Faq({
    showTitle = false
}: {
    showTitle?: boolean;
}) {
    return (<>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema)
            }}
        />

        {showTitle && (
            <Section
                className="mb-4"
                title="Frequently Asked Questions about Wamellow"
            >
                Commonly asked questions about Wamellow and how to use it.
            </Section>
        )}

        <Accordion
            className="w-full space-y-2"
            type="single"
            collapsible
            defaultValue="0"
        >
            {data.map((item, index) => (
                <AccordionItem
                    value={index.toString()}
                    key={index}
                    className="bg-wamellow/50 rounded-xl border-none px-4 data-[state=open]:bg-wamellow"
                >
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                        <div className="flex items-start gap-4">
                            <div className="mt-0.5 p-2 rounded-lg bg-violet-500/10 text-violet-400">
                                {item.startContent}
                            </div>
                            <div>
                                <div itemProp="name" className="font-semibold text-foreground">
                                    {item.title}
                                </div>
                                {item.subtitle && (
                                    <div className="text-sm text-muted-foreground font-normal mt-0.5">
                                        {item.subtitle}
                                    </div>
                                )}
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-medium pb-4 pl-14 space-y-4 text-muted-foreground">
                        {item.content}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    </>);
}

function extractText(content: React.ReactNode): string {
    if (typeof content === "string") return content;
    if (typeof content === "number") return content.toString();

    if (isValidElement(content)) {
        if ((content.props as React.PropsWithChildren).children) {
            return extractText((content.props as React.PropsWithChildren).children);
        }
    }
    if (!Array.isArray(content)) return "";

    return content
        .map((child) => extractText(child))
        .join(" ");
}