import StarIcon from "@/components/icons/star";
import { getReviews } from "@/lib/topgg";
import TopggIcon from "@/public/icons/topgg.webp";
import Image from "next/image";
import Link from "next/link";

export async function Ratings() {
    const reviews = await getReviews();
    const score = Math.round(reviews.averageScore);
    const filledStars = Array.from({ length: Math.max(score, 0) }, (_, star) => star + 1);
    const emptyStars = Array.from({ length: Math.max(5 - score, 0) }, (_, star) => score + star + 1);

    return (
        <Link
            className="flex gap-2 items-center w-fit h-6!"
            href={`https://top.gg/bot/${process.env.NEXT_PUBLIC_CLIENT_ID}`}
            target="_blank"
            title={`Average review score of ${reviews.averageScore}/5 based on ${reviews.count} reviews`}
        >
            <div className="flex gap-1">
                {score ?
                    <div className="flex gap-1">
                        {filledStars.map((star) =>
                            <StarIcon key={star} className="w-6 h-6 stroke-violet-500 fill-violet-400/20" />
                        )}
                    </div>
                    :
                    <></>
                }
                {5 - score ?
                    <div className="flex gap-1">
                        {emptyStars.map((star) =>
                            <StarIcon key={star} className="w-6 h-6 stroke-violet-500 fill-transparent opacity-40" />
                        )}
                    </div>
                    :
                    <></>
                }
            </div>
            <span className="opacity-75 flex relative top-px">
                on
                <Image
                    alt="Top.gg"
                    className="ml-1.5 h-3.5 relative top-[5px] rounded-xs"
                    height={230 / 16.428}
                    src={TopggIcon}
                    width={338 / 16.428}
                    priority
                />
                .gg
            </span>
        </Link>
    );
}