export const repos = [
    "shi-gg/mellow-bot",
    "shi-gg/mellow-tts",
    "shi-gg/mellow-web",
    "shi-gg/mellow-a7s",
    "shi-gg/mellow-images",
    "shi-gg/linkdave",
    "shi-gg/transgirl",
    "shi-gg/lunify.js",
    "shi-gg/dlist.js",
    "shi-gg/githook",
    "shi-gg/eslint",
    "shi-gg/bluesky-media-worker"
] as const;

export enum TeamType {
    Developer = "developer",
    Legal = "legal",
    Translator = "translator",
    Donator = "donator"
}

export const developers = [
    {
        id: "821472922140803112",
        team: TeamType.Developer,
        social: "https://ko-fi.com/mwlica"
    },
    /* Legal */
    {
        id: "778557320123777026",
        team: TeamType.Legal
    },
    {
        id: "301482272497074189",
        team: TeamType.Legal
    },
    /* Translators */
    {
        id: "1328101060639719497",
        team: TeamType.Translator
    },
    {
        id: "329671025312923648",
        team: TeamType.Translator
    },
    {
        id: "453944662093332490",
        team: TeamType.Translator
    },
    {
        id: "272360827569569793",
        team: TeamType.Translator
    },
    {
        id: "1160426569156808734",
        team: TeamType.Translator
    },
    {
        id: "778557320123777026",
        team: TeamType.Translator
    },
    {
        id: "334311623546372097",
        team: TeamType.Translator
    },
    {
        id: "627594217232924695",
        team: TeamType.Translator
    },
    {
        id: "918132622427832330",
        team: TeamType.Translator
    },
    {
        id: "225176015016558593",
        team: TeamType.Translator
    },
    {
        id: "301482272497074189",
        team: TeamType.Translator
    },
    {
        id: "797012765352001557",
        team: TeamType.Translator
    }
] as const;