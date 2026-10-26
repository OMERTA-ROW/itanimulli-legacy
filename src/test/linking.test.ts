import { describe, expect, it, vi } from "vitest";
import { PROVIDERS, getProvider, resolveProviderState } from "@/lib/providers";
import { ADAPTERS, STEAM_OP, checkSteamAssertion, parseSteamClaimedId } from "@/lib/providers.server";
import { PROVISIONING, serverDraftSchema } from "@/lib/servers";

const none = new Set<string>();

describe("provider catalog", () => {
  it("PlayStation, Xbox and Nintendo require developer access and have no adapter", () => {
    for (const id of ["playstation", "xbox", "nintendo"]) {
      expect(resolveProviderState(getProvider(id)!, none)).toBe("requires_developer_access");
      expect(ADAPTERS[id as "xbox"]).toBeUndefined();
    }
  });
  it("Microsoft identity is a separate provider from Xbox", () => {
    expect(getProvider("microsoft")!.access).toBe("public-oauth");
    expect(getProvider("xbox")!.access).toBe("partner-only");
  });
  it("OAuth providers without secrets are not configured", () => {
    for (const id of ["microsoft", "discord", "epic"]) {
      expect(resolveProviderState(getProvider(id)!, none)).toBe("not_configured");
    }
    expect(
      resolveProviderState(getProvider("discord")!, new Set(["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET"])),
    ).toBe("available");
  });
  it("Steam needs no secret", () => {
    expect(resolveProviderState(getProvider("steam")!, none)).toBe("available");
  });
  it("lists the priority platforms first-class", () => {
    expect(PROVIDERS.filter((p) => p.priority).map((p) => p.id)).toEqual(["playstation", "xbox", "microsoft", "steam"]);
  });
});

const REDIRECT = "https://game.example/api/public/link/steam/callback";
function steamReturn(overrides: Record<string, string> = {}) {
  const claimed = "https://steamcommunity.com/openid/id/76561197960435530";
  const u = new URL(REDIRECT + "?state=abc");
  const p: Record<string, string> = {
    "openid.ns": "http://specs.openid.net/auth/2.0",
    "openid.mode": "id_res",
    "openid.op_endpoint": STEAM_OP,
    "openid.claimed_id": claimed,
    "openid.identity": claimed,
    "openid.return_to": REDIRECT + "?state=abc",
    "openid.response_nonce": "2026-10-26T00:00:00Zx",
    "openid.assoc_handle": "1234567890",
    "openid.signed": "signed,op_endpoint,claimed_id,identity,return_to,response_nonce,assoc_handle",
    "openid.sig": "sig",
    ...overrides,
  };
  for (const [k, v] of Object.entries(p)) u.searchParams.set(k, v);
  return u;
}

describe("Steam OpenID verification", () => {
  it("extracts a 17-digit SteamID only from steamcommunity.com", () => {
    expect(parseSteamClaimedId("https://steamcommunity.com/openid/id/76561197960435530")).toBe("76561197960435530");
    expect(parseSteamClaimedId("https://evil.example/openid/id/76561197960435530")).toBeNull();
  });
  it("rejects a forged op_endpoint or a swapped state", () => {
    expect(() => checkSteamAssertion(steamReturn({ "openid.op_endpoint": "https://evil.example/login" }), REDIRECT)).toThrow();
    expect(() => checkSteamAssertion(steamReturn({ "openid.return_to": REDIRECT + "?state=other" }), REDIRECT)).toThrow();
  });
  it("links only when Steam confirms is_valid:true", async () => {
    const steam = ADAPTERS.steam!;
    const base = { url: steamReturn(), redirectUri: REDIRECT, nonce: "", codeVerifier: null, env: {} };
    const ok = vi.fn().mockResolvedValue(new Response("ns:http://specs.openid.net/auth/2.0\nis_valid:true\n"));
    await expect(steam.complete({ ...base, fetchImpl: ok })).resolves.toEqual({ providerUserId: "76561197960435530", displayName: null });
    const bad = vi.fn().mockResolvedValue(new Response("ns:http://specs.openid.net/auth/2.0\nis_valid:false\n"));
    await expect(steam.complete({ ...base, fetchImpl: bad })).rejects.toThrow();
  });
});

describe("cloud servers", () => {
  it("provisioning is unavailable without a host adapter", () => {
    expect(PROVISIONING.available).toBe(false);
  });
  it("capacity must be 2–64", () => {
    const base = { name: "Nile Night", game: "itanimulli-kingdom", region: "eu-west", privacy: "private" };
    expect(serverDraftSchema.safeParse({ ...base, capacity: 1 }).success).toBe(false);
    expect(serverDraftSchema.safeParse({ ...base, capacity: 65 }).success).toBe(false);
    expect(serverDraftSchema.safeParse({ ...base, capacity: 64 }).success).toBe(true);
  });
});
