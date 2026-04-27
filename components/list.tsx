"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import decimalToRgb from "@/utils/decimalToRgb";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

import { Button } from "./ui/button";

interface ListProps {
    tabs: {
        name: string;
        icon?: React.ReactElement;
        value: string;
    }[];
    url: string;
    searchParamName?: string;
    disabled?: boolean;

    children?: React.ReactNode;
}

export function ListTab({ tabs, url, searchParamName, disabled }: ListProps) {
    const [position, setPosition] = useState(0);
    const [tabsListElement, setTabsListElement] = useState<HTMLDivElement | null>(null);

    const path = usePathname();
    const params = useSearchParams();
    const router = useRouter();

    const setTabsListRef = useCallback((node: HTMLDivElement | null) => {
        setTabsListElement(node);
        if (node) {
            setPosition(node.scrollLeft);
        }
    }, []);

    useEffect(() => {
        if (!tabsListElement) return;

        const observer = new ResizeObserver(() => {
            setPosition(tabsListElement.scrollLeft);
        });

        observer.observe(tabsListElement);

        return () => {
            observer.disconnect();
        };
    }, [tabsListElement]);

    function handleChange(key: string) {
        if (!searchParamName) {
            router.push(`${url}${key}?${params.toString()}`);
            return;
        }

        const newparams = new URLSearchParams();

        if (key) newparams.append(searchParamName, key);
        else newparams.delete(searchParamName);

        router[params.get(searchParamName) ? "push" : "replace"](`${url}?${newparams.toString()}`);
    }

    function scroll(direction: "left" | "right") {
        if (!tabsListElement) return;

        const scrollAmount = tabsListElement.clientWidth * 0.8;

        tabsListElement.scrollBy({
            top: 0,
            left: direction === "right" ? scrollAmount : -scrollAmount,
            behavior: "smooth"
        });
    }

    const maxScroll = tabsListElement
        ? Math.max(tabsListElement.scrollWidth - (tabsListElement.clientWidth + 10), 0)
        : 0;
    const canScroll = tabsListElement
        ? tabsListElement.scrollWidth > tabsListElement.clientWidth
        : false;

    const currentValue = searchParamName
        ? params.get(searchParamName)
        : path.split(url)[1].split("/").slice(0, 2).join("/");

    return (
        <div className="mt-2 mb-4 flex items-center relative">
            <Tabs
                className="w-full"
                value={currentValue || tabs[0].value}
                onValueChange={handleChange}
            >
                <TabsList
                    ref={setTabsListRef}
                    className="bg-inherit border-b-2 border-wamellow p-0 w-full justify-start rounded-none overflow-y-auto overflow-x-auto scrollbar-none"
                    onScroll={(event) => setPosition(event.currentTarget.scrollLeft)}
                >
                    {tabs.map((tab) => (
                        <TabsTrigger
                            key={tab.value}
                            value={tab.value}
                            className='data-[state=active]:border-violet-500 hover:text-foreground h-full rounded-b-none border-b-2 border-transparent flex gap-2 whitespace-nowrap'
                            disabled={disabled}
                        >
                            {tab.icon}
                            {tab.name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {canScroll && position > 0 && (
                <Button
                    className="absolute bottom-2 left-0 backdrop-blur-lg"
                    onClick={() => scroll("left")}
                    size="icon"
                >
                    <HiChevronLeft className="size-5" />
                </Button>
            )}

            {canScroll && position < maxScroll && (
                <Button
                    className="absolute bottom-2 right-0 backdrop-blur-lg"
                    onClick={() => scroll("right")}
                    size="icon"
                >
                    <HiChevronRight className="size-5" />
                </Button>
            )}
        </div>
    );
}

interface FeatureProps {
    items: {
        title: string;
        description: string;
        icon: React.ReactNode;
        color: number;
    }[];
}

export function ListFeature({ items }: FeatureProps) {

    return (
        <div className="grid gap-6 grid-cols-2">
            {items.map((item) => {

                const rgb = decimalToRgb(item.color);

                return (
                    <div
                        className="flex items-center gap-3"
                        key={`featurelist-${item.title}-${item.description}-${item.color}`}
                    >
                        <div className="rounded-full h-12 aspect-square p-2.5 svg-max" style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`, color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` }}>
                            {item.icon}
                        </div>
                        <span className="text-neutral-300">{item.description}</span>
                    </div>
                );

            })}
        </div>
    );
}