import { useNavigate } from "@tanstack/react-router";
import { authEnabled } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useReader } from "@/lib/reader-store";

export const GUEST_LIMIT = 3;

export function useOpenBook() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const openedIds = useReader((state) => state.openedIds);
  const markOpened = useReader((state) => state.markOpened);
  const signedIn = !authEnabled || Boolean(user);

  const allowed = (id: string) => {
    if (!authEnabled || isPending || signedIn) return true;
    if (openedIds.includes(id)) return true;
    return openedIds.length < GUEST_LIMIT;
  };

  const read = (id: string, chapter?: string) => {
    if (!allowed(id)) {
      void navigate({ to: "/login", search: { next: `/book/${id}` } });
      return;
    }
    if (authEnabled && !signedIn) markOpened(id);
    if (id === "salt") void navigate({ to: "/read", search: chapter ? { chapter } : {} });
    else void navigate({ to: "/read", search: { preview: id } });
  };

  return { allowed, read, signedIn, opened: openedIds.length, limit: GUEST_LIMIT, isPending };
}
