import { z } from "zod";

export const SERVER_GAMES = [
  { id: "itanimulli-kingdom", label: "ITANIMULLI — Kingdom era" },
  { id: "itanimulli-duat", label: "ITANIMULLI — The Duat (space era)" },
] as const;

export const SERVER_REGIONS = [
  { id: "na-east", label: "North America — East" },
  { id: "na-west", label: "North America — West" },
  { id: "eu-west", label: "Europe — West" },
  { id: "eu-central", label: "Europe — Central" },
  { id: "asia-east", label: "Asia — East" },
  { id: "oce", label: "Oceania" },
] as const;

export const MEMBER_ROLES = ["admin", "moderator", "player"] as const;
export const PRIVACY = ["public", "friends", "private"] as const;

export const serverDraftSchema = z.object({
  name: z.string().trim().min(3, "At least 3 characters").max(48, "At most 48 characters"),
  game: z.enum(["itanimulli-kingdom", "itanimulli-duat"]),
  region: z.enum(["na-east", "na-west", "eu-west", "eu-central", "asia-east", "oce"]),
  capacity: z.coerce.number().int().min(2, "Minimum 2 players").max(64, "Maximum 64 players"),
  privacy: z.enum(PRIVACY),
});
export type ServerDraft = z.infer<typeof serverDraftSchema>;

export const memberSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  role: z.enum(MEMBER_ROLES),
});

/**
 * No hosting provider adapter or dedicated-server build exists in this project, so
 * provisioning is unavailable. Flip this only when a real adapter is added.
 */
export const PROVISIONING = {
  available: false,
  reason:
    "No dedicated server build and no cloud hosting provider are configured. Servers are saved as drafts only — nothing is running and no address is assigned.",
} as const;

export const MULTIPLAYER_BLOCKERS = [
  { title: "Dedicated server build", body: "The game itself (a headless server executable for Linux) does not exist yet. The browser prototype is single-player." },
  { title: "Hosting provider + credentials", body: "Pick an official game-server host (for example AWS GameLift, Azure PlayFab Multiplayer Servers, Google Agones on GKE, Edgegap, Hathora) and add its API credentials as server-side secrets." },
  { title: "Costs and billing", body: "Running servers costs money per hour per region. A budget, spending caps and who pays (you vs. players) must be decided before any server is started." },
  { title: "Networking", body: "Ports, UDP/TCP transport, DDoS protection, matchmaking and a session/allocation service are needed so players can find and join servers." },
  { title: "Platform approval", body: "Shipping multiplayer on PlayStation, Xbox, Nintendo or Steam requires each platform's certification. Crossplay needs separate approval from every platform holder." },
];
