"use client";

import { ControlledInput } from "@/components/inputs/controlled-input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { intl } from "@/utils/numbers";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import type { ApiV1StatusGetResponse } from "./api";

export function Side({
    status
}: {
    status: ApiV1StatusGetResponse;
}) {
    const [guildId, setGuildId] = useState<string>("");

    const clusterId = useMemo(
        () => /^\d{15,20}$/.test(guildId)
            ? getClusterId(guildId || "", status.clusters.length)
            : null,
        [guildId]
    );

    useEffect(() => {
        const element = document.getElementById("cluster-" + clusterId);
        if (!element) return;

        element.classList.add("outline-solid");
        return () => element.classList.remove("outline-solid");
    }, [clusterId]);

    return (
        <div className="flex flex-col gap-5">
            <Accordion
                type="multiple"
                defaultValue={["1"]}
                variant="primary"
            >
                <AccordionItem value="1">
                    <AccordionTrigger>Performance & Usage</AccordionTrigger>
                    <AccordionContent className="mb-2 space-y-2">
                        <Row name="Uptime">
                            {status.clusters[0].uptime}
                        </Row>
                        <Row name="Latency avg">
                            {~~(status.clusters.reduce((prev, cur) => prev + cur.ping, 0) / status.clusters.length)}ms
                        </Row>
                        <Row name="Memory">
                            {intl.format(~~(status.clusters.reduce((prev, cur) => prev + cur.memory, 0)))}mb
                        </Row>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <div>
                <ControlledInput
                    placeholder="Paste your Server Id"
                    value={guildId}
                    setValue={setGuildId}
                    description={/^\d{15,20}$/.test(guildId) ? `Your guild is on cluster #${clusterId}.` : ""}
                />

                <p className="text-muted-foreground text-sm -mt-2 px-0.5">
                    Discord bots are divided into clusters or shards, which are logical processes running on the CPU, akin to multithreading.
                </p>
            </div>
        </div>
    );
}

function Row({ name, children }: { name: string; children: ReactNode; }) {
    return (
        <div className="flex items-center justify-between">
            {name}
            <Badge>
                {children}
            </Badge>
        </div>
    );
}

function getClusterId(guildId: string, totalShards: number) {
    return Number((BigInt(guildId) >> BigInt(22))) % totalShards;
}