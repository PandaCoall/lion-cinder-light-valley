import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, House, Library, PenLine, UserRound } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: House, color: "#12B8FF" },
  { to: "/discover", label: "Discover", icon: Compass, color: "#01DC03" },
  { to: "/shelf", label: "Shelf", icon: Library, color: "#FFE62D" },
  { to: "/write", label: "Write", icon: PenLine, color: "#FD4499" },
  { to: "/profile", label: "Profile", icon: UserRound, color: "#DF19FB" },
] as const;

export function AppNav() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  return (
    <nav className="sticky bottom-0 z-30 border-t border-line bg-paper" aria-label="Main">
      <ul className="mx-auto grid max-w-3xl grid-cols-5">
        {items.map((item) => {
          const on = item.to === "/" ? path === "/" : path.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className="flex h-16 flex-col items-center justify-center gap-1 font-sans text-xs"
                style={{ color: item.color, opacity: on ? 1 : 0.55 }}
              >
                <Icon className="size-5" aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
