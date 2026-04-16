import { filterDuplicates } from "@/utils/filter-duplicates";
import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";
import type { Metadata } from "next";
import { BsDiscord, BsGithub } from "react-icons/bs";

import { getBillingDonators } from "./api";
import { developers, repos, TeamType } from "./constants";
import { DiscordServer } from "./discord.component";
import { Person } from "./person.component";
import { Repository } from "./repository.component";

export const revalidate = 3_600;

function formatTeamName(team: string) {
    return team
        .split("-")
        .map((str) => str.replace(/^\w/, (char) => char.toUpperCase()))
        .join(" ");
}

export const generateMetadata = (): Metadata => {
    const title = "Team";
    const description = "Meet the creators of Wamellow and its products. Our dedicated team, including developers and donors, drives innovation and community growth.";
    const url = getCanonicalUrl("team");

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
                url: `${getBaseUrl()}/mommy.webp`,
                type: "image/webp"
            }
        },
        twitter: {
            card: "summary",
            title,
            description,
            images: {
                url: `${getBaseUrl()}/mommy.webp`,
                alt: title
            }
        }
    };
};

export default async function Home() {
    const donors = await getBillingDonators()
        .then((donors) => (
            Array.isArray(donors)
                ? donors.map((id) => ({
                    id,
                    team: TeamType.Donator
                }))
                : []
        ));

    const members = [...developers, ...donors];
    const teams = filterDuplicates(members.map((member) => member.team));

    return (
        <div>
            <h2 className="text-2xl font-medium text-neutral-200">Team 👋</h2>
            <div className="max-w-xl mt-1 mb-2">
                Meet the creators of Wamellow and its products. Our dedicated team, including developers and donors, drives innovation and community growth.
            </div>

            <div className="relative mb-10">
                {teams.map((team) => (
                    <div
                        key={team}
                        className="py-3"
                    >
                        <h3 className="text-lg font-medium text-neutral-200">
                            {formatTeamName(team)}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-3">
                            {members
                                .filter((member) => member.team === team)
                                .map((member) => (
                                    <Person
                                        key={member.id}
                                        id={member.id}
                                        social={"social" in member ? member.social : undefined}
                                    />
                                ))
                            }
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-medium text-neutral-200">Open Source <BsGithub className="inline ml-1 mb-1" /></h2>
            <div className="max-w-xl mt-1">
                Some parts of Wamellow are open source and available on GitHub. We welcome contributions from the community to help us improve our products and services.
            </div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3 py-5 mb-10">
                {repos.map((repo) => (
                    <Repository
                        key={repo}
                        fullname={repo}
                    />
                ))}
            </div>

            <h2 className="text-2xl font-medium text-neutral-200">Discord Community <BsDiscord className="inline ml-1 mb-1 text-blurple" /></h2>
            <div className="max-w-xl mt-1">
                Join our Discord server to chat with other members of the community, ask questions, and get help with our products.
            </div>

            <div className="mt-2 py-5 md:w-1/2">
                <DiscordServer guildId="828676951023550495" />
            </div>

        </div>
    );
}