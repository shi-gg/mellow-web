"use client";

import { guildStore } from "@/common/guilds";
import { CopyToClipboardButton } from "@/components/copy-to-clipboard";
import SelectInput from "@/components/inputs/select-menu";
import Switch from "@/components/inputs/switch";
import Notice from "@/components/notice";
import { OverviewLink } from "@/components/overview-link";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { useApi } from "@/lib/api/hook";
import { type ApiV1GuildsModulesPassportGetResponse, GuildFlags } from "@/typings";
import { transformer } from "@/utils/bitfields";
import { createSelectableItems } from "@/utils/create-selectable-items";
import { getCanonicalUrl } from "@/utils/urls";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HiArrowLeft, HiExternalLink, HiFingerPrint } from "react-icons/hi";

import CompleteSetup from "./complete-setup";

export default function Home() {
    const guild = guildStore((g) => g);

    const params = useParams();
    const { data, isLoading, error, edit } = useApi<ApiV1GuildsModulesPassportGetResponse>(`/guilds/${params.guildId}/modules/passport`);

    const enabled = (guild!.flags & GuildFlags.PassportEnabled) !== 0;

    if (isLoading) return <></>;

    if (!data || error) return (
        <div>
            <Head guildId={params.guildId as string} />
            {error && <Notice message={error} />}
        </div>
    );

    return (<>
        <Head guildId={params.guildId as string} />

        {enabled && data.punishment === 2 && !data.punishmentRoleId && (
            <Notice message="A punishment role must be set when using 'Assign role to member'." />
        )}

        {enabled && !data.successRoleId && (
            <Notice message="A verified role must be set for passport to work." />
        )}

        <CompleteSetup
            guild={guild}
            data={data}
            edit={edit}
        />

        <Switch
            label="Enable Passport"
            endpoint={`/guilds/${guild?.id}`}
            k="flags"
            defaultState={enabled}
            transform={(value) => transformer(value, guild!.flags, GuildFlags.PassportEnabled)}
            onSave={(value) => guildStore.setState({ flags: transformer(value, guild!.flags, GuildFlags.PassportEnabled) })}
        />

        <SelectInput
            name="Logging channel"
            url={`/guilds/${guild?.id}/modules/passport`}
            dataName="channelId"
            items={createSelectableItems(guild?.channels)}
            description="Select the channel where verification logs should be send into."
            defaultState={data.channelId}
            disabled={!enabled}
            onSave={(o) => edit("channelId", o as string)}
        />

        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <SelectInput
                    name="Unverified role"
                    url={`/guilds/${guild?.id}/modules/passport`}
                    dataName="unverifiedRoleId"
                    items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                    description="Select what role members should get when joining."
                    defaultState={data.unverifiedRoleId}
                    showClear
                    disabled={!enabled}
                    onSave={(o) => edit("unverifiedRoleId", o as string)}
                />
            </div>

            <div className="lg:w-1/2">
                <SelectInput
                    name="Verified role"
                    url={`/guilds/${guild?.id}/modules/passport`}
                    dataName="successRoleId"
                    items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                    description="Select what role members should get when completing verification."
                    defaultState={data.successRoleId}
                    disabled={!enabled}
                    onSave={(o) => edit("successRoleId", o as string)}
                />
            </div>
        </div>

        <div className="lg:flex gap-3">
            <div className="lg:w-1/2">
                <SelectInput
                    name="Failed verification action"
                    url={`/guilds/${guild?.id}/modules/passport`}
                    dataName="punishment"
                    items={[
                        { name: "Ban member", value: 0 },
                        { name: "Kick member", value: 1 },
                        { name: "Assign role to member", value: 2 }
                    ]}
                    description="Choose what should happen if a member failes verification."
                    defaultState={data.punishment}
                    disabled={!enabled}
                    onSave={(o) => edit("punishment", o as ApiV1GuildsModulesPassportGetResponse["punishment"])}
                />
            </div>

            <div className="lg:w-1/2">
                <SelectInput
                    name="Punishment role"
                    url={`/guilds/${guild?.id}/modules/passport`}
                    dataName="punishmentRoleId"
                    items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                    description="Select what role members should get when failing verification."
                    defaultState={data.punishmentRoleId}
                    disabled={!enabled || data.punishment !== 2}
                    onSave={(o) => edit("punishmentRoleId", o as string)}
                />
            </div>
        </div>

        <Section
            title="Verification Page"
        >
            Copy and paste the link to your verification page in a publicly accessible channel within your server.
        </Section>

        <OverviewLink
            className="mt-2"
            title="View Passport"
            message="Easily verify your members with a simple and secure CAPTCHA in the web."
            url={`/passport/${params.guildId}`}
            icon={<HiFingerPrint />}
        />

        <CopyToClipboardButton
            className="w-fit"
            title="Copy link to passport"
            text={getCanonicalUrl("passport", guild?.id as string)}
        />
    </>);
}

function Head({ guildId }: { guildId: string; }) {
    return (
        <div className="flex justify-between relative bottom-2 mb-3">
            <Button
                asChild
                size="sm"
            >
                <Link href={`/dashboard/${guildId}/greeting`}>
                    <HiArrowLeft />
                    Back
                </Link>
            </Button>
            <Button
                asChild
                size="sm"
            >
                <Link
                    href="/docs/greetings"
                    target="_blank"
                >
                    <HiExternalLink />
                    Read docs & view placeholders
                </Link>
            </Button>
        </div>
    );
}