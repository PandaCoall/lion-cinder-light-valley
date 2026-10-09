import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Y as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Route$9, f as filterStories, m as genres, v as tropes } from "./router-C93069zn.mjs";
import { t as AppNav } from "./nav-CzuovPGK.mjs";
import { t as useReader } from "./reader-store-bNjKnc8J.mjs";
import { n as useOpenBook } from "./open-book-DRgAtO2Z.mjs";
import { s as playAudiobook, u as stopSpeech } from "./book-tools-DjGzfYIB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-D1qYtM49.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Discover() {
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const saveBook = useReader((state) => state.saveBook);
	useReader((state) => state.unsaveBook);
	const skipBook = useReader((state) => state.skipBook);
	useReader((state) => state.unskipBook);
	const { read } = useOpenBook();
	const { q } = Route$9.useSearch();
	const [query, setQuery] = (0, import_react.useState)(q ?? "");
	const [want, setWant] = (0, import_react.useState)([]);
	const [avoid, setAvoid] = (0, import_react.useState)([]);
	const [genre, setGenre] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)(false);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [dx, setDx] = (0, import_react.useState)(0);
	const [dy, setDy] = (0, import_react.useState)(0);
	const [undo, setUndo] = (0, import_react.useState)(null);
	const [hearing, setHearing] = (0, import_react.useState)(false);
	const [voiceNote, setVoiceNote] = (0, import_react.useState)("");
	const drag = (0, import_react.useRef)({
		x: 0,
		y: 0,
		dx: 0,
		dy: 0,
		on: false
	});
	const cards = (0, import_react.useMemo)(() => filterStories(query, want, avoid, genre), [
		query,
		want,
		avoid,
		genre
	]);
	const story = cards.length ? cards[index % cards.length] : void 0;
	(0, import_react.useEffect)(() => {
		stopSpeech();
		setHearing(false);
		setVoiceNote("");
		return () => stopSpeech();
	}, [story?.id]);
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
	const listen = () => {
		if (!story) return;
		if (hearing) {
			stopSpeech();
			setHearing(false);
			setVoiceNote("");
			return;
		}
		setHearing(true);
		setVoiceNote("Playing");
		playAudiobook(story.id, void 0, 1, setVoiceNote).then((played) => {
			setHearing(false);
			setVoiceNote(played === true ? "" : played);
		});
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
					className: "relative flex h-full touch-none flex-col overflow-hidden rounded-3xl border-2 border-[#FFE62D] bg-[#241612] text-[#f6efe6] select-none",
					style: {
						transform: `translate(${dx}px, ${dy}px) rotate(${dx / 28}deg)`,
						transition: drag.current.on ? "none" : "transform 180ms ease"
					},
					onPointerDown: (event) => {
						if (event.target.closest("button")) return;
						drag.current = {
							x: event.clientX,
							y: event.clientY,
							dx: 0,
							dy: 0,
							on: true
						};
						event.currentTarget.setPointerCapture(event.pointerId);
					},
					onPointerMove: (event) => {
						if (!drag.current.on) return;
						const nextX = event.clientX - drag.current.x;
						const nextY = event.clientY - drag.current.y;
						drag.current.dx = nextX;
						drag.current.dy = nextY;
						setDx(nextX);
						setDy(nextY);
					},
					onPointerUp: () => {
						if (!drag.current.on) return;
						const movedX = drag.current.dx;
						drag.current.on = false;
						if (movedX > 72) save();
						else if (movedX < -72) skip();
						else {
							setDx(0);
							setDy(0);
						}
					},
					onPointerCancel: () => {
						drag.current.on = false;
						setDx(0);
						setDy(0);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: story.cover,
							alt: "",
							draggable: false,
							className: "pointer-events-none absolute inset-0 h-full w-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-gradient-to-t from-[#120c0a] via-[#120c0a]/55 to-transparent" }),
						dx < -36 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-6 left-6 rounded-full bg-paper px-4 py-2 font-sans text-sm text-ink",
							children: "Skip"
						}) : null,
						dx > 36 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute top-6 right-6 rounded-full bg-paper px-4 py-2 font-sans text-sm text-ink",
							children: "Save"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative mt-auto flex flex-col px-5 pt-16 pb-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-sans text-xs text-[#12B8FF]",
									children: [
										story.genre,
										" · ",
										story.rating
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-1 font-serif text-3xl leading-tight",
									children: story.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 line-clamp-3 font-serif text-lg leading-snug",
									children: [
										story.hook,
										" ",
										story.excerpt
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 grid grid-cols-3 gap-2",
									onPointerDown: (event) => event.stopPropagation(),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "h-11 rounded-full bg-[#12B8FF] font-sans text-sm text-[#1a100c]",
											onClick: () => read(story.id),
											children: "Full Chapter"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "h-11 rounded-full bg-[#FFE62D] font-sans text-sm text-[#1a100c]",
											onClick: listen,
											children: hearing ? "Stop" : "Listen"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "h-11 rounded-full bg-[#FD4499] font-sans text-sm text-[#1a100c]",
											onClick: save,
											children: "Save"
										})
									]
								}),
								voiceNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-sans text-xs text-[#FFE62D]",
									children: voiceNote
								}) : null
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pb-2 text-center font-sans text-xs text-muted",
				children: "Swipe left to skip, right to save."
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
