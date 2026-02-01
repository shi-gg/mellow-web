import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { ApiV1GuildsChannelsGetResponse } from "@/typings";
import { PermissionFlagsBits } from "discord-api-types/v10";
import { HiExclamation } from "react-icons/hi";

export function PermissionAlert(
    { channel, permissions }: { channel?: ApiV1GuildsChannelsGetResponse; permissions: bigint[]; }
) {
    if (channel?.permissions === undefined || !permissions?.length) return null;

    const missingPermission = permissions.find((permission) => (
        (BigInt(channel.permissions) & permission) !== permission
    ));

    if (missingPermission === undefined) {
        return null;
    }

    const permissionName =
        Object.entries(PermissionFlagsBits).find(([, value]) => value === missingPermission)?.[0] ??
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
        const channelsMissingPermission = channels.filter((channel) => (
            (BigInt(channel?.permissions ?? 0) & permission) !== permission
        ));

        if (!channelsMissingPermission.length) continue;

        return {
            missingPermissionName: Object.entries(PermissionFlagsBits).find(([, value]) => value === permission)?.[0] ?? permission.toString(),
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