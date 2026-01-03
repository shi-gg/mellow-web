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

export const members = [
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
    },

    {
        id: "301482272497074189",
        team: TeamType.Donator
    },
    {
        id: "797012765352001557",
        team: TeamType.Donator,
        social: "https://crni.xyz"
    },
    {
        id: "1044032607207301160",
        team: TeamType.Donator,
        social: "https://notifyme.bot"
    },
    {
        id: "742224557632389160",
        team: TeamType.Donator
    },
    {
        id: "340243638892101646",
        team: TeamType.Donator,
        social: "https://sattler.dev"
    },
    {
        id: "911823996767600730",
        team: TeamType.Donator,
        social: "https://ibcheechy.com"
    },
    {
        id: "748968886237397036",
        team: TeamType.Donator,
        social: "https://www.tiktok.com/@.noxern"
    },
    {
        id: "313711746550595594",
        team: TeamType.Donator,
        social: "https://discord.gg/RmAF3DkQXd"
    },
    {
        id: "452848052810547201",
        team: TeamType.Donator,
        social: "https://z1.gg"
    },
    {
        id: "77755087602065408",
        team: TeamType.Donator,
        social: "https://notswayze.stream"
    },
    {
        id: "354390108918644739",
        team: TeamType.Donator
    },
    {
        id: "202042394428964865",
        team: TeamType.Donator
    },
    {
        id: "657078394063945758",
        team: TeamType.Donator
    },
    {
        id: "1118157956387700857",
        team: TeamType.Donator
    },
    {
        id: "1322077071920336897",
        team: TeamType.Donator
    }
] as const;