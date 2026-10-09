import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as chapters, o as Route$1, p as findStory } from "./router-CNRKipda.mjs";
import { t as AppNav } from "./nav-CzuovPGK.mjs";
import { t as useReader } from "./reader-store-bNjKnc8J.mjs";
import { n as useOpenBook } from "./open-book-Dx0Akz3H.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book._bookId-BP5F296G.js
var import_jsx_runtime = require_jsx_runtime();
function BookPreview() {
	const { bookId } = Route$1.useParams();
	const story = findStory(bookId);
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const savedIds = useReader((state) => state.savedIds);
	const saveBook = useReader((state) => state.saveBook);
	const unsaveBook = useReader((state) => state.unsaveBook);
	const { read, allowed, opened, limit, signedIn } = useOpenBook();
	const saved = story ? savedIds.includes(story.id) : false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio flex min-h-dvh flex-col bg-desk text-ink",
		"data-theme": theme,
		"data-face": face,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-5 pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/discover",
					className: "inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 font-sans text-sm",
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Preview"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-xl flex-1 px-5 py-6",
				children: story ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: story.cover,
						alt: "",
						className: "mx-auto h-72 w-48 rounded-2xl object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-5 font-sans text-sm text-muted",
						children: [
							story.genre,
							" · ",
							story.rating
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-serif text-4xl",
						children: story.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-serif text-xl",
						children: story.hook
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 flex flex-wrap gap-2",
						children: story.tropes.map((trope) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-line px-3 py-1 font-sans text-xs",
							children: trope
						}, trope))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 font-serif text-lg leading-relaxed",
						children: story.excerpt
					}),
					story.id === "salt" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-6 divide-y divide-line border-y border-line",
						children: chapters.map((chapter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "flex min-h-14 w-full items-center justify-between text-left",
							onClick: () => read("salt", chapter.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "kicker",
								children: chapter.kicker
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block font-serif text-lg",
								children: chapter.title
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-sans text-sm text-muted",
								children: "Read"
							})]
						}) }, chapter.id))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-12 rounded-full bg-ink px-5 font-sans text-sm text-paper",
							onClick: () => read(story.id),
							children: allowed(story.id) ? "Read" : "Sign in to read more"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-12 rounded-full border border-line bg-paper px-5 font-sans text-sm",
							onClick: () => saved ? unsaveBook(story.id) : saveBook(story.id),
							children: saved ? "Saved" : "Save"
						})]
					}),
					!signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 font-sans text-sm text-muted",
						children: [
							"Guest reading: ",
							Math.min(opened, limit),
							" of ",
							limit,
							" books opened."
						]
					}) : null
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-3xl",
					children: "That book is not on the shelf."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppNav, {})
		]
	});
}
//#endregion
export { BookPreview as component };
