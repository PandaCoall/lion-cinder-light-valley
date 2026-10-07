import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shelf } from "@/components/shelf";
import { useReader } from "@/lib/reader-store";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const anchor = useReader((state) => state.anchor);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const finish = () => {
      const seen = sessionStorage.getItem("lightnov-seen");
      const place = useReader.getState().anchor;
      if (!seen && place > 0) {
        sessionStorage.setItem("lightnov-seen", "1");
        void navigate({ to: "/read", replace: true });
        return;
      }
      sessionStorage.setItem("lightnov-seen", "1");
      setReady(true);
    };
    if (useReader.persist.hasHydrated()) finish();
    return useReader.persist.onFinishHydration(finish);
  }, [navigate]);

  if (!ready && anchor > 0) return null;
  return <Shelf />;
}
