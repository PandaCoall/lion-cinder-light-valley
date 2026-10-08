import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { f as Route$9, h as genres, p as filterStories, v as stories, y as tropes } from "./router-BssuV81m.mjs";
import { t as AppNav } from "./nav-PaVr6BoP.mjs";
import { t as useReader } from "./reader-store-CB2CzwHY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-Dnppu1PK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Discover() {
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const saveBook = useReader((state) => state.saveBook);
	const unsaveBook = useReader((state) => state.unsaveBook);
	const skipBook = useReader((state) => state.skipBook);
	const unskipBook = useReader((state) => state.unskipBook);
	const { q } = Route$9.useSearch();
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)(q ?? "");
	const [want, setWant] = (0, import_react.useState)([]);
	const [avoid, setAvoid] = (0, import_react.useState)([]);
	const [genre, setGenre] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)(false);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [dx, setDx] = (0, import_react.useState)(0);
	const [dy, setDy] = (0, import_react.useState)(0);
	const [undo, setUndo] = (0, import_react.useState)(null);
	const drag = (0, import_react.useRef)({
		x: 0,
		y: 0,
		on: false
	});
	const cards = (0, import_react.useMemo)(() => filterStories(query, want, avoid, genre), [
		query,
		want,
		avoid,
		genre
	]);
	const story = cards.length ? cards[index % cards.length] : void 0;
	const show = (id) => {
		const at = cards.findIndex((item) => item.id === id);
		setIndex(at >= 0 ? at : 0);
	};
	const advance = () => setIndex((value) => value + 1);
	const skip = () => {
		if (!story) return;
		skipBook(story.id);
		setUndo({
			kind: "skip",
			id: story.id
		});
		setDx(0);
		setDy(0);
		advance();
	};
	const save = () => {
		if (!story) return;
		saveBook(story.id);
		setUndo({
			kind: "save",
			id: story.id
		});
		setDx(0);
		setDy(0);
		advance();
	};
	const preview = () => {
		if (!story) return;
		navigate({
			to: "/book/$bookId",
			params: { bookId: story.id }
		});
	};
	const undoLast = () => {
		if (!undo) return;
		if (undo.kind === "skip") unskipBook(undo.id);
		else unsaveBook(undo.id);
		show(undo.id);
		setUndo(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio flex h-dvh flex-col bg-desk text-ink",
		"data-theme": theme,
		"data-face": face,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-center gap-2 px-4 pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					className: "flex min-w-0 flex-1 gap-2",
					onSubmit: (event) => {
						event.preventDefault();
						setIndex(0);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (event) => {
							setQuery(event.target.value);
							setIndex(0);
						},
						"aria-label": "Search books",
						placeholder: "Search titles, tropes, genres",
						className: "h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 font-sans text-sm"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 rounded-full border border-line bg-paper px-4 font-sans text-sm",
					onClick: () => setFilters(true),
					children: "Filters"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative min-h-0 flex-1 px-4 py-4",
				children: story ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "relative h-full overflow-hidden rounded-3xl bg-ink",
					style: {
						transform: `translate(${dx}px, ${dy}px) rotate(${dx / 28}deg)`,
						transition: drag.current.on ? "none" : "transform 180ms ease"
					},
					onPointerDown: (event) => {
						drag.current = {
							x: event.clientX,
							y: event.clientY,
							on: true
						};
						event.currentTarget.setPointerCapture(event.pointerId);
					},
					onPointerMove: (event) => {
						if (!drag.current.on) return;
						setDx(event.clientX - drag.current.x);
						setDy(event.clientY - drag.current.y);
					},
					onPointerUp: () => {
						drag.current.on = false;
						if (dy < -90 && Math.abs(dy) > Math.abs(dx)) preview();
						else if (dx > 90) save();
						else if (dx < -90) skip();
						else {
							setDx(0);
							setDy(0);
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: story.cover,
							alt: "",
							className: "h-full w-full object-cover"
						}),
						dx < -36 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-6 left-6 rounded-full bg-paper px-4 py-2 font-sans text-sm text-ink",
							children: "Skip"
						}) : null,
						dx > 36 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-6 right-6 rounded-full bg-paper px-4 py-2 font-sans text-sm text-ink",
							children: "Save"
						}) : null,
						dy < -36 && Math.abs(dy) > Math.abs(dx) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-6 left-1/2 -translate-x-1/2 rounded-full bg-paper px-4 py-2 font-sans text-sm text-ink",
							children: "Preview"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/80 to-transparent px-5 pt-24 pb-5 text-paper",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-sans text-xs text-paper/70",
									children: [
										story.genre,
										" · ",
										story.rating
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 font-serif text-3xl",
									children: story.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-serif text-lg",
									children: story.hook
								})
							]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-full flex-col items-center justify-center text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-3xl",
						children: "Nothing matches."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-4 h-11 rounded-full bg-ink px-4 font-sans text-sm text-paper",
						onClick: () => {
							setQuery("");
							setWant([]);
							setAvoid([]);
							setGenre("");
							setIndex(0);
						},
						children: "Clear search"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-4 gap-2 px-4 pb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !undo,
						onClick: undoLast,
						className: "h-12 rounded-full border border-line bg-paper font-sans text-sm disabled:opacity-40",
						children: "Undo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !story,
						onClick: skip,
						className: "h-12 rounded-full border border-line bg-paper font-sans text-sm",
						children: "Skip"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !story,
						onClick: preview,
						className: "h-12 rounded-full border border-line bg-paper font-sans text-sm",
						children: "Preview"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !story,
						onClick: save,
						className: "h-12 rounded-full bg-ink font-sans text-sm text-paper",
						children: "Save"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-4 pb-2 text-center font-sans text-xs text-muted",
				children: [
					"Swipe left to skip, right to save, up to preview. ",
					stories.length,
					" books."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppNav, {}),
			filters ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-end bg-ink/40",
				onClick: () => setFilters(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl bg-paper p-5",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-2xl",
								children: "Filters"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 font-sans text-sm",
								onClick: () => setFilters(false),
								children: "Done"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker mt-4",
							children: "Genre"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setGenre("");
									setIndex(0);
								},
								className: `h-10 rounded-full border px-3 font-sans text-sm ${genre === "" ? "border-vermillion" : "border-line"}`,
								children: "Any"
							}), genres.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setGenre(item);
									setIndex(0);
								},
								className: `h-10 rounded-full border px-3 font-sans text-sm ${genre === item ? "border-vermillion" : "border-line"}`,
								children: item
							}, item))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker mt-5",
							children: "Want"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: tropes.map((trope) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setIndex(0);
									setAvoid(avoid.filter((item) => item !== trope));
									setWant(want.includes(trope) ? want.filter((item) => item !== trope) : [...want, trope]);
								},
								className: `h-10 rounded-full border px-3 font-sans text-sm ${want.includes(trope) ? "border-vermillion" : "border-line"}`,
								children: trope
							}, trope))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker mt-5",
							children: "Not this"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: tropes.map((trope) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setIndex(0);
									setWant(want.filter((item) => item !== trope));
									setAvoid(avoid.includes(trope) ? avoid.filter((item) => item !== trope) : [...avoid, trope]);
								},
								className: `h-10 rounded-full border px-3 font-sans text-sm ${avoid.includes(trope) ? "border-vermillion" : "border-line"}`,
								children: trope
							}, `n-${trope}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/discover",
							className: "mt-6 inline-flex h-11 items-center font-sans text-sm text-muted",
							children: "Back to the deck"
						})
					]
				})
			}) : null
		]
	});
}
//#endregion
export { Discover as component };
