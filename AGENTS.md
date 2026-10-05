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

## Architecture rules

- ClearTime is frontend-only: user-added events live in a browser-storage store in `src/lib/events.ts` (components call `useEventsVersion()` to re-render). No backend/DB unless the user asks for sign-in/sync — do not add Lovable Cloud on your own.
