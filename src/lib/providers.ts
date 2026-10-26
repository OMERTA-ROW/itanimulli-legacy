// Client-safe catalog of gaming account providers. No secrets live here — only the
// *names* of the server-side secrets each adapter needs. Add a provider by adding an
// entry here and (for public OAuth/OpenID providers) an adapter in providers.server.ts.

export type ProviderId = "playstation" | "xbox" | "microsoft" | "steam" | "epic" | "nintendo" | "discord";

export type ProviderAccess =
  | "public-openid" // official public sign-in, no partner contract needed
  | "public-oauth" // official OAuth, needs an app registration (client ID + secret)
  | "partner-only"; // only available to approved platform partners

export type ProviderState = "available" | "not_configured" | "requires_developer_access";

export interface ProviderInfo {
  id: ProviderId;
  name: string;
  priority: boolean;
  access: ProviderAccess;
  method: string;
  requiredSecrets: string[];
  optionalSecrets?: string[];
  docsUrl: string;
  setup: string[];
  note?: string;
}

export const PROVIDERS: ProviderInfo[] = [
  {
    id: "playstation",
    name: "PlayStation Network",
    priority: true,
    access: "partner-only",
    method: "PSN account linking (PlayStation Partners program only)",
    requiredSecrets: [],
    docsUrl: "https://partners.playstation.net/",
    setup: [
      "Apply to PlayStation Partners as a company and sign Sony's developer agreements.",
      "Request PSN web account-linking access for this title from Sony.",
      "Sony issues client credentials and its own linking rules; only then can an adapter be written.",
    ],
    note: "Sony offers no public sign-in for third-party websites. This app never asks for PSN passwords.",
  },
  {
    id: "xbox",
    name: "Xbox network",
    priority: true,
    access: "partner-only",
    method: "Xbox services sign-in for title websites (XSTS tokens, Partner Center)",
    requiredSecrets: [],
    docsUrl:
      "https://learn.microsoft.com/en-us/gaming/gdk/docs/services/fundamentals/s2s-auth-calls/service-authentication/live-website-authentication",
    setup: [
      "Enroll the title in ID@Xbox or the Xbox Managed Partner program and create it in Partner Center.",
      "Configure the title's relying party / XSTS token settings for this website in Partner Center.",
      "Register the website in Microsoft Entra ID and connect it to the Partner Center title.",
      "Only then can the server exchange a Microsoft sign-in for an Xbox XSTS token (gamertag, XUID).",
    ],
    note: "A Microsoft account link proves Microsoft identity only. It does not grant Xbox gamertag, achievements or multiplayer rights.",
  },
  {
    id: "microsoft",
    name: "Microsoft account",
    priority: true,
    access: "public-oauth",
    method: "Microsoft identity platform (OpenID Connect, auth code + PKCE)",
    requiredSecrets: ["MICROSOFT_LINK_CLIENT_ID", "MICROSOFT_LINK_CLIENT_SECRET"],
    docsUrl: "https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols-oidc",
    setup: [
      "Azure portal → Microsoft Entra ID → App registrations → New registration.",
      "Supported account types: Personal Microsoft accounts only (matches the 'consumers' endpoint used here).",
      "Add a Web redirect URI: <site>/api/public/link/microsoft/callback.",
      "Certificates & secrets → New client secret. Save the ID and secret as MICROSOFT_LINK_CLIENT_ID / MICROSOFT_LINK_CLIENT_SECRET.",
    ],
    note: "Identity only — distinct from Xbox authorization.",
  },
  {
    id: "steam",
    name: "Steam",
    priority: true,
    access: "public-openid",
    method: "Sign in through Steam (OpenID 2.0, server-verified with check_authentication)",
    requiredSecrets: [],
    optionalSecrets: ["STEAM_WEB_API_KEY"],
    docsUrl: "https://partner.steamgames.com/doc/features/auth",
    setup: [
      "No registration required for the SteamID link itself.",
      "Optional: add STEAM_WEB_API_KEY (steamcommunity.com/dev/apikey) to show the Steam persona name.",
    ],
  },
  {
    id: "epic",
    name: "Epic Games",
    priority: false,
    access: "public-oauth",
    method: "Epic Account Services (OAuth 2.0 auth code)",
    requiredSecrets: ["EPIC_CLIENT_ID", "EPIC_CLIENT_SECRET"],
    docsUrl: "https://dev.epicgames.com/docs/epic-account-services/auth/auth-interface",
    setup: [
      "Create a product in the Epic Developer Portal and enable Epic Account Services.",
      "Create a client with the 'basic_profile' permission and add redirect URL <site>/api/public/link/epic/callback.",
      "Complete Epic's brand review for the application before public use.",
      "Save EPIC_CLIENT_ID / EPIC_CLIENT_SECRET.",
    ],
  },
  {
    id: "nintendo",
    name: "Nintendo Account",
    priority: false,
    access: "partner-only",
    method: "Nintendo Developer Portal (licensed developers only)",
    requiredSecrets: [],
    docsUrl: "https://developer.nintendo.com/",
    setup: [
      "Become a licensed Nintendo developer.",
      "Request Nintendo Account integration for the title; Nintendo provides the method and credentials.",
    ],
    note: "Nintendo offers no public account-linking method for third-party websites.",
  },
  {
    id: "discord",
    name: "Discord",
    priority: false,
    access: "public-oauth",
    method: "Discord OAuth2 (identify scope)",
    requiredSecrets: ["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET"],
    docsUrl: "https://discord.com/developers/docs/topics/oauth2",
    setup: [
      "Discord Developer Portal → New Application → OAuth2.",
      "Add redirect <site>/api/public/link/discord/callback.",
      "Save DISCORD_CLIENT_ID / DISCORD_CLIENT_SECRET.",
    ],
  },
];

export function getProvider(id: string): ProviderInfo | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

/** Decides what a provider can honestly offer given which server secrets exist. */
export function resolveProviderState(p: ProviderInfo, presentSecrets: ReadonlySet<string>): ProviderState {
  if (p.access === "partner-only") return "requires_developer_access";
  return p.requiredSecrets.every((s) => presentSecrets.has(s)) ? "available" : "not_configured";
}

export function callbackPath(id: ProviderId) {
  return `/api/public/link/${id}/callback`;
}
