import { notFound, redirect } from "next/navigation";

interface Props {
    params: Promise<{ pathname: string; }>;
}

const utm = "?utm_source=wamellow.com&utm_medium=redirect";

export default async function Home({ params }: Props) {
    const { pathname } = await params;

    switch (pathname) {
        case "support": return redirect("https://discord.com/invite/DNyyA2HFM9");
        case "vote": return redirect("https://top.gg/bot/1125449347451068437/vote" + utm);
        case "invite":
        case "add":
        case "get": return redirect("/login?invite=true");
        case "logout": return redirect("/login?logout=true");
        case "docs":
        case "guides": return redirect("/docs");
        case "tts": return redirect("https://youtube.com/watch?v=NS5fZ1ltovE");
        case "disable-commands": return redirect("https://youtube.com/watch?v=ehc0_whydu8");
        case "youtube": return redirect("https://www.youtube.com/channel/UClWBeVcz5LUmcCN1gHG_GCg");
        case "translate": return redirect("https://crowdin.com/project/wamellow");
        case "ref":
        case "server":
        case "kvm":
        case "vps": return redirect("https://datalix.eu/a/luna" + utm);
        case "deref": return redirect("https://datalix.de/a/luna" + utm);
    }

    notFound();
}