import Box from "@/components/box";
import { Badge } from "@/components/ui/badge";
import { defaultFetchOptions } from "@/lib/api";
import type { ApiError } from "@/typings";
import { intl } from "@/utils/numbers";
import { HiFire, HiInformationCircle } from "react-icons/hi";

interface Commands {
    name: string;
    description: string;
    uses: number;
}

async function getCommands() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/commands`, defaultFetchOptions);
    return response.json().catch(() => null) as Promise<Commands[] | ApiError | null>;
}

export async function Commands({
    limit = 6
}: {
    limit?: number;
}) {
    const commands = await getCommands();

    return (
        <Box
            none
            className="p-5 pb-3 dark:bg-wamellow bg-wamellow-100 rounded-lg my-4 w-full"
        >
            <div className="flex">
                <Badge
                    variant="flat"
                    radius="rounded"
                >
                    <HiFire />
                    Popular Slash Commands
                </Badge>

                <div className="ml-auto flex items-center gap-1 opacity-80">
                    <span className="text-xs">Since September 2024</span>
                    <HiInformationCircle />
                </div>
            </div>

            {commands && Array.isArray(commands) && commands.length ?
                <div className="divide-y divide-wamellow">
                    {commands
                        .sort((a, b) => b.uses - a.uses)
                        .slice(0, limit)
                        .map((command) => (
                            <div
                                key={command.name}
                                className="text-base py-4 flex flex-col md:flex-row gap-4 md:items-center"
                            >
                                <div className="-mb-2 md:mb-0 flex items-center h-min">
                                    <span className="dark:text-neutral-100 text-neutral-900 text-xl font-semibold md:font-medium">/{command.name}</span>
                                    <span className="ml-auto italic text-sm md:hidden opacity-80">{intl.format(command.uses)} uses</span>
                                </div>
                                <span>{command.description}</span>
                                <span className="ml-auto italic text-sm hidden md:block">{intl.format(command.uses)} uses</span>
                            </div>
                        ))
                    }
                </div>
                :
                <div className="flex flex-col items-center my-10">
                    <div className="text-3xl dark:text-neutral-100 text-neutral-900 font-semibold mb-4">Something went wrong...</div>
                    <div className="text-md dark:text-neutral-400 text-neutral-600 font-semibold">The commands list could not be loaded at this time</div>
                </div>
            }

        </Box>
    );
}