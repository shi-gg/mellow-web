export const repos = [
    "shi-gg/mellow-bot",
    "shi-gg/mellow-tts",
    "shi-gg/mellow-web",
    "shi-gg/mellow-a7s",
    "shi-gg/transgirl",
    "shi-gg/lunify.js",
    "shi-gg/dlist.js",
    "shi-gg/githook",
    "shi-gg/bluesky-media-worker"
] as const;

export enum TeamType {
    Developer = "developer",
    AdditionalProgramming = "additional-programming",
    Donator = "donator"
}

export const developers = [
    {
        id: "821472922140803112",
        team: TeamType.Developer,
        social: "https://ko-fi.com/mwlica"
    },
    {
        id: "362224559459532800",
        team: TeamType.AdditionalProgramming,
        social: "https://ko-fi.com/aurora_loves_women"
    },
    {
        id: "903534295652663326",
        team: TeamType.AdditionalProgramming,
        social: "https://ismcserver.online"
    }
] as const;