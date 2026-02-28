"use client";

import { DonationSelect, MONTHLY_PRICES, YEARLY_PRICES } from "@/app/(home)/premium/subscribe.component";
import { userStore } from "@/common/user";
import Box from "@/components/box";
import ImageReduceMotion from "@/components/image-reduce-motion";
import { InputMultiSelect } from "@/components/inputs/multi-select-menu";
import { InputSwitch } from "@/components/inputs/switch";
import Modal from "@/components/modal";
import Notice from "@/components/notice";
import { OverviewLink } from "@/components/overview-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { type ApiEdit, editApiCache, useApi } from "@/lib/api/hook";
import { type ApiV1GuildsGetResponse, type ApiV1UsersMeBillingGetResponse, type ApiV1UsersMeGuildsGetResponse, GuildFlags } from "@/typings";
import { isActive, MAX_PREMIUM_GUILDS } from "@/utils/premium";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { GrAmex } from "react-icons/gr";
import { HiCreditCard, HiLightningBolt } from "react-icons/hi";
import { SiDinersclub, SiDiscover, SiJcb, SiMastercard, SiPaypal, SiStripe, SiVisa } from "react-icons/si";
import { useQueryClient } from "react-query";

export default function Home() {
    const user = userStore((u) => u);
    const [changeDonationModalOpen, setChangeDonationModalOpen] = useState(
        () => typeof window !== "undefined" && window.location.hash === "#donation"
    );

    const { data, isLoading, error, edit } = useApi<ApiV1UsersMeBillingGetResponse>("/users/@me/billing?with_portal_url=true");
    const [nowInSeconds] = useState(() => Date.now() / 1_000);

    const period = useMemo(() => data?.priceId.startsWith("monthly_") ? "month" : "year", [data?.priceId]);
    const basePrice = useMemo(() => period === "year" ? YEARLY_PRICES[0] : MONTHLY_PRICES[0], [period]);

    if ((isLoading && !user?.premium) || (!isLoading && !data) || (data && !isActive(data.status))) {
        return (
            <div className="space-y-4">
                {error && error !== "Not Found" && <Notice message={error} />}

                <OverviewLink
                    title="Upgrade to Premium"
                    message="Get access to premium features, higher limits, and more — such as supporting the project!"
                    url="/premium"
                    icon={<HiLightningBolt />}
                />

                {data?.portalUrl && (
                    <Button asChild>
                        <Link href={data.portalUrl} target="_blank">
                            Billing Portal
                        </Link>
                    </Button>
                )}
            </div>
        );
    }

    const periodEndsIn = data ? getPeriodEndsIn(data.currentPeriodEnd, nowInSeconds) : "...";
    const totalAmount = data ? (basePrice + (data.donationQuantity || 0)).toFixed(2) : "0.00";

    return (
        <div className="space-y-4">
            {data?.status === "past_due" && (
                <Notice message={`Your renewal is overdue! Please check your emails to renew your subscription or contact support. Your subscription will be canceled ${periodEndsIn}.`} />
            )}

            <Box className="md:flex justify-between items-center" small>
                <div className="flex flex-col">
                    <h2 className="font-bold text-3xl bg-linear-to-r bg-clip-text text-transparent from-violet-400/80 to-indigo-400/80">
                        Wamellow Premium
                        {data?.status === "trialing" && (
                            <Badge className="relative bottom-1 ml-2">
                                Trial — Ends {periodEndsIn}
                            </Badge>
                        )}
                    </h2>
                    <p className="text-muted-foreground">
                        You have all premium features for <span className="font-semibold text-neutral-300">EUR {totalAmount} / {period.replace(/^\w/, (c) => c.toUpperCase())}</span>!
                    </p>
                </div>
                <div className="flex gap-1 mt-4 md:mt-0">
                    {isLoading || !data ? (
                        <Skeleton className="h-10 w-full md:w-20" />
                    ) : (
                        <PortalButton data={data} />
                    )}
                </div>
            </Box>

            <div className="flex flex-col lg:flex-row gap-4">
                <Box className="lg:w-1/2 text-sm" small>
                    <h2 className="font-semibold text-xl text-neutral-300 mb-2">Billing Cycle</h2>
                    {isLoading || !data ? (
                        <Skeleton className="h-12 w-full" />
                    ) : data.cancelAtPeriodEnd ? (
                        <p>
                            The subscription will expire on <span className="font-semibold text-neutral-300">{formatDate(data.currentPeriodEnd)}</span> and you will not be charged again.
                        </p>
                    ) : (
                        <p>
                            The subscription will renew on <span className="font-semibold text-neutral-300">{formatDate(data.currentPeriodEnd)}</span>, for a total of <span className="font-semibold text-neutral-300">EUR {totalAmount}</span>.
                            <br />
                            You{"'"}re paying <span className="font-semibold text-neutral-300">EUR {basePrice} Premium</span> and <span className="font-semibold text-neutral-300">EUR {(data.donationQuantity || 0).toFixed(2)} Donation{(data.donationQuantity || 0) === 1 ? "" : "s"}</span>
                            {" "}
                            (<Button
                                className="text-sm p-0 m-0 h-3 text-violet-400"
                                onClick={() => setChangeDonationModalOpen(true)}
                                variant="link"
                                size="sm"
                            >
                                change
                            </Button>).
                        </p>
                    )}
                </Box>
                <Box className="lg:w-1/2" small>
                    <h2 className="font-semibold text-xl text-neutral-300 mb-2">Payment Method</h2>
                    {isLoading || !data?.portalUrl ? (
                        <Skeleton className="h-12 w-full" />
                    ) : (
                        <div className="flex gap-2 items-center bg-wamellow-100 px-4 py-2 rounded-lg">
                            <PaymentMethodIcon method={data.paymentMethod} />
                            <span className="text-neutral-200">{getPaymentMethodInfo(data.paymentMethod)}</span>

                            <Button asChild className="ml-auto" variant="link">
                                <Link href={data.portalUrl}>
                                    Change
                                </Link>
                            </Button>
                        </div>
                    )}
                </Box>
            </div>

            <div className="pt-2">
                <PremiumGuildSelect
                    isParentLoading={isLoading || !data}
                    guildIds={data?.guildIds || []}
                    edit={edit}
                />
            </div>

            {data && (
                <ChangeDonationAmountModal
                    open={changeDonationModalOpen}
                    setOpen={setChangeDonationModalOpen}
                    donationQuantity={data.donationQuantity || 0}
                    trialing={data.status === "trialing"}
                    basePrice={basePrice}
                    period={period}
                    edit={edit}
                />
            )}
        </div>
    );
}

function formatDate(seconds: number) {
    return new Date(seconds * 1_000).toLocaleDateString();
}

function getPeriodEndsIn(endsAt: number, nowInSeconds: number) {
    const days = Math.floor((endsAt - nowInSeconds) / (60 * 60 * 24));
    if (days <= 0) return "Today";
    if (days === 1) return "Tomorrow";
    return `in ${days} days`;
}

function PortalButton({ data }: { data: ApiV1UsersMeBillingGetResponse; }) {
    const path = getPortalPath(data);
    const label = path?.split("/").pop()?.replace(/^\w/, (c) => c.toUpperCase()) || "Manage";

    return (
        <Button asChild className="w-full md:w-auto">
            <Link href={`${data.portalUrl}/${path}`}>
                {label}
            </Link>
        </Button>
    );
}

function getPortalPath(data: ApiV1UsersMeBillingGetResponse) {
    if (data.cancelAtPeriodEnd) return `subscriptions/${data.subscriptionId}/reactivate`;
    return `subscriptions/${data.subscriptionId}/cancel`;
}

function PaymentMethodIcon({ method }: { method?: ApiV1UsersMeBillingGetResponse["paymentMethod"]; }) {
    if (!method) return <HiCreditCard className="size-6" />;

    switch (method.brand) {
        case "paypal": return <SiPaypal className="size-6" />;
        case "amex": return <GrAmex className="size-6" />;
        case "diners": return <SiDinersclub className="size-6" />;
        case "discover": return <SiDiscover className="size-6" />;
        case "jcb": return <SiJcb className="size-6" />;
        case "link": return <SiStripe className="size-6" />;
        case "mastercard": return <SiMastercard className="size-6" />;
        case "visa": return <SiVisa className="size-6" />;
        default: return <HiCreditCard className="size-6" />;
    }
}

function getPaymentMethodInfo(method?: ApiV1UsersMeBillingGetResponse["paymentMethod"]) {
    if (!method) return "Unknown";

    if ("email" in method) return method.email ?? "PayPal";
    if ("last4" in method) return method.last4 ? `•••• •••• •••• ${method.last4}` : "Card";

    return "Unknown";
}

function PremiumGuildSelect({
    isParentLoading,
    guildIds,
    edit
}: {
    isParentLoading: boolean;
    guildIds: string[];
    edit: ApiEdit<ApiV1UsersMeBillingGetResponse>;
}) {
    const queryClient = useQueryClient();
    const { isLoading, data, error } = useApi<ApiV1UsersMeGuildsGetResponse[]>("/users/@me/guilds");

    const editGuildPremium = useCallback(
        (guildId: string, action: "add" | "remove") => {
            queryClient.setQueryData<ApiV1GuildsGetResponse | undefined>(`/guilds/${guildId}`, (guild) => {
                if (!guild) return guild;

                return {
                    ...guild,
                    flags: action === "add"
                        ? ((guild?.flags || 0) | GuildFlags.Premium)
                        : ((guild?.flags || 0) & ~GuildFlags.Premium)
                } satisfies ApiV1GuildsGetResponse;
            });
        },
        [queryClient]
    );

    if (isLoading || isParentLoading) {
        return (
            <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col gap-2 mt-2">
                <Skeleton className="w-32 h-5 rounded-lg" />
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-5 rounded-lg" />
            </div>
        );
    }

    if (error) return <Notice message={error} />;

    return (
        <InputMultiSelect
            className="w-full md:w-1/2 lg:w-1/3"
            label="Premium Guilds"
            endpoint="/users/@me/billing/premium-guilds"
            k="guildIds"
            items={(data || [])
                .filter((guild) => guild.bot)
                .map((guild) => ({
                    icon: (
                        <ImageReduceMotion
                            alt={guild.name}
                            className="rounded-md size-6 relative right-2"
                            url={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}
                            size={32}
                        />
                    ),
                    name: guild.name,
                    value: guild.id
                }))
            }
            description="Select guilds where you want to enable premium features."
            defaultState={guildIds}
            max={MAX_PREMIUM_GUILDS}
            onSave={(newGuildIds) => {
                edit("guildIds", newGuildIds);

                editApiCache<ApiV1UsersMeBillingGetResponse>(queryClient, "/users/@me/billing?with_portal_url=false")("guildIds", newGuildIds);

                for (const guildId of newGuildIds) editGuildPremium(guildId, "add");
                for (const guildId of guildIds.filter((guildId) => !newGuildIds.includes(guildId))) editGuildPremium(guildId, "remove");

            }}
        />
    );
}

function ChangeDonationAmountModal({
    open,
    setOpen,
    donationQuantity: defaultDonationQuantity,
    trialing,
    basePrice,
    period,
    edit
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    donationQuantity: number;
    trialing: boolean;
    basePrice: number;
    period: "month" | "year";
    edit: ApiEdit<ApiV1UsersMeBillingGetResponse>;
}) {
    const [donation, setDonation] = useState(defaultDonationQuantity);
    const [terms, setTerms] = useState(false);
    const captcha = useRef<TurnstileInstance>(null);

    const dueToday = donation - defaultDonationQuantity;

    return (
        <Modal
            title="Change Donation Amount"
            isOpen={open}
            onClose={() => setOpen(false)}
            onSubmit={() => {
                return fetch(`${process.env.NEXT_PUBLIC_API}/users/@me/billing`, {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        captcha: captcha.current!.getResponse()!
                    },
                    body: JSON.stringify({
                        donationQuantity: donation,
                        terms
                    })
                });
            }}
            onSuccess={() => {
                edit("donationQuantity", donation);
            }}
            onError={() => {
                captcha.current?.reset();
            }}
            isDisabled={donation === defaultDonationQuantity || !terms}
        >
            <p className="text-sm mb-6">
                Change how much you want to donate on top of your {period}ly premium subscription.
                Please do not feel pressured to donate more than you can afford.
                I appreciate any additional support you can provide 💜
            </p>

            <DonationSelect
                className="w-full"
                donation={donation}
                setDonation={setDonation}
            />

            <div className="mt-8 space-y-4">
                <Separator />

                {dueToday > 0 && (
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-lg font-medium text-neutral-100">Due Today</h2>
                            <p className="text-sm text-neutral-500">
                                {trialing
                                    ? "Due to your active trial, you will not be charged today."
                                    : "You will receive an invoice via email."
                                }
                            </p>
                        </div>
                        <span className="text-xl font-medium text-neutral-100">€{trialing ? "0.00" : dueToday.toFixed(2)}</span>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-medium text-neutral-100">
                            {period.replace(/^\w/, (c) => c.toUpperCase())}ly Total
                        </h2>
                        <p className="text-sm text-neutral-500">The total amount you will be charged {period}ly.</p>
                    </div>
                    <span className="text-xl font-medium text-neutral-100">€{(donation + basePrice).toFixed(2)}</span>
                </div>

                <Separator />
            </div>

            <div className="mt-6">
                <InputSwitch
                    label="I agree to the terms and conditions"
                    description="I waive my right of withdrawal."
                    link="/terms"
                    defaultState={terms}
                    onSave={setTerms}
                    isTickbox
                />
            </div>

            <Turnstile
                className="mt-8"
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_KEY!}
                options={{
                    size: "flexible",
                    theme: "dark"
                }}
                ref={captcha}
            />
        </Modal>
    );
}