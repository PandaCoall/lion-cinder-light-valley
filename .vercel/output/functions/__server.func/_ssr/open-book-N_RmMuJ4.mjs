import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as authClient } from "./client-X9jEV-QU.mjs";
import { t as useReader } from "./reader-store-CB2CzwHY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/open-book-N_RmMuJ4.js
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const { data, isPending } = authClient.useSession();
	const user = data?.user;
	return {
		user: user ? {
			id: user.id,
			displayName: user.name ?? null,
			primaryEmail: user.email ?? null,
			profileImageUrl: user.image ?? null,
			isDevFallback: false
		} : null,
		isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function useOpenBook() {
	const navigate = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const openedIds = useReader((state) => state.openedIds);
	const markOpened = useReader((state) => state.markOpened);
	const signedIn = Boolean(user);
	const allowed = (id) => {
		if (isPending || signedIn) return true;
		if (openedIds.includes(id)) return true;
		return openedIds.length < 3;
	};
	const read = (id, chapter) => {
		if (!allowed(id)) {
			navigate({
				to: "/login",
				search: { next: `/book/${id}` }
			});
			return;
		}
		if (!signedIn) markOpened(id);
		if (id === "salt") navigate({
			to: "/read",
			search: chapter ? { chapter } : {}
		});
		else navigate({
			to: "/read",
			search: { preview: id }
		});
	};
	return {
		allowed,
		read,
		signedIn,
		opened: openedIds.length,
		limit: 3,
		isPending
	};
}
//#endregion
export { useOpenBook as n, useCurrentUser as t };
