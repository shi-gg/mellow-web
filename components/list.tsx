"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import decimalToRgb from "@/utils/decimalToRgb";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
    const [scrollMetrics, setScrollMetrics] = useState<{ canScroll: boolean; maxScroll: number; }>({ canScroll: false, maxScroll: 0 });

    const path = usePathname();
    const params = useSearchParams();
    const router = useRouter();

    const ref = useRef<HTMLDivElement | null>(null);

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
        if (!ref.current) return;

        const scrollAmount = ref.current.clientWidth * 0.8;

        ref.current.scrollBy({
            top: 0,
            left: direction === "right" ? scrollAmount : -scrollAmount,
            behavior: "smooth"
        });
    }

    function setScrollPosition() {
        if (!ref.current) return;
        const { scrollLeft } = ref.current;
        setPosition(scrollLeft);
    }

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const updateMetrics = () => {
            const canScroll = element.scrollWidth > element.clientWidth;
            const maxScroll = Math.max(element.scrollWidth - (element.clientWidth + 10), 0);
            setScrollMetrics((prev) => {
                if (prev.canScroll === canScroll && prev.maxScroll === maxScroll) return prev;
                return { canScroll, maxScroll };
            });
            setPosition(element.scrollLeft);
        };

        const handleScroll = () => {
            setScrollPosition();
            updateMetrics();
        };

        const resizeObserver = new ResizeObserver(updateMetrics);

        element.addEventListener("scroll", handleScroll);
        resizeObserver.observe(element);
        updateMetrics();

        return () => {
            element.removeEventListener("scroll", handleScroll);
            resizeObserver.disconnect();
        };
    }, []);

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
                    ref={ref}
                    className="bg-inherit border-b-2 border-wamellow p-0 w-full justify-start rounded-none overflow-y-auto overflow-x-auto scrollbar-none"
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

            {scrollMetrics.canScroll && position > 0 && (
                <Button
                    className="absolute bottom-2 left-0 backdrop-blur-lg"
                    onClick={() => scroll("left")}
                    size="icon"
                >
                    <HiChevronLeft className="size-5" />
                </Button>
            )}

            {scrollMetrics.canScroll && position < scrollMetrics.maxScroll && (
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
            {items.map((item, i) => {

                const rgb = decimalToRgb(item.color);

                return (
                    <div
                        className="flex items-center gap-3"
                        key={"featurelist-" + item.description.replace(/ +/g, "") + i}
                    >
                        <div className="rounded-full h-12 aspect-square p-[10px] svg-max" style={{ backgroundColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`, color: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` }}>
                            {item.icon}
                        </div>
                        <span className="text-neutral-300">{item.description}</span>
                    </div>
                );

            })}
        </div>
    );

}