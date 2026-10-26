// Server-only provider adapters. Secrets are read from process.env by callers and
// passed in; nothing here is reachable from the browser bundle.
import type { ProviderId } from "./providers";

export type Env = Record<string, string | undefined>;

export interface StartCtx {
  state: string;
  nonce: string;
  codeChallenge: string;
  redirectUri: string;
  origin: string;
  env: Env;
}
export interface CompleteCtx {
  url: URL;
  redirectUri: string;
  nonce: string;
  codeVerifier: string | null;
  env: Env;
  fetchImpl?: typeof fetch;
}
export interface LinkedIdentity {
  providerUserId: string;
  displayName: string | null;
}
interface Adapter {
  authorizeUrl(ctx: StartCtx): string;
  complete(ctx: CompleteCtx): Promise<LinkedIdentity>;
}

export class LinkError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

// ---------- Steam (OpenID 2.0) ----------
export const STEAM_OP = "https://steamcommunity.com/openid/login";
const OPENID_NS = "http://specs.openid.net/auth/2.0";
const IDENTIFIER_SELECT = "http://specs.openid.net/auth/2.0/identifier_select";

export function parseSteamClaimedId(claimed: string | null): string | null {
  const m = /^https:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/.exec(claimed ?? "");
  return m ? m[1]! : null;
}

/** Validates the assertion shape locally before asking Steam to confirm it. */
export function checkSteamAssertion(url: URL, redirectUri: string): string {
  const p = url.searchParams;
  if (p.get("openid.mode") !== "id_res") throw new LinkError("cancelled", "Steam sign-in was cancelled.");
  if (p.get("openid.ns") !== OPENID_NS) throw new LinkError("invalid", "Unexpected OpenID namespace.");
  if (p.get("openid.op_endpoint") !== STEAM_OP) throw new LinkError("invalid", "Assertion not from Steam.");
  const returnTo = p.get("openid.return_to") ?? "";
  if (!returnTo.startsWith(redirectUri + "?")) throw new LinkError("invalid", "return_to mismatch.");
  if (new URL(returnTo).searchParams.get("state") !== p.get("state")) throw new LinkError("invalid", "State mismatch.");
  const signed = (p.get("openid.signed") ?? "").split(",");
  for (const f of ["claimed_id", "identity", "return_to", "response_nonce", "assoc_handle", "op_endpoint"]) {
    if (!signed.includes(f)) throw new LinkError("invalid", `Unsigned field ${f}.`);
  }
  const id = parseSteamClaimedId(p.get("openid.claimed_id"));
  if (!id || p.get("openid.identity") !== p.get("openid.claimed_id")) throw new LinkError("invalid", "Bad SteamID.");
  return id;
}

const steam: Adapter = {
  authorizeUrl({ state, redirectUri, origin }) {
    const u = new URL(STEAM_OP);
    u.searchParams.set("openid.ns", OPENID_NS);
    u.searchParams.set("openid.mode", "checkid_setup");
    u.searchParams.set("openid.return_to", `${redirectUri}?state=${encodeURIComponent(state)}`);
    u.searchParams.set("openid.realm", origin);
    u.searchParams.set("openid.identity", IDENTIFIER_SELECT);
    u.searchParams.set("openid.claimed_id", IDENTIFIER_SELECT);
    return u.toString();
  },
  async complete({ url, redirectUri, env, fetchImpl = fetch }) {
    const steamId = checkSteamAssertion(url, redirectUri);
    const body = new URLSearchParams();
    url.searchParams.forEach((v, k) => {
      if (k.startsWith("openid.")) body.set(k, v);
    });
    body.set("openid.mode", "check_authentication");
    const res = await fetchImpl(STEAM_OP, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const text = await res.text();
    if (!res.ok || !/(^|\n)is_valid:true(\n|$)/.test(text)) {
      throw new LinkError("invalid", "Steam did not confirm the sign-in.");
    }
    let displayName: string | null = null;
    const key = env["STEAM_WEB_API_KEY"];
    if (key) {
      try {
        const r = await fetchImpl(
          `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${encodeURIComponent(key)}&steamids=${steamId}`,
        );
        const j = (await r.json()) as { response?: { players?: { personaname?: string }[] } };
        displayName = j.response?.players?.[0]?.personaname ?? null;
      } catch {
        displayName = null;
      }
    }
    return { providerUserId: steamId, displayName };
  },
};

// ---------- Generic OAuth helpers ----------
function decodeJwtPayload(jwt: string): Record<string, unknown> {
  const part = jwt.split(".")[1];
  if (!part) throw new LinkError("invalid", "Malformed ID token.");
  const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json) as Record<string, unknown>;
}

async function postToken(fetchImpl: typeof fetch, url: string, body: URLSearchParams, basic?: string) {
  const headers: Record<string, string> = { "content-type": "application/x-www-form-urlencoded" };
  if (basic) headers["authorization"] = `Basic ${basic}`;
  const res = await fetchImpl(url, { method: "POST", headers, body });
  if (!res.ok) throw new LinkError("token", "The provider rejected the sign-in code.");
  return (await res.json()) as Record<string, unknown>;
}

function codeFrom(url: URL) {
  if (url.searchParams.get("error")) throw new LinkError("cancelled", "Sign-in was cancelled at the provider.");
  const code = url.searchParams.get("code");
  if (!code) throw new LinkError("invalid", "Missing authorization code.");
  return code;
}

// ---------- Microsoft identity (NOT Xbox) ----------
const MS_BASE = "https://login.microsoftonline.com/consumers/oauth2/v2.0";
const MS_CONSUMER_TENANT = "9188040d-6c67-4c5b-b112-36a304b66dad";
const microsoft: Adapter = {
  authorizeUrl({ state, nonce, codeChallenge, redirectUri, env }) {
    const u = new URL(`${MS_BASE}/authorize`);
    u.search = new URLSearchParams({
      client_id: env["MICROSOFT_LINK_CLIENT_ID"]!,
      response_type: "code",
      redirect_uri: redirectUri,
      response_mode: "query",
      scope: "openid profile",
      state,
      nonce,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      prompt: "select_account",
    }).toString();
    return u.toString();
  },
  async complete({ url, redirectUri, nonce, codeVerifier, env, fetchImpl = fetch }) {
    const clientId = env["MICROSOFT_LINK_CLIENT_ID"]!;
    const tok = await postToken(
      fetchImpl,
      `${MS_BASE}/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: env["MICROSOFT_LINK_CLIENT_SECRET"]!,
        grant_type: "authorization_code",
        code: codeFrom(url),
        redirect_uri: redirectUri,
        code_verifier: codeVerifier ?? "",
      }),
    );
    // ID token received directly from the token endpoint over TLS (OIDC Core 3.1.3.7).
    const claims = decodeJwtPayload(String(tok["id_token"] ?? ""));
    if (claims["aud"] !== clientId) throw new LinkError("invalid", "ID token audience mismatch.");
    if (claims["nonce"] !== nonce) throw new LinkError("invalid", "ID token nonce mismatch.");
    if (claims["iss"] !== `https://login.microsoftonline.com/${MS_CONSUMER_TENANT}/v2.0`)
      throw new LinkError("invalid", "ID token issuer mismatch.");
    if (typeof claims["exp"] !== "number" || claims["exp"] * 1000 < Date.now())
      throw new LinkError("invalid", "ID token expired.");
    return { providerUserId: String(claims["sub"]), displayName: (claims["name"] as string) ?? null };
  },
};

// ---------- Discord ----------
const discord: Adapter = {
  authorizeUrl({ state, codeChallenge, redirectUri, env }) {
    const u = new URL("https://discord.com/oauth2/authorize");
    u.search = new URLSearchParams({
      client_id: env["DISCORD_CLIENT_ID"]!,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: "identify",
      state,
      prompt: "consent",
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    }).toString();
    return u.toString();
  },
  async complete({ url, redirectUri, codeVerifier, env, fetchImpl = fetch }) {
    const tok = await postToken(
      fetchImpl,
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: env["DISCORD_CLIENT_ID"]!,
        client_secret: env["DISCORD_CLIENT_SECRET"]!,
        grant_type: "authorization_code",
        code: codeFrom(url),
        redirect_uri: redirectUri,
        code_verifier: codeVerifier ?? "",
      }),
    );
    const me = await fetchImpl("https://discord.com/api/users/@me", {
      headers: { authorization: `Bearer ${String(tok["access_token"])}` },
    });
    if (!me.ok) throw new LinkError("token", "Could not read the Discord profile.");
    const j = (await me.json()) as { id: string; global_name?: string; username?: string };
    return { providerUserId: j.id, displayName: j.global_name ?? j.username ?? null };
  },
};

// ---------- Epic Account Services ----------
const epic: Adapter = {
  authorizeUrl({ state, redirectUri, env }) {
    const u = new URL("https://www.epicgames.com/id/authorize");
    u.search = new URLSearchParams({
      client_id: env["EPIC_CLIENT_ID"]!,
      response_type: "code",
      redirect_uri: redirectUri,
      scope: "basic_profile",
      state,
    }).toString();
    return u.toString();
  },
  async complete({ url, redirectUri, env, fetchImpl = fetch }) {
    const basic = btoa(`${env["EPIC_CLIENT_ID"]}:${env["EPIC_CLIENT_SECRET"]}`);
    const tok = await postToken(
      fetchImpl,
      "https://api.epicgames.dev/epic/oauth/v2/token",
      new URLSearchParams({ grant_type: "authorization_code", code: codeFrom(url), redirect_uri: redirectUri }),
      basic,
    );
    const id = tok["account_id"];
    if (typeof id !== "string" || !id) throw new LinkError("invalid", "Epic returned no account ID.");
    return { providerUserId: id, displayName: null };
  },
};

export const ADAPTERS: Partial<Record<ProviderId, Adapter>> = { steam, microsoft, discord, epic };

// ---------- crypto helpers ----------
export function randomToken(bytes = 32) {
  const a = crypto.getRandomValues(new Uint8Array(bytes));
  return base64url(a);
}
function base64url(a: Uint8Array) {
  let s = "";
  a.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export async function pkceChallenge(verifier: string) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
  return base64url(new Uint8Array(d));
}

export function presentSecretNames(env: Env, names: string[]) {
  return new Set(names.filter((n) => !!env[n]));
}

export function appOrigin(env: Env, requestUrl: string) {
  return (env["APP_ORIGIN"] ?? new URL(requestUrl).origin).replace(/\/$/, "");
}
