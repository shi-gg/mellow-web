import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return Array.from({ length: 20 }, (_, i) => (
        <div
            key={`leaderboard-loading-${i + 1}`}
            className="mb-4 rounded-md p-3 flex items-center dark:bg-wamellow bg-wamellow-100 w-full"
        >
            <Skeleton className="rounded-full w-12 h-12 mr-3" />

            <div className="flex flex-col gap-2 mt-0.5">
                <Skeleton className="h-5 w-28 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
            </div>

            <Skeleton className="ml-auto h-8 w-14 rounded-lg" />

            <Skeleton className="rounded-full w-12 h-12 ml-3" />
        </div>
    ));
}