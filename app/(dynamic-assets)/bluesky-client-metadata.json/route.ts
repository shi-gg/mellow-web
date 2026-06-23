import { getBaseUrl, getCanonicalUrl } from "@/utils/urls";
import { createPublicKey } from "node:crypto";

export const revalidate = 691_200; // 8 days

const PUB_KEY = "-----BEGIN PUBLIC KEY-----\n" + process.env.BLUESKY_PUBLIC_KEY + "\n-----END PUBLIC KEY-----";

const jwk = {
    kid: "1",
    use: "sig",
    ...createPublicKey(PUB_KEY).export({ format: "jwk" })
};

export function GET() {
    return Response.json(
        {
            client_id: getCanonicalUrl("bluesky-client-metadata.json"),
            application_type: "web",
            client_name: "Wamellow",
            client_uri: getBaseUrl(),
            logo_uri: getCanonicalUrl("waya-v3.webp"),
            tos_uri: getCanonicalUrl("terms"),
            policy_uri: getCanonicalUrl("privacy"),
            redirect_uris: [
                getCanonicalUrl("login", "bluesky")
            ],
            scope: "atproto transition:generic",
            grant_types: [
                "authorization_code",
                "refresh_token"
            ],
            response_types: [
                "code"
            ],
            token_endpoint_auth_method: "private_key_jwt",
            token_endpoint_auth_signing_alg: "ES256",
            dpop_bound_access_tokens: true,
            jwks: {
                keys: [jwk]
            }
        },
        {
            headers: {
                "Cache-Control": "public, immutable, no-transform, max-age=691200"
            }
        }
    );
}