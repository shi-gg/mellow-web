"use client";
import { guildStore } from "@/common/guilds";
import { HiFingerPrint, HiUserAdd, HiUserRemove } from "react-icons/hi";

import { OverviewLink } from "../../../../components/overview-link";

export default function Home() {
    const guild = guildStore((g) => g);

    return (
        <div>

            <div className="w-full md:flex gap-3">
                <OverviewLink
                    className="md:w-2/3"
                    title="Welcome greeting"
                    message="Customize the welcome experience for new joining users."
                    url={`/dashboard/${guild?.id}/greeting/welcome`}
                    icon={<HiUserAdd />}
                />
                <OverviewLink
                    className="md:w-1/3"
                    title="Passport"
                    message="Verify joining users with a CAPTCHA."
                    url={`/dashboard/${guild?.id}/greeting/passport`}
                    icon={<HiFingerPrint />}
                />
            </div>

            <OverviewLink
                title="Farewell message"
                message="Manage the message that gets send if a member leaves."
                url={`/dashboard/${guild?.id}/greeting/farewell`}
                icon={<HiUserRemove />}
            />

        </div>
    );
}