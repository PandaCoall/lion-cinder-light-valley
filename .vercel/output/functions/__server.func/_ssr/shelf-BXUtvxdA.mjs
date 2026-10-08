import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as findStory, v as stories } from "./router-CrBvZU6N.mjs";
import { t as AppNav } from "./nav-CzuovPGK.mjs";
import { t as useReader } from "./reader-store-CB2CzwHY.mjs";
import { n as useOpenBook } from "./open-book-ByoYCZ78.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shelf-BXUtvxdA.js
var import_jsx_runtime = require_jsx_runtime();
function ShelfPage() {
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const savedIds = useReader((state) => state.savedIds);
	const skippedIds = useReader((state) => state.skippedIds);
	const anchor = useReader((state) => state.anchor);
	const chapterTitle = useReader((state) => state.chapterTitle);
	const progress = useReader((state) => state.progress);
	const { read } = useOpenBook();
	const saved = savedIds.map((id) => findStory(id)).filter((story) => story !== void 0);
	const skipped = skippedIds.map((id) => findStory(id)).filter((story) => story !== void 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio flex min-h-dvh flex-col bg-desk text-ink",
		"data-theme": theme,
		"data-face": face,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto w-full max-w-3xl px-5 pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Shelf"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-serif text-4xl",
					children: "Your books"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto w-full max-w-3xl flex-1 px-5 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl",
						children: "Reading"
					}), anchor > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "mt-3 flex w-full items-center gap-4 rounded-3xl bg-paper p-4 text-left",
						onClick: () => read("salt"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/plates/cover.jpg",
							alt: "",
							className: "h-24 w-16 rounded-lg object-cover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-serif text-xl",
								children: "Salt & Second Chances"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block font-sans text-sm text-muted",
								children: chapterTitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block font-sans text-xs text-muted",
								children: [Math.round(progress * 100), "% through"]
							})
						] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-sans text-sm text-muted",
						children: "Nothing open yet. Discover a book, then come back here."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl",
							children: "Saved"
						}), saved.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 flex flex-col gap-3",
							children: saved.map((story) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/book/$bookId",
								params: { bookId: story.id },
								className: "flex items-center gap-4 rounded-3xl bg-paper p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: story.cover,
									alt: "",
									className: "h-20 w-14 rounded-lg object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block font-serif text-xl",
									children: story.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-sans text-sm text-muted",
									children: story.genre
								})] })]
							}) }, story.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-sans text-sm text-muted",
							children: "Save a book from Discover and it lands here."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl",
							children: "Recently skipped"
						}), skipped.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 flex flex-col gap-3",
							children: skipped.map((story) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/book/$bookId",
								params: { bookId: story.id },
								className: "flex items-center gap-4 rounded-3xl border border-line p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: story.cover,
									alt: "",
									className: "h-16 w-12 rounded-lg object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-lg",
									children: story.title
								})]
							}) }, story.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-sans text-sm text-muted",
							children: "Skipped books stay here, so a swipe is not a deletion."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-8 font-sans text-xs text-muted",
						children: [stories.length, " books in the catalog."]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppNav, {})
		]
	});
}
//#endregion
export { ShelfPage as component };
