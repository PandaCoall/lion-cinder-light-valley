import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { m as genres, s as Route$3, y as tropes } from "./router-CrBvZU6N.mjs";
import { t as AppNav } from "./nav-CzuovPGK.mjs";
import { t as useReader } from "./reader-store-CB2CzwHY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-DDMP-pvT.js
var import_jsx_runtime = require_jsx_runtime();
function Studio() {
	const { novel: novelId } = Route$3.useSearch();
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const novels = useReader((state) => state.novels);
	const patchNovel = useReader((state) => state.patchNovel);
	const addChapter = useReader((state) => state.addChapter);
	const addPlate = useReader((state) => state.addPlate);
	const removePlate = useReader((state) => state.removePlate);
	const novel = novels.find((item) => item.id === novelId);
	const onImage = (file) => {
		if (!file || !novel) return;
		if (file.size > 15e5) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result !== "string") return;
			addPlate(novel.id, {
				id: `plate-${Date.now()}`,
				src: reader.result,
				caption: file.name.replace(/\.[^.]+$/, ""),
				after: novel.chapters[0]?.id ?? ""
			});
		};
		reader.readAsDataURL(file);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio flex min-h-dvh flex-col bg-desk text-ink",
		"data-theme": theme,
		"data-face": face,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center justify-between px-5 pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/write",
					className: "inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 font-sans text-sm",
					children: "Back"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Novel studio"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-3xl flex-1 px-5 py-6",
				children: novel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "font-sans text-sm text-muted",
							children: ["Title", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: novel.title,
								onChange: (event) => patchNovel(novel.id, { title: event.target.value }),
								className: "mt-1 h-12 w-full rounded-2xl border border-line bg-paper px-4 font-serif text-2xl text-ink"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "font-sans text-sm text-muted",
							children: ["Hook", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: novel.hook,
								onChange: (event) => patchNovel(novel.id, { hook: event.target.value }),
								className: "mt-1 h-24 w-full rounded-2xl border border-line bg-paper p-4 font-serif text-lg text-ink"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "font-sans text-sm text-muted",
							children: ["Genre", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: novel.genre,
								onChange: (event) => patchNovel(novel.id, { genre: event.target.value }),
								className: "mt-1 h-12 w-full rounded-2xl border border-line bg-paper px-4 font-sans text-sm text-ink",
								children: genres.map((genre) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: genre }, genre))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-sm text-muted",
							children: "Tropes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: tropes.map((trope) => {
								const on = novel.tropes.includes(trope);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => patchNovel(novel.id, { tropes: on ? novel.tropes.filter((item) => item !== trope) : [...novel.tropes, trope] }),
									className: `h-10 rounded-full border px-3 font-sans text-sm ${on ? "border-vermillion" : "border-line"}`,
									children: trope
								}, trope);
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-2xl",
								children: "Chapters"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 rounded-full border border-line px-4 font-sans text-sm",
								onClick: () => addChapter(novel.id),
								children: "Add chapter"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 flex flex-col gap-2",
							children: novel.chapters.map((chapter, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/editor",
								search: {
									novel: novel.id,
									chapter: chapter.id
								},
								className: "flex min-h-14 items-center justify-between rounded-2xl bg-paper px-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-lg",
									children: chapter.title || `Chapter ${index + 1}`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-sans text-sm text-muted",
									children: "Edit"
								})]
							}) }, chapter.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-2xl",
									children: "Illustrations"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "inline-flex h-11 cursor-pointer items-center rounded-full border border-line px-4 font-sans text-sm",
									children: ["Add illustration", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "image/*",
										className: "hidden",
										onChange: (event) => {
											onImage(event.target.files?.[0]);
											event.target.value = "";
										}
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-sans text-sm text-muted",
								children: "An illustration is a full-page picture, not a comic panel. Place it after a chapter."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 flex flex-col gap-3",
								children: novel.plates.map((plate) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3 rounded-2xl bg-paper p-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: plate.src,
											alt: "",
											className: "h-16 w-12 rounded-lg object-cover"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block truncate font-serif",
												children: plate.caption
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-sans text-xs text-muted",
												children: ["After ", novel.chapters.find((chapter) => chapter.id === plate.after)?.title ?? "the opening"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "h-11 font-sans text-sm text-muted",
											onClick: () => removePlate(novel.id, plate.id),
											children: "Remove"
										})
									]
								}, plate.id))
							})
						] })
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-2xl",
					children: "Open a novel from the dashboard."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppNav, {})
		]
	});
}
//#endregion
export { Studio as component };
