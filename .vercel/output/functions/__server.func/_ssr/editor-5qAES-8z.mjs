import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as Route$8 } from "./router-ChBNvHv3.mjs";
import { t as AppNav } from "./nav-CzuovPGK.mjs";
import { t as useReader } from "./reader-store-bNjKnc8J.mjs";
import { t as readManuscript } from "./manuscript-Bn5xcb8X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/editor-5qAES-8z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Editor() {
	const { novel: novelId, chapter: chapterId } = Route$8.useSearch();
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const novels = useReader((state) => state.novels);
	const patchChapter = useReader((state) => state.patchChapter);
	const novel = novels.find((item) => item.id === novelId);
	const chapter = novel?.chapters.find((item) => item.id === chapterId);
	const fileRef = (0, import_react.useRef)(null);
	const [notice, setNotice] = (0, import_react.useState)("");
	const writeBody = (body) => {
		if (!novel || !chapter) return;
		patchChapter(novel.id, chapter.id, { body });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio flex min-h-dvh flex-col bg-desk text-ink",
		"data-theme": theme,
		"data-face": face,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between gap-3 px-5 pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/studio",
					search: { novel: novelId },
					className: "inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 font-sans text-sm",
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Chapter editor"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-3xl flex-1 px-5 py-5",
				children: novel && chapter ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: chapter.title,
						"aria-label": "Chapter title",
						onChange: (event) => patchChapter(novel.id, chapter.id, { title: event.target.value }),
						className: "w-full bg-transparent font-serif text-3xl outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-full border border-line bg-paper px-4 font-sans text-sm",
								onClick: () => {
									navigator.clipboard.readText().then((text) => {
										writeBody(chapter.body ? `${chapter.body}\n\n${text}` : text);
										setNotice("Pasted into the chapter.");
									}).catch(() => setNotice("Paste was blocked. Use the page and press paste."));
								},
								children: "Paste"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-full border border-line bg-paper px-4 font-sans text-sm",
								onClick: () => fileRef.current?.click(),
								children: "Upload Word or PDF"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								accept: ".txt,.md,.rtf,.doc,.docx,.pdf,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
								className: "hidden",
								onChange: (event) => {
									const file = event.target.files?.[0];
									event.target.value = "";
									if (!file) return;
									setNotice(`Reading ${file.name}…`);
									readManuscript(file).then((text) => {
										writeBody(text);
										if (!chapter.title || chapter.title.startsWith("Chapter")) patchChapter(novel.id, chapter.id, { title: file.name.replace(/\.[^.]+$/, "") });
										setNotice(`Imported ${file.name}. Check that page numbers did not come in with the document. Take them out, recheck, edit, then publish.`);
									}).catch((error) => {
										setNotice(error instanceof Error ? error.message : "That file could not be read.");
									});
								}
							})
						]
					}),
					notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-sans text-sm text-muted",
						children: notice
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-sans text-sm text-muted",
						children: "If this chapter came from a Word file or PDF, page numbers from that file often land in the text. Take them out, recheck, edit, then publish."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: chapter.body,
						"aria-label": "Chapter",
						onChange: (event) => writeBody(event.target.value),
						placeholder: "Write, paste, or upload a Word file or PDF.",
						className: "mt-4 min-h-[55dvh] w-full rounded-3xl bg-paper p-6 font-serif text-lg leading-relaxed outline-none"
					}),
					novel.plates.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 font-sans text-sm text-muted",
						children: [
							novel.plates.length,
							" ",
							novel.plates.length === 1 ? "illustration sits" : "illustrations sit",
							" with this volume. Manage them in the studio."
						]
					}) : null
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-2xl",
					children: "Choose a chapter from the studio."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppNav, {})
		]
	});
}
//#endregion
export { Editor as component };
