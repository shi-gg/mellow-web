// https://docs.top.gg/api/v1/projects
export interface TopggBot {
    review_score: number;
    review_count: number;
}

export async function getTopggBot() {
    const res = await fetch("https://top.gg/api/v1/projects/@me", {
        headers: {
            authorization: "Bearer " + process.env.TOPGG_TOKEN!
        },
        next: { revalidate: 60 * 60 }
    });

    if (!res.ok) {
        return {
            review_score: 5,
            review_count: 1
        };
    }

    return res.json() as Promise<TopggBot>;
}