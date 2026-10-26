<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- Gaming-account providers are declared in `src/lib/providers.ts` (client-safe catalog) with adapters in `src/lib/providers.server.ts`; partner-only platforms have no adapter. Why: keeps secrets server-side and prevents fake "connected" states.
- Link callbacks live at `/api/public/link/$provider/callback` and trust only a consumed `link_states` row plus the matching httpOnly cookie. Why: the route is public and must not accept forged identities.
- Game servers are draft-only, enforced by a database trigger, until a real hosting adapter and dedicated-server build exist. Why: never show invented running servers or addresses.
