import { i as __toESM } from "../_runtime.mjs";
import { a as tropes, i as stories } from "./catalog-DKe5GSfw.mjs";
import { S as require_jsx_runtime, Y as require_react, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as stopSpeech, g as speakBlocks } from "./book-tools-D-HmOi-d.mjs";
import { n as useReader } from "./reader-store-mg20pq1O.mjs";
import { d as BookOpen, l as ChevronLeft, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/discover-CAfkdTgy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Discover() {
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const navigate = useNavigate();
	const [want, setWant] = (0, import_react.useState)([]);
	const [skip, setSkip] = (0, import_react.useState)([]);
	const [index, setIndex] = (0, import_react.useState)(0);
	const [filters, setFilters] = (0, import_react.useState)(false);
	const [dx, setDx] = (0, import_react.useState)(0);
	const drag = (0, import_react.useRef)({
		x: 0,
		on: false
	});
	const cards = (0, import_react.useMemo)(() => stories.filter((story) => want.every((trope) => story.tropes.includes(trope)) && skip.every((trope) => !story.tropes.includes(trope))), [want, skip]);
	const story = cards.length ? cards[index % cards.length] : void 0;
	const behind = cards.length > 1 ? cards[(index + 1) % cards.length] : void 0;
	const toggle = (list, trope, set, other, setOther) => {
		setIndex(0);
		setOther(other.filter((item) => item !== trope));
		set(list.includes(trope) ? list.filter((item) => item !== trope) : [...list, trope]);
	};
	const open = (id) => {
		if (id === "salt") {
			navigate({ to: "/read" });
			return;
		}
		navigate({
			to: "/read",
			search: { preview: id }
		});
	};
	const pass = () => {
		setDx(0);
		if (cards.length < 2) return;
		setIndex((value) => (value + 1) % cards.length);
	};
	const back = () => {
		setDx(0);
		if (cards.length < 2) return;
		setIndex((value) => (value - 1 + cards.length) % cards.length);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio relative h-dvh overflow-hidden bg-ink text-paper",
		"data-theme": theme,
		"data-face": face,
		"data-size": "md",
		children: [
			behind ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: behind.cover,
				alt: "",
				className: "absolute inset-4 top-8 h-[calc(100%-5rem)] w-[calc(100%-2rem)] scale-95 rounded-3xl object-cover opacity-70"
			}) : null,
			story ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "absolute inset-3 top-4 bottom-24 overflow-hidden rounded-3xl",
				style: {
					transform: `translateX(${dx}px) rotate(${dx / 28}deg)`,
					transition: drag.current.on ? "none" : "transform 180ms ease"
				},
				onPointerDown: (event) => {
					drag.current = {
						x: event.clientX,
						on: true
					};
					event.currentTarget.setPointerCapture(event.pointerId);
				},
				onPointerMove: (event) => {
					if (!drag.current.on) return;
					setDx(event.clientX - drag.current.x);
				},
				onPointerUp: () => {
					const moved = dx;
					drag.current.on = false;
					if (moved > 90) open(story.id);
					else if (moved < -90) pass();
					else setDx(0);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: story.cover,
						alt: "",
						className: "h-full w-full object-cover"
					}),
					dx < -36 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-16 left-6 rounded-full border border-paper px-4 py-2 font-sans text-sm",
						children: "Not now"
					}) : null,
					dx > 36 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute top-16 right-6 rounded-full border border-paper px-4 py-2 font-sans text-sm",
						children: "Open"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/75 to-transparent px-5 pt-24 pb-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-3xl text-paper",
									children: story.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-sans text-sm text-paper/80",
									children: story.rating
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-serif text-lg text-paper",
								children: story.hook
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 flex flex-wrap gap-2",
								children: story.tropes.map((trope) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full border border-paper/40 px-2 py-1 font-sans text-xs text-paper",
									children: trope
								}, trope))
							})
						]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full flex-col items-center justify-center px-8 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-3xl",
					children: "Nothing matches that."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-6 h-12 rounded-full bg-paper px-5 font-sans text-sm text-ink",
					onClick: () => {
						setWant([]);
						setSkip([]);
						setIndex(0);
					},
					children: "Clear the filters"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Discover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 rounded-full bg-paper/90 px-4 font-sans text-sm text-ink",
						onClick: () => setFilters(true),
						children: "Filter"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex h-11 items-center rounded-full bg-paper/90 px-4 font-sans text-sm text-ink",
						children: "Shelf"
					})]
				})]
			}),
			story ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Previous book",
						onClick: back,
						className: "inline-flex size-12 items-center justify-center rounded-full border border-paper/50 text-paper",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Not now",
						onClick: pass,
						className: "inline-flex size-16 items-center justify-center rounded-full bg-paper text-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-12 rounded-full border border-paper/50 px-4 font-sans text-sm text-paper",
						onClick: () => void speakBlocks([{
							kind: "p",
							text: story.audio
						}]),
						children: "Hear"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Stop",
						className: "font-sans text-sm text-paper/70",
						onClick: () => stopSpeech(),
						children: "Stop"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Open",
						onClick: () => open(story.id),
						className: "inline-flex size-16 items-center justify-center rounded-full bg-paper text-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-7" })
					})
				]
			}) : null,
			filters ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-30 flex items-end bg-ink/50",
				onClick: () => setFilters(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl bg-paper p-5 text-ink",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "kicker",
								children: "Want"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-sans text-sm text-muted",
								onClick: () => setFilters(false),
								children: "Done"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: tropes.map((trope) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggle(want, trope, setWant, skip, setSkip),
								className: `h-10 rounded-full border px-3 font-sans text-sm ${want.includes(trope) ? "border-vermillion" : "border-line text-muted"}`,
								children: trope
							}, `w-${trope}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker mt-6",
							children: "Not this"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: tropes.map((trope) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => toggle(skip, trope, setSkip, want, setWant),
								className: `h-10 rounded-full border px-3 font-sans text-sm ${skip.includes(trope) ? "border-ink" : "border-line text-muted"}`,
								children: trope
							}, `s-${trope}`))
						})
					]
				})
			}) : null
		]
	});
}
//#endregion
export { Discover as component };
