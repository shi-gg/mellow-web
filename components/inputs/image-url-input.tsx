"use client";

import { cn } from "@/utils/cn";
import { type InputProps, InputState, useInput } from "@/utils/input";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TailSpin } from "react-loading-icons";

import { Badge } from "../ui/badge";
import { Input } from "../ui/input";

enum ImageState {
    Idle = 0,
    Loading = 1,
    Errored = 2,
    Success = 3
}

interface Props {
    link?: string;
    badge?: string;
    ratio?: `aspect-${string}`;
}

export default function InputImageUrl({
    className,

    label,
    link,
    badge,
    description,
    disabled,
    ratio = "aspect-[906/256]",

    endpoint,
    url, // @deprecated - use endpoint instead
    k,
    dataName, // @deprecated - use k instead

    defaultState,
    transform,

    onSave
}: InputProps<string> & Props) {
    const {
        value,
        state,
        error,
        update,
        save
    } = useInput({
        endpoint,
        url,
        k,
        dataName,

        defaultState,
        transform: transform ?? ((v) => v || null),

        onSave,
        manual: true // Only save when image loads successfully
    });

    const [imageState, setImageState] = useState<ImageState>(ImageState.Idle);
    const [debouncedUrl, setDebouncedUrl] = useState(value);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Debounce URL changes before attempting to load image
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // If empty, update immediately
        if (!value?.length) {
            debounceRef.current = setTimeout(() => {
                setDebouncedUrl(value);
                setImageState(ImageState.Idle);
            }, 0);
            return () => {
                if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                }
            };
        }

        setImageState(ImageState.Loading);

        debounceRef.current = setTimeout(() => {
            setDebouncedUrl(value);
        }, 800);

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [value]);

    const handleImageLoad = () => {
        setImageState(ImageState.Success);
        // Image loaded successfully, now save
        save();
    };

    const handleImageError = () => {
        setImageState(ImageState.Errored);
        // Don't save - image failed to load
    };

    const isDisabled = state === InputState.Loading || disabled;

    return (
        <div className={cn("relative w-full", description && "mb-2", className)}>
            <div className="flex items-center gap-2 mb-1">
                <span className="sm:text-lg font-medium text-neutral-100">
                    {label}
                </span>

                {badge && (
                    <Badge variant="flat" size="sm">
                        {badge}
                    </Badge>
                )}

                {state === InputState.Loading && (
                    <TailSpin stroke="#d4d4d4" strokeWidth={8} className="relative h-3 w-3 overflow-visible" />
                )}
            </div>

            <div className="lg:flex w-full gap-4">
                <div className="flex-1">
                    <Input
                        className="dark:bg-wamellow bg-wamellow-100 border-none h-12"
                        placeholder="Paste a direct image url..."
                        value={value || ""}
                        onChange={(e) => update(e.target.value)}
                        disabled={isDisabled}
                        maxLength={256}
                    />

                    {description && (
                        <div className="text-neutral-500 text-sm mt-1">
                            {description}
                            {link && <> <Link href={link} target="_blank" className="text-violet-400 hover:underline">Learn more</Link></>}
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm mt-1">
                            {error}
                        </div>
                    )}
                </div>

                <div className="lg:max-w-1/2 w-full mt-2 lg:mt-0">
                    {debouncedUrl && imageState !== ImageState.Errored ? (
                        <div className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={debouncedUrl}
                                alt="Preview"
                                className={cn(
                                    "rounded-lg w-full h-full object-cover",
                                    ratio,
                                    imageState === ImageState.Loading && "opacity-50"
                                )}
                                onError={handleImageError}
                                onLoad={handleImageLoad}
                            />
                            {imageState === ImageState.Loading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <TailSpin stroke="#d4d4d4" strokeWidth={8} className="h-8 w-8" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={cn(
                            "w-full border-2 rounded-lg flex items-center justify-center dark:border-wamellow border-wamellow-100",
                            imageState === ImageState.Errored && "dark:border-red-500 border-red-300",
                            ratio
                        )}>
                            {imageState === ImageState.Errored ? (
                                <div className="text-red-400 m-4 text-center">
                                    <div className="font-medium">Enter a valid image url!</div>
                                    <div className="text-xs mt-1">
                                        <div>Recommended resolution: 1024x256</div>
                                        <div>Supported types: .png, .jpg, .jpeg, .webp</div>
                                    </div>
                                </div>
                            ) : (
                                <span className="text-neutral-400">Enter an image url to preview</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}