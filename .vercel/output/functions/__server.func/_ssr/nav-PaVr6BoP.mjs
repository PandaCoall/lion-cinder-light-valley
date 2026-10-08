import { C as require_jsx_runtime, b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PenLine, c as House, n as UserRound, s as Library, u as Compass } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nav-PaVr6BoP.js
var import_jsx_runtime = require_jsx_runtime();
var items = [
	{
		to: "/",
		label: "Home",
		icon: House
	},
	{
		to: "/discover",
		label: "Discover",
		icon: Compass
	},
	{
		to: "/shelf",
		label: "Shelf",
		icon: Library
	},
	{
		to: "/write",
		label: "Write",
		icon: PenLine
	},
	{
		to: "/profile",
		label: "Profile",
		icon: UserRound
	}
];
function AppNav() {
	const path = useRouterState({ select: (state) => state.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "sticky bottom-0 z-30 border-t border-line bg-paper",
		"aria-label": "Main",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mx-auto grid max-w-3xl grid-cols-5",
			children: items.map((item) => {
				const on = item.to === "/" ? path === "/" : path.startsWith(item.to);
				const Icon = item.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: item.to,
					className: `flex h-16 flex-col items-center justify-center gap-1 font-sans text-xs ${on ? "text-vermillion" : "text-muted"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "size-5",
						"aria-hidden": "true"
					}), item.label]
				}) }, item.to);
			})
		})
	});
}
//#endregion
export { AppNav as t };
