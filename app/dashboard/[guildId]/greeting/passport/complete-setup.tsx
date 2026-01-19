import type { Guild } from "@/common/guilds";
import { InputSelect } from "@/components/inputs/select-menu";
import Modal from "@/components/modal";
import type { ApiEdit } from "@/lib/api/hook";
import { type ApiV1GuildsModulesPassportGetResponse, GuildFlags } from "@/typings";
import { createSelectableItems } from "@/utils/create-selectable-items";
import { useState } from "react";

enum ModalType {
    None = 0,
    VerifiedRole = 1,
    PunishmentRole = 2
}

interface Props {
    guild: Guild | undefined;
    data: ApiV1GuildsModulesPassportGetResponse;
    edit: ApiEdit<ApiV1GuildsModulesPassportGetResponse>;
}

export default function CompleteSetup({
    guild,
    data,
    edit
}: Props) {
    const [dismissed, setDismissed] = useState<ModalType>(ModalType.None);
    const [roleId, setRoleId] = useState<string | null>(null);

    const enabled = guild ? (guild.flags & GuildFlags.PassportEnabled) !== 0 : false;

    let activeModal = ModalType.None;
    if (enabled) {
        if (!data.successRoleId) {
            activeModal = ModalType.VerifiedRole;
        } else if (data.punishment === 2 && !data.punishmentRoleId) {
            activeModal = ModalType.PunishmentRole;
        }
    }

    if (activeModal === ModalType.None && dismissed !== ModalType.None) {
        setDismissed(ModalType.None);
    }

    const showVerified = activeModal === ModalType.VerifiedRole && dismissed !== ModalType.VerifiedRole;
    const showPunishment = activeModal === ModalType.PunishmentRole && dismissed !== ModalType.PunishmentRole;

    return (<>
        <Modal
            title="Verified role"
            className="overflow-visible!"
            isOpen={Boolean(guild) && showVerified}
            onClose={() => setDismissed(ModalType.VerifiedRole)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild?.id}/modules/passport`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        successRoleId: roleId
                    })
                });
            }}
            isDisabled={!roleId}
            onSuccess={() => edit("successRoleId", roleId)}
        >
            <InputSelect
                label="Role"
                items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                description="Select what role members should get when completing verification."
                defaultState={data.punishmentRoleId}
                onSave={(o) => setRoleId(o)}
            />
        </Modal>

        <Modal
            title="Punishment role"
            className="overflow-visible!"
            isOpen={Boolean(guild) && showPunishment}
            onClose={() => setDismissed(ModalType.PunishmentRole)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/guilds/${guild?.id}/modules/passport`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        punishmentRoleId: roleId
                    })
                });
            }}
            isDisabled={!roleId}
            onSuccess={() => edit("punishmentRoleId", roleId)}
        >
            <InputSelect
                label="Role"
                items={createSelectableItems(guild?.roles, ["RoleHirachy"])}
                description="Select what role members should get when failing verification."
                defaultState={data.punishmentRoleId}
                onSave={(o) => setRoleId(o)}
            />
        </Modal>
    </>);
}