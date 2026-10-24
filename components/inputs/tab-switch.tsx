import { cn } from "@/utils/cn";
import { type InputProps, InputState, useInput } from "@/utils/input";
import Link from "next/link";

import { Spinner } from "../spinner";
import { Badge } from "../ui/badge";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface Props {
    link: string;
    badge: string;
    inverted: boolean;
    tabOn: string;
    tabOff: string;
}

export function InputTabSwitch({
    className,

    label,
    link,
    badge,
    description,
    inverted,
    disabled,

    endpoint,
    k,

    defaultState,
    transform,

    onSave,

    tabOn = "On",
    tabOff = "Off"
}: InputProps<boolean> & Partial<Props>) {
    const {
        value,
        state,
        error,
        update
    } = useInput({
        endpoint,
        k,

        defaultState,
        transform,

        onSave
    });

    return (
        <div className={cn("relative", description && "mb-2", className)}>
            <div className="flex items-center justify-between gap-2 mb-6">
                <div className="flex items-center gap-2">
                    <span className="sm:text-lg font-medium text-neutral-100">
                        {label}
                    </span>

                    {badge && (
                        <Badge
                            variant="flat"
                            size="sm"
                        >
                            {badge}
                        </Badge>
                    )}

                    {state === InputState.Loading && (
                        <Spinner className="size-3" />
                    )}
                </div>

                <Tabs
                    value={value ? "on" : "off"}
                    onValueChange={(v) => {
                        const newValue = v === "on";
                        update(inverted ? !newValue : newValue);
                    }}
                >
                    <TabsList className={cn(disabled && "cursor-not-allowed")}>
                        <TabsTrigger
                            value="off"
                            disabled={disabled}
                        >
                            {tabOff}
                        </TabsTrigger>
                        <TabsTrigger
                            value="on"
                            disabled={disabled}
                        >
                            {tabOn}
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="absolute top-6 mt-1.5">
                {description && (
                    <div className="text-neutral-500 text-sm">
                        {description} {link && <Link href={link} target="_blank" className="text-violet-400 hover:underline">Learn more</Link>}
                    </div>
                )}

                {error && (
                    <div className="ml-auto text-red-500 text-sm">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}