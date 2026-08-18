"use client";

import {
    InputBase,
    InputBaseAdornment,
    InputBaseControl,
    InputBaseInput
} from "@/components/ui/input-base";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useSearchContext } from "fumadocs-ui/contexts/search";
import { HiSearch } from "react-icons/hi";

export function DocsSearch() {
    const { setOpenSearch, hotKey } = useSearchContext();

    return (
        <InputBase
            className="w-full cursor-pointer ring-0"
            onClick={() => setOpenSearch(true)}
        >
            <InputBaseAdornment>
                <HiSearch />
            </InputBaseAdornment>
            <InputBaseControl>
                <InputBaseInput
                    readOnly
                    placeholder="Search docs…"
                    className="cursor-pointer"
                />
            </InputBaseControl>
            <InputBaseAdornment>
                <KbdGroup>
                    {hotKey.map((key) => (
                        <Kbd key={String(key.display)}>{key.display}</Kbd>
                    ))}
                </KbdGroup>
            </InputBaseAdornment>
        </InputBase>
    );
}