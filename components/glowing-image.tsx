/* eslint-disable @next/next/no-img-element */
import { cn } from "@/utils/cn";

interface GlowingImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
}

export function GlowingImage({
    src,
    alt,
    width,
    height,
    className
}: GlowingImageProps) {
    return (
        <div className={cn("relative inline-block", className)}>
            <div className="absolute inset-0 -m-8 opacity-60">
                <img
                    src={src}
                    alt=""
                    width={width}
                    height={height}
                    className="w-full h-full object-cover blur-3xl scale-105"
                    loading="lazy"
                    decoding="async"
                />
            </div>

            <div className="relative z-10">
                <img
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    className="rounded-xl"
                    loading="lazy"
                    decoding="async"
                />
            </div>
        </div>
    );
}