# Itanimulli — accounts, linked gaming accounts, cloud servers

Status: pre-publication foundation. Not published.

## Player accounts (working)
Email + password (with email confirmation and password recovery), Google, and Lovable sign-in via Lovable Cloud.
Pages: `/auth`, `/reset-password`, `/account`, `/servers` (the last two require sign-in).

## Linked gaming accounts
Callback URL pattern (register exactly, per provider): `https://<your-site>/api/public/link/<provider>/callback`
Set the `APP_ORIGIN` secret to your canonical site origin (e.g. `https://itanimulli.lovable.app`) so callbacks are stable.

| Provider | State now | To enable |
|---|---|---|
| Steam | Works (OpenID 2.0, verified server-side with Steam) | Optional `STEAM_WEB_API_KEY` for persona names |
| Microsoft account | Not configured | Entra app (Personal accounts), Web redirect `<site>/api/public/link/microsoft/callback`; secrets `MICROSOFT_LINK_CLIENT_ID`, `MICROSOFT_LINK_CLIENT_SECRET` |
| Discord | Not configured | Discord app OAuth2 redirect `<site>/api/public/link/discord/callback`; `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` |
| Epic Games | Not configured | Epic Account Services client (basic_profile), redirect `<site>/api/public/link/epic/callback`, brand review; `EPIC_CLIENT_ID`, `EPIC_CLIENT_SECRET` |
| Xbox network | Requires developer access | ID@Xbox / Managed Partner, Partner Center title + XSTS relying party. Microsoft account link ≠ Xbox authorization. |
| PlayStation Network | Requires developer access | PlayStation Partners agreement; Sony-issued linking access |
| Nintendo Account | Requires developer access | Licensed Nintendo developer + Nintendo approval |

Protections: one-time server-stored `state` (10 min), httpOnly browser-binding cookie, OIDC `nonce` + PKCE (Microsoft), PKCE (Discord), Steam `check_authentication`, unique (provider, provider account) so one platform account can link to only one player, explicit link/unlink confirmation. No console passwords or cookies are collected.

## Cloud game servers
Draft configurations only (name, game, region, capacity 2–64, privacy, member invites with roles). The database refuses any status other than `draft`. No server runs, no address is assigned, nothing is billed.

Blockers for real multiplayer: dedicated server build; hosting provider choice + API credentials; cost/budget; networking (ports, transport, DDoS, matchmaking/allocation); platform certification and crossplay approval.
