"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import CountUp, { type CountUpProps } from "react-countup";
import { HiInformationCircle } from "react-icons/hi";

import Box from "./box";

export function ClientCountUp(props: Omit<CountUpProps, "duration">) {
    const [isInViewport, setIsInViewport] = useState(false);
    const componentRef = useRef<HTMLDivElement | null>(null);

    const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        setIsInViewport(entry.isIntersecting);
    }, []);

    useEffect(() => {
        const node = componentRef.current;
        const observer = new IntersectionObserver(handleIntersection, {
            threshold: 0.5
        });

        if (node) observer.observe(node);

        return () => {
            if (node) observer.unobserve(node);
        };
    }, [handleIntersection]);

    return (
        <span ref={componentRef} className={props.className || ""}>
            {isInViewport ? <CountUp {...props} className="" duration={4} /> : <>0</>}
        </span>
    );

}

interface Options {
    items: {
        name: string;
        number: number;
        gained: number | string | React.ReactNode;
        append?: string;
        info?: string;
    }[];
}

export function StatsBar(options: Options) {
    const [width, setWidth] = useState(0);
    const ref = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        ref.current = setInterval(() => setWidth(window.innerWidth), 1_000);
        return () => {
            if (ref.current) clearInterval(ref.current);
        };
    }, []);

    return (
        <Box
            none
            className="grid w-full rounded-md overflow-hidden divide-x divide-wamellow"
            style={{ gridTemplateColumns: `repeat(${width > 768 ? options.items.length : 2}, minmax(0, 1fr))` }}
        >
            {options.items.slice(0, width > 768 ? 10 : 2).map((item) => (
                <div className="p-5 dark:bg-wamellow bg-wamellow-100" key={"counter" + item.name + item.number.toString() + item.number.toString()}>

                    <div className="flex">
                        <div className="text-sm font-medium mb-1">{item.name}</div>
                        {item.info && <Link href={item.info} className="ml-auto dark:text-neutral-400 text-neutral-600 dark:hover:text-violet-400 hover:text-violet-600 duration-300">
                            <HiInformationCircle />
                            <span className="sr-only">information about this card</span>
                        </Link>}
                    </div>

                    <div className="md:flex">
                        <ClientCountUp className="text-3xl dark:text-neutral-100 text-neutral-900 font-medium" end={item.number} />
                        <div className="text-lg dark:text-violet-400 text-violet-600 font-medium relative md:top-2.5 md:ml-2">
                            {typeof item.gained === "number"
                                ?
                                <>+<ClientCountUp end={item.gained} /> {item.append || "today"}</>
                                :
                                item.gained
                            }
                        </div>
                    </div>

                </div>
            ))}
        </Box>
    );
}