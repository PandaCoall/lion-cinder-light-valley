import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as stories, x as book } from "./router-DPwWM3hJ.mjs";
import { t as AppNav } from "./nav-CzuovPGK.mjs";
import { t as useReader } from "./reader-store-CB2CzwHY.mjs";
import { n as useOpenBook } from "./open-book-N_RmMuJ4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BNtrJFoS.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const anchor = useReader((state) => state.anchor);
	const chapterTitle = useReader((state) => state.chapterTitle);
	const progress = useReader((state) => state.progress);
	const savedIds = useReader((state) => state.savedIds);
	const { read } = useOpenBook();
	const reading = anchor > 0;
	const saved = stories.filter((story) => savedIds.includes(story.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio flex min-h-dvh flex-col bg-desk text-ink",
		"data-theme": theme,
		"data-face": face,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto w-full max-w-3xl px-5 pt-6 sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					style: { textTransform: "none" },
					children: "LightNov"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-serif text-4xl",
					children: "What will you read?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/discover",
						className: "neon-hero rounded-3xl p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-sm",
								children: "Start here"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-serif text-3xl",
								children: "Discover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-sans text-sm",
								children: "Swipe through a cover, a summary, and a listen button."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-3xl bg-paper p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker",
							children: reading ? "Continue" : "On the desk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/plates/cover.jpg",
								alt: "",
								className: "h-36 w-24 rounded-xl object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-2xl",
										children: book.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-sans text-sm text-muted",
										children: reading ? chapterTitle : book.subtitle
									}),
									reading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 font-sans text-xs text-muted",
										children: [Math.round(progress * 100), "% through"]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "mt-4 h-11 rounded-full bg-ink px-4 font-sans text-sm text-paper",
										onClick: () => read("salt"),
										children: reading ? "Continue reading" : "Open the book"
									})
								]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						action: "/discover",
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "q",
							"aria-label": "Search books",
							placeholder: "Search titles, tropes, genres",
							className: "h-12 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 font-sans text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "h-12 rounded-full bg-ink px-4 font-sans text-sm text-paper",
							children: "Search"
						})]
					}),
					saved.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Saved"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex gap-3 overflow-x-auto",
						children: saved.map((story) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "w-28 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/book/$bookId",
								params: { bookId: story.id },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: story.cover,
									alt: "",
									className: "h-40 w-28 rounded-xl object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-serif text-sm",
									children: story.title
								})]
							})
						}, story.id))
					})] }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppNav, {})
		]
	});
}
//#endregion
export { Home as component };
