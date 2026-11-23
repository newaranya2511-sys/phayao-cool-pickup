<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- App state (orders, stock, profile, staff test mode) lives in `src/lib/store.ts` behind `useAppState()` + action functions, persisted to localStorage; swap this module's internals (not its callers) when moving to a shared backend. Why: device-only testing for now, one seam for the later backend.
- Business rules (prices, bulk threshold, opening stock) live only in `src/lib/pricing.ts`, warehouse/PromptPay settings only in `src/lib/config.ts`. Why: one place to change values; tests in `src/lib/*.test.ts` cover them.
- PromptPay QR payloads are built locally per EMVCo in `src/lib/promptpay.ts`; payment confirmation and slip checking are simulated until a bank/slip-verification service is connected. Why: no outside payment service is connected yet.
- Pickup passes are shared as `/pickup/$code?d=<base64 pass snapshot>` so a driver's phone can show the pass without the buyer's local data. Why: no shared backend.
- Colors come only from Clean Aero tokens in `src/styles.css` (mint, mintsoft, sky, deep, ink, mute, ground, line, surface, on-mint). Why: theming from the UI kit.
