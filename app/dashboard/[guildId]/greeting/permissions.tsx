import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ApiV1GuildsChannelsGetResponse } from "@/typings";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { HiExclamation } from "react-icons/hi";

export function PermissionAlert(
    { channel, permissions }: { channel?: ApiV1GuildsChannelsGetResponse; permissions: bigint[]; }
) {
    if (channel?.permissions === undefined || !permissions?.length) return null;

    const missingPermission = permissions.find((permission) => {
        const permissionBit = BigInt(permission);
        const channelPermissions = BigInt(channel.permissions);
        return (channelPermissions & permissionBit) !== permissionBit;
    });

    if (missingPermission === undefined) {
        return null;
    }

    const permissionName =
        Object.entries(PermissionFlagsBits).find(([, value]) => value === BigInt(missingPermission))?.[0] ??
        missingPermission.toString();

    return (
        <Alert>
            <HiExclamation />
            <AlertTitle>Missing Permissions</AlertTitle>
            <AlertDescription>
                Wamellow needs the {permissionName} permission to complete actions.
            </AlertDescription>
        </Alert>
    );
}

const getMissingPermissionContext = (
    channels: ApiV1GuildsChannelsGetResponse[],
    permissions: bigint[]
): { missingPermissionName: string | null; affectedChannelNames: string[]; } => {
    for (const permission of permissions) {
        const permissionBit = BigInt(permission);
        const channelsMissingPermission = channels.filter((channel) => {
            const channelPermissions = BigInt(channel?.permissions ?? 0);
            return (channelPermissions & permissionBit) !== permissionBit;
        });

        if (!channelsMissingPermission.length) continue;

        return {
            missingPermissionName: Object.entries(PermissionFlagsBits).find(([, value]) => value === permissionBit)?.[0] ?? permission.toString(),
            affectedChannelNames: channelsMissingPermission.map((channel) => channel?.name ?? "Unnamed channel")
        };

    }

    return { missingPermissionName: null, affectedChannelNames: [] };
};

export function PermissionsAlert(
    { channels, permissions }: { channels: ApiV1GuildsChannelsGetResponse[]; permissions: bigint[]; }
) {
    if (!channels?.length || !permissions?.length) return null;

    const { missingPermissionName, affectedChannelNames } = getMissingPermissionContext(channels, permissions);

    if (!missingPermissionName || !affectedChannelNames.length) {
        return null;
    }

    return (
        <Alert>
            <HiExclamation />
            <AlertTitle>Missing Permissions</AlertTitle>
            <AlertDescription>
                Wamellow needs the {missingPermissionName} permission to complete actions in {affectedChannelNames.join(", ")}.
            </AlertDescription>
        </Alert>
    );
}