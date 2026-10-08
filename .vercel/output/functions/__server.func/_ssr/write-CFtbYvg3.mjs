import { C as require_jsx_runtime, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as AppNav } from "./nav-PaVr6BoP.mjs";
import { t as useReader } from "./reader-store-CB2CzwHY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/write-CFtbYvg3.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const novels = useReader((state) => state.novels);
	const createNovel = useReader((state) => state.createNovel);
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio flex min-h-dvh flex-col bg-desk text-ink",
		"data-theme": theme,
		"data-face": face,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex w-full max-w-3xl items-end justify-between px-5 pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Write"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-serif text-4xl",
					children: "Author dashboard"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 rounded-full bg-ink px-4 font-sans text-sm text-paper",
					onClick: () => {
						const id = createNovel();
						navigate({
							to: "/studio",
							search: { novel: id }
						});
					},
					children: "New novel"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-3xl flex-1 px-5 py-6",
				children: novels.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-3",
					children: novels.map((novel) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/studio",
						search: { novel: novel.id },
						className: "block rounded-3xl bg-paper p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-sans text-xs text-muted",
								children: [
									novel.genre,
									" · ",
									novel.chapters.length,
									" chapters · ",
									novel.plates.length,
									" plates"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-serif text-2xl",
								children: novel.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-sans text-sm text-muted",
								children: novel.hook || "No hook yet."
							})
						]
					}) }, novel.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl bg-paper p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-2xl",
						children: "No volumes yet."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-sans text-sm text-muted",
						children: "Start a novel, then write chapters and place the plates."
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppNav, {})
		]
	});
}
//#endregion
export { Dashboard as component };
