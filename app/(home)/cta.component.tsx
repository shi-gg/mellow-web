import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { HiArrowRight, HiUserAdd } from "react-icons/hi";

const montserrat = Montserrat({ subsets: ["latin"] });

export function CallToAction() {
    return (
        <div className="w-full my-8">
            <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-violet-500/20 via-indigo-500/10 to-pink-500/20 p-8 md:p-12">
                <div className="absolute -top-24 -right-24 size-64 bg-violet-400/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 size-64 bg-pink-400/20 rounded-full blur-3xl" />

                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    <h2 className={cn(montserrat.className, "text-3xl md:text-4xl font-bold bg-linear-to-r from-white via-violet-200 to-white bg-clip-text text-transparent mb-4")}>
                        Ready to get started?
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8">
                        Accessibility, social notifications, and more — all free, all in one bot.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="text-base"
                            asChild
                        >
                            <Link href="/login?invite=true" prefetch={false}>
                                <HiUserAdd className="mr-1" />
                                Add to Discord
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            className="text-base"
                            asChild
                        >
                            <Link href="/dashboard">
                                Dashboard
                                <HiArrowRight className="mr-1" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}