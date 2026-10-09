import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, Y as require_react, b as Link, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as ChevronRight, f as ChevronLeft, i as Settings, l as Headphones, o as List, p as ArrowLeft, t as X } from "../_libs/lucide-react.mjs";
import { C as chapters, S as cast, T as glossary, b as blocks, c as Route$5, g as recapBank, h as previews, w as codex, x as book } from "./router-3JDcA_7e.mjs";
import { t as useReader } from "./reader-store-bNjKnc8J.mjs";
import { a as pageText, c as speakBlocks, i as nearestPlate, l as stopSpeech, n as downloadEpub, o as plateCount, r as minutesToNextPlate, s as setSpeechRate, u as wordCount } from "./book-tools-CIqR8eFf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/read-Cdyyw6dp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SOLO_KINDS = /* @__PURE__ */ new Set([
	"plate",
	"title",
	"end",
	"imprint",
	"insert",
	"afterword",
	"colophon"
]);
function packPages(heights, kinds, limit) {
	const pages = [];
	let cur = [];
	let used = 0;
	const flush = () => {
		if (cur.length) pages.push(cur);
		cur = [];
		used = 0;
	};
	for (let i = 0; i < heights.length; i++) {
		const h = Math.max(heights[i] ?? 0, 1);
		const kind = kinds[i] ?? "";
		if (SOLO_KINDS.has(kind)) {
			flush();
			pages.push([i]);
			continue;
		}
		if (kind === "chapter") flush();
		if (cur.length && used + h > limit) flush();
		cur.push(i);
		used += h;
	}
	flush();
	for (let p = 0; p < pages.length - 1; p++) {
		const page = pages[p];
		if (!page || page.length !== 1 || kinds[page[0] ?? -1] !== "chapter") continue;
		const next = pages[p + 1];
		const take = next?.[0];
		if (take === void 0 || kinds[take] !== "p") continue;
		if ((heights[page[0] ?? 0] ?? 0) + (heights[take] ?? 0) > limit) continue;
		page.push(take);
		next.shift();
	}
	return pages.filter((page) => page.length > 0);
}
function pageForAnchor(pages, anchor) {
	if (!pages.length) return 0;
	const exact = pages.findIndex((page) => page.includes(anchor));
	if (exact >= 0) return exact;
	let best = 0;
	pages.forEach((page, index) => {
		if ((page[0] ?? 0) <= anchor) best = index;
	});
	return best;
}
var RANK = {
	start: 0,
	pier: 1,
	letter: 2
};
function Reader({ chapter, plate, own, preview }) {
	const theme = useReader((state) => state.theme);
	const size = useReader((state) => state.size);
	const anchor = useReader((state) => state.anchor);
	const setTheme = useReader((state) => state.setTheme);
	const setSize = useReader((state) => state.setSize);
	const setAnchor = useReader((state) => state.setAnchor);
	const mode = useReader((state) => state.mode);
	const face = useReader((state) => state.face);
	const width = useReader((state) => state.width);
	const setWidth = useReader((state) => state.setWidth);
	const setMode = useReader((state) => state.setMode);
	const setFace = useReader((state) => state.setFace);
	const dogears = useReader((state) => state.dogears);
	const toggleDogear = useReader((state) => state.toggleDogear);
	const savedPlates = useReader((state) => state.savedPlates);
	useReader((state) => state.togglePlate);
	const addNote = useReader((state) => state.addNote);
	const notes = useReader((state) => state.notes);
	const bookmark = useReader((state) => state.bookmark);
	const setBookmark = useReader((state) => state.setBookmark);
	const finished = useReader((state) => state.finished);
	const setFinished = useReader((state) => state.setFinished);
	const setPassedLine = useReader((state) => state.setPassedLine);
	const ownBlocks = useReader((state) => state.ownBlocks);
	const ownTitle = useReader((state) => state.ownTitle);
	const quiet = useReader((state) => state.quiet);
	const setQuiet = useReader((state) => state.setQuiet);
	const rate = useReader((state) => state.rate);
	const setRate = useReader((state) => state.setRate);
	const pay = useReader((state) => state.pay);
	const bumpListens = useReader((state) => state.bumpListens);
	const comments = useReader((state) => state.comments);
	const addComment = useReader((state) => state.addComment);
	const shown = preview ? previews[preview] : void 0;
	const blocks$1 = shown ? shown.blocks : own && ownBlocks.length ? ownBlocks : blocks;
	const volumeTitle = shown ? shown.title : own && ownTitle ? ownTitle : book.title;
	const [gloss, setGloss] = (0, import_react.useState)(null);
	const [litPlate, setLitPlate] = (0, import_react.useState)(null);
	const [glow, setGlow] = (0, import_react.useState)(null);
	const [insertOpen, setInsertOpen] = (0, import_react.useState)(false);
	const [insertAt, setInsertAt] = (0, import_react.useState)(0);
	const [spread, setSpread] = (0, import_react.useState)(false);
	const [noteLine, setNoteLine] = (0, import_react.useState)("");
	const [quoteOpen, setQuoteOpen] = (0, import_react.useState)(false);
	const [noteDraft, setNoteDraft] = (0, import_react.useState)("");
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const [markFlash, setMarkFlash] = (0, import_react.useState)(false);
	const [hearing, setHearing] = (0, import_react.useState)(false);
	const [voiceNote, setVoiceNote] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const bodyRef = (0, import_react.useRef)(null);
	const measureRef = (0, import_react.useRef)(null);
	const blocksRef = (0, import_react.useRef)(blocks$1);
	blocksRef.current = blocks$1;
	const [pages, setPages] = (0, import_react.useState)([]);
	const [panel, setPanel] = (0, import_react.useState)(null);
	const [chrome, setChrome] = (0, import_react.useState)(true);
	const [turn, setTurn] = (0, import_react.useState)(null);
	const drag = (0, import_react.useRef)(null);
	const lastTap = (0, import_react.useRef)(0);
	const pendingTurn = (0, import_react.useRef)(null);
	const justToggled = (0, import_react.useRef)(0);
	const suppressClick = (0, import_react.useRef)(false);
	const measure = (0, import_react.useCallback)(() => {
		const body = bodyRef.current;
		const column = measureRef.current;
		if (!body || !column) return;
		const style = getComputedStyle(body);
		const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
		const padY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
		const width = body.clientWidth - padX;
		const limit = body.clientHeight - padY;
		if (width < 40 || limit < 80) return;
		column.style.width = `${width}px`;
		const next = packPages([...column.querySelectorAll("[data-measure]")].map((node) => node.offsetHeight), blocksRef.current.map((block) => block.kind), limit);
		setPages((prev) => samePages(prev, next) ? prev : next);
	}, []);
	(0, import_react.useEffect)(() => {
		const onDouble = (event) => {
			const target = event.target;
			if (!target?.closest(".folio")) return;
			if (target.closest("a, .ribbon, aside, input, textarea, header, .ghost-turn")) return;
			if (performance.now() - justToggled.current < 500) return;
			if (pendingTurn.current) {
				window.clearTimeout(pendingTurn.current);
				pendingTurn.current = null;
			}
			setChrome((value) => !value);
		};
		document.addEventListener("dblclick", onDouble, true);
		return () => document.removeEventListener("dblclick", onDouble, true);
	}, []);
	(0, import_react.useLayoutEffect)(() => {
		measure();
	}, [
		measure,
		theme,
		size,
		own,
		ownBlocks,
		spread,
		chrome,
		preview
	]);
	(0, import_react.useEffect)(() => {
		const media = window.matchMedia("(orientation: landscape) and (min-width: 960px)");
		const apply = () => setSpread(media.matches);
		apply();
		media.addEventListener("change", apply);
		return () => media.removeEventListener("change", apply);
	}, []);
	(0, import_react.useEffect)(() => {
		const body = bodyRef.current;
		if (!body) return;
		const observer = new ResizeObserver(() => measure());
		observer.observe(body);
		const fonts = document.fonts;
		if (fonts?.ready) fonts.ready.then(() => measure());
		return () => observer.disconnect();
	}, [measure]);
	(0, import_react.useEffect)(() => {
		if (!chapter && !plate) return;
		const index = plate ? blocks$1.findIndex((block) => block.kind === "plate" && block.id === plate) : blocks$1.findIndex((block) => block.kind === "chapter" && block.id === chapter);
		if (index < 0) return;
		const nextChapter = blocks$1.findIndex((block, at) => at > index && block.kind === "chapter");
		const current = useReader.getState().anchor;
		if (!(plate ? current !== index : current < index || nextChapter >= 0 && current >= nextChapter)) return;
		const title = blocks$1[index];
		const label = title?.kind === "chapter" ? title.title : title?.kind === "plate" ? title.caption : book.title;
		setAnchor(index, label, index / Math.max(1, blocks$1.length - 1));
	}, [
		chapter,
		plate,
		blocks$1,
		setAnchor
	]);
	const chapterIndex = chapter ? blocks$1.findIndex((block) => block.kind === "chapter" && block.id === chapter) : -1;
	const nextChapterIndex = chapterIndex >= 0 ? blocks$1.findIndex((block, index) => index > chapterIndex && block.kind === "chapter") : -1;
	const insertPlates = blocks$1.filter((block) => block.kind === "plate" && block.insert === true);
	const hasAfterword = blocks$1.some((block) => block.kind === "afterword");
	const view = pages.filter((group) => {
		if (chapterIndex >= 0 && group.every((index) => index < chapterIndex)) return false;
		if (nextChapterIndex >= 0 && group.every((index) => index >= nextChapterIndex)) return false;
		if (group.every((index) => {
			const block = blocks$1[index];
			return block?.kind === "insert" || block?.kind === "plate" && block.insert;
		})) return false;
		if (!finished && hasAfterword && group.some((index) => {
			const block = blocks$1[index];
			return block?.kind === "afterword" || block?.kind === "cast" || block?.kind === "colophon" || block?.kind === "end" || block?.kind === "plate" && block.id === "omake";
		})) return false;
		return true;
	});
	const links = blocks$1.flatMap((block) => block.kind === "plate" && block.bind ? [{
		id: block.id,
		phrase: block.bind
	}] : []);
	const faces = [{
		name: "Lioren",
		src: "/plates/portrait.jpg",
		plate: "portrait"
	}, {
		name: "Maris",
		src: "/plates/keeper.jpg",
		plate: "keeper"
	}].filter((face) => {
		const first = blocks$1.findIndex((block) => block.kind === "p" && block.text.includes(face.name));
		if (first < 0 || anchor < first) return false;
		return (view[pageForAnchor(view, anchor)] ?? []).some((index) => {
			const block = blocks$1[index];
			return block?.kind === "p" && block.text.includes(face.name);
		});
	});
	const page = pageForAnchor(view, anchor);
	const pageBlocks = (view[page] ?? []).map((index) => blocks$1[index]).filter(Boolean);
	const mateBlocks = spread ? (view[page + 1] ?? []).map((index) => blocks$1[index]).filter(Boolean) : [];
	const pageMarked = bookmark !== null && (view[page] ?? []).includes(bookmark);
	(0, import_react.useEffect)(() => {
		if (!pages.length) return;
		const currentAnchor = useReader.getState().anchor;
		const current = pageForAnchor(view, currentAnchor);
		let title = book.title;
		for (const group of view.slice(0, current + 1)) for (const index of group) {
			const block = blocks$1[index];
			if (block?.kind === "chapter") title = block.title;
		}
		setAnchor(currentAnchor, title, currentAnchor / (blocks$1.length - 1));
	}, [view, setAnchor]);
	const go = (0, import_react.useCallback)((direction) => {
		const current = pageForAnchor(view, useReader.getState().anchor);
		if (direction === 1 && current >= view.length - 1 && !finished && hasAfterword) {
			const index = blocks$1.findIndex((block) => block.kind === "afterword");
			if (index >= 0) {
				setFinished(true);
				setGlow(null);
				setTurn("next");
				setAnchor(index, "Afterword", index / (blocks$1.length - 1));
			}
			return;
		}
		const stride = spread && view[current + direction * 2] ? 2 : 1;
		const nextAnchor = view[current + direction * stride]?.[0];
		if (nextAnchor === void 0) return;
		if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && navigator.vibrate) navigator.vibrate(10);
		setTurn(direction === 1 ? "next" : "prev");
		setGlow(null);
		let title = book.title;
		for (const group of view.slice(0, current + direction * stride + 1)) for (const index of group) {
			const block = blocks$1[index];
			if (block?.kind === "chapter") title = block.title;
		}
		setAnchor(nextAnchor, title, nextAnchor / (blocks$1.length - 1));
	}, [
		view,
		setAnchor,
		spread,
		finished,
		hasAfterword,
		blocks$1,
		setFinished
	]);
	const followPlate = (item) => {
		if (item.bind) {
			const index = blocks$1.findIndex((block) => block.kind === "p" && block.text.includes(item.bind ?? ""));
			if (index >= 0) {
				setGlow(item.bind);
				setLitPlate(null);
				setAnchor(index, book.title, index / (blocks$1.length - 1));
				return;
			}
		}
		setLitPlate(item);
	};
	const openLink = (id) => {
		const item = blocks$1.find((block) => block.kind === "plate" && block.id === id);
		if (item?.kind === "plate") setLitPlate(item);
	};
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key === "ArrowRight" || event.key === "PageDown") {
				event.preventDefault();
				go(1);
			} else if (event.key === "ArrowLeft" || event.key === "PageUp") {
				event.preventDefault();
				go(-1);
			} else if (event.key === "Escape") {
				event.preventDefault();
				if (panel) setPanel(null);
				else setChrome(true);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [go, panel]);
	const jumpKind = (kind) => {
		const index = blocks$1.findIndex((block) => block.kind === kind);
		if (index < 0) return;
		setAnchor(index, book.title, index / (blocks$1.length - 1));
		setPanel(null);
	};
	const quoteLine = pageText(pageBlocks).slice(0, 180);
	const quotePlate = nearestPlate(anchor);
	const jumpTo = (id) => {
		const index = blocks$1.findIndex((block) => block.kind === "chapter" && block.id === id);
		if (index < 0) return;
		const title = blocks$1[index];
		setTurn("next");
		setAnchor(index, title && title.kind === "chapter" ? title.title : book.title, index / (blocks$1.length - 1));
		setPanel(null);
		navigate({
			to: "/read",
			search: {
				chapter: id,
				own,
				preview
			}
		});
	};
	const chapterLabel = (() => {
		let title = book.volume;
		for (const group of view.slice(0, page + 1)) for (const index of group) {
			const block = blocks$1[index];
			if (block?.kind === "chapter") title = block.title;
		}
		return title;
	})();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio relative h-dvh overflow-hidden bg-desk text-ink",
		"data-theme": theme,
		"data-size": size,
		"data-face": face,
		"data-width": width,
		"data-mode": mode,
		"data-immersive": chrome ? "false" : "true",
		onPointerUp: (event) => {
			if (event.target.closest("a, .ribbon, aside, input, textarea, .ghost-turn, header")) return;
			const now = performance.now();
			if (now - lastTap.current < 800) {
				lastTap.current = 0;
				suppressClick.current = true;
				justToggled.current = performance.now();
				if (pendingTurn.current) {
					window.clearTimeout(pendingTurn.current);
					pendingTurn.current = null;
				}
				setChrome((value) => !value);
				return;
			}
			lastTap.current = now;
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: `absolute inset-x-0 top-0 z-30 flex h-14 items-center gap-2 px-3 transition-opacity sm:px-5 ${chrome ? "opacity-100" : "hidden"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-3 font-sans text-sm text-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-sans text-sm font-medium text-ink",
							children: volumeTitle
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate font-sans text-xs text-muted",
							children: [chapterLabel, pay !== "free" && reachedFrom(anchor) >= 2 ? " · marked paid, still open" : ""]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							justToggled.current = performance.now();
							setChrome(false);
						},
						className: "inline-flex h-11 items-center rounded-full bg-ink px-4 font-sans text-sm text-paper",
						children: "Read"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Contents",
						onClick: () => setPanel(panel === "contents" ? null : "contents"),
						className: "inline-flex size-11 items-center justify-center rounded-full text-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": hearing ? "Stop reading aloud" : "Listen to this page",
						onClick: () => {
							if (hearing) {
								stopSpeech();
								setHearing(false);
								setVoiceNote("");
								return;
							}
							bumpListens();
							setHearing(true);
							setVoiceNote("Playing");
							speakBlocks(mode === "scroll" ? blocks$1 : pageBlocks, rate, setVoiceNote).finally(() => {
								setHearing(false);
								setVoiceNote("");
							});
						},
						className: "inline-flex size-11 items-center justify-center rounded-full text-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Headphones, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-label": "Reading settings",
						onClick: () => setPanel(panel === "settings" ? null : "settings"),
						className: "inline-flex size-11 items-center justify-center rounded-full text-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" })
					})
				]
			}),
			voiceNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "absolute inset-x-0 top-14 z-30 px-4 text-center font-sans text-xs text-[#12B8FF]",
				children: voiceNote
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: chrome ? "flex h-full items-stretch justify-center px-3 pt-16 pb-20 sm:px-8" : "fixed inset-0 z-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: `sheet relative flex h-full w-full flex-col overflow-hidden bg-paper ${chrome ? "" : "max-w-none"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "ribbon",
							"data-set": pageMarked ? "true" : "false",
							"aria-pressed": pageMarked,
							"aria-label": pageMarked ? "Bookmark saved on this page" : "Bookmark this page",
							onClick: () => {
								const here = view[page]?.[0] ?? anchor;
								setBookmark(here);
								setMarkFlash(true);
								window.setTimeout(() => setMarkFlash(false), 900);
							}
						}),
						markFlash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pointer-events-none absolute top-12 right-6 z-30 font-sans text-xs text-vermillion",
							children: "Marked"
						}) : null,
						!chrome ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-20 flex h-12 shrink-0 items-center gap-4 px-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-paper px-3 font-sans text-sm text-ink",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back"]
							}), insertPlates.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-sans text-sm text-muted",
								onClick: () => setInsertOpen(true),
								children: "Illustrations"
							}) : null]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `flex min-h-0 flex-1 ${spread && !chrome ? "gap-0" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								ref: bodyRef,
								className: `relative min-h-0 flex-1 px-6 sm:px-10 ${chrome ? "pt-8" : "pt-1"} ${mode === "scroll" ? "overflow-auto" : "overflow-hidden"}`,
								children: [mode === "scroll" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pb-8",
									children: blocks$1.map((block, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBlock, {
										block,
										reached: reachedFrom(anchor),
										onTerm: setGloss,
										onPlate: setLitPlate
									}, index))
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `h-full ${turn === "prev" ? "page-turn-prev" : turn ? "page-turn-next" : ""}`,
									onPointerDown: (event) => {
										drag.current = {
											x: event.clientX,
											y: event.clientY
										};
									},
									onPointerUp: (event) => {
										if (!drag.current) return;
										const dx = event.clientX - drag.current.x;
										const dy = event.clientY - drag.current.y;
										drag.current = null;
										if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
											suppressClick.current = true;
											go(dx < 0 ? 1 : -1);
										}
									},
									onClick: () => {
										suppressClick.current = false;
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageBody, {
										blocks: pageBlocks,
										reached: reachedFrom(anchor),
										onTerm: setGloss,
										onPlate: followPlate,
										links,
										glow,
										onLink: openLink
									})
								}, `${page}-${turn ?? "stay"}`), faces.map((face) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "absolute top-24 left-1 z-20 h-28 w-7 overflow-hidden",
									"aria-label": face.name,
									onClick: () => {
										const item = blocks$1.find((block) => block.kind === "plate" && block.id === face.plate);
										if (item?.kind === "plate") setLitPlate(item);
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: face.src,
										alt: "",
										className: "h-full w-full object-cover object-[center_18%]"
									})
								}, face.name))]
							}), spread && !chrome && mateBlocks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "min-h-0 flex-1 overflow-hidden border-l border-line px-6 pt-1 sm:px-10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageBody, {
									blocks: mateBlocks,
									reached: reachedFrom(anchor),
									onTerm: setGloss,
									onPlate: followPlate,
									links,
									glow,
									onLink: openLink
								})
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
							className: `flex items-center justify-center gap-3 px-6 pt-2 pb-4 font-sans text-xs text-muted tabular-nums ${chrome ? "" : "hidden"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-px w-6 bg-line",
									"aria-hidden": "true"
								}),
								pages.length ? page + 1 : 1,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: "/"
								}),
								Math.max(view.length, 1),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "h-px w-6 bg-line",
									"aria-hidden": "true"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							tabIndex: -1,
							"aria-label": "Previous page",
							onClick: () => {
								if (suppressClick.current) {
									suppressClick.current = false;
									return;
								}
								if (pendingTurn.current) window.clearTimeout(pendingTurn.current);
								pendingTurn.current = window.setTimeout(() => {
									pendingTurn.current = null;
									go(-1);
								}, 280);
							},
							className: "absolute inset-y-0 left-0 z-10 w-[18%] disabled:hidden",
							disabled: page <= 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							tabIndex: -1,
							"aria-label": "Next page",
							onClick: () => {
								if (suppressClick.current) {
									suppressClick.current = false;
									return;
								}
								if (pendingTurn.current) window.clearTimeout(pendingTurn.current);
								pendingTurn.current = window.setTimeout(() => {
									pendingTurn.current = null;
									go(1);
								}, 280);
							},
							className: "absolute inset-y-0 right-0 z-10 w-[18%]",
							disabled: view.length > 0 && page >= view.length - 1
						}),
						!chrome ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative z-20 flex h-12 shrink-0 items-center justify-between px-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => go(-1),
								disabled: page <= 0,
								className: "font-sans text-sm text-ink opacity-25 disabled:opacity-10",
								children: "Prev"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => go(1),
								disabled: view.length > 0 && page >= view.length - 1,
								className: "font-sans text-sm text-ink opacity-25 disabled:opacity-10",
								children: "Next"
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							ref: measureRef,
							className: "pointer-events-none absolute top-0 left-0 -z-10 opacity-0",
							"aria-hidden": "true",
							children: blocks$1.map((block, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MeasureBlock, { block }, index))
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: `absolute inset-x-0 bottom-0 z-30 flex h-16 items-center justify-between gap-3 px-3 sm:px-6 ${chrome ? "" : "hidden"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => go(-1),
						disabled: page <= 0,
						className: "inline-flex h-11 items-center gap-1 rounded-full px-3 font-sans text-sm text-ink disabled:opacity-30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "Prev"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-sans text-xs text-muted",
						children: [minutesToNextPlate(anchor), " min to the next illustration"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => go(1),
						disabled: view.length > 0 && page >= view.length - 1,
						className: "inline-flex h-11 items-center gap-1 rounded-full px-3 font-sans text-sm text-ink disabled:opacity-30",
						children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
					})
				]
			}),
			panel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-40 bg-ink/30",
				onClick: () => setPanel(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-paper text-ink shadow-2xl",
					onClick: (event) => event.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-14 items-center justify-between px-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-sm font-medium",
							children: panel === "contents" ? "Contents" : panel === "codex" ? "Codex" : panel === "marks" ? "Marks" : panel === "recap" ? "Recap" : panel === "chapter" ? "Chapter" : "The page"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Close",
							onClick: () => setPanel(null),
							className: "inline-flex size-11 items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}), panel === "contents" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "flex-1 overflow-auto px-5 pb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setInsertOpen(true);
									setPanel(null);
								},
								className: "flex min-h-14 w-full items-center text-left font-serif text-lg",
								children: "Illustrations"
							}) }),
							blocks$1.filter((block) => block.kind === "plate" && !block.insert && block.id !== "omake").map((block) => {
								if (block.kind !== "plate") return null;
								const index = blocks$1.indexOf(block);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "border-t border-line",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setAnchor(index, block.caption, index / (blocks$1.length - 1));
											setPanel(null);
										},
										className: "flex min-h-14 w-full items-center text-left font-serif text-lg",
										children: block.caption
									})
								}, block.id);
							}),
							chapters.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "border-t border-line",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => jumpTo(item.id),
									className: "flex min-h-16 w-full flex-col justify-center text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "kicker",
										children: item.kicker
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 font-serif text-xl",
										children: item.title
									})]
								})
							}, item.id)),
							hasAfterword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "border-t border-line",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: !finished,
									onClick: () => finished && jumpKind("afterword"),
									className: "flex min-h-14 w-full items-center text-left font-serif text-lg disabled:text-muted",
									children: ["Afterword", finished ? "" : " · sealed"]
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "border-t border-line",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: hasAfterword && !finished,
									onClick: () => (!hasAfterword || finished) && jumpKind("cast"),
									className: "flex min-h-14 w-full items-center text-left font-serif text-lg disabled:text-muted",
									children: ["Cast", hasAfterword && !finished ? " · sealed" : ""]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "border-t border-line",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									disabled: hasAfterword && !finished,
									onClick: () => (!hasAfterword || finished) && jumpKind("colophon"),
									className: "flex min-h-14 w-full items-center text-left font-serif text-lg disabled:text-muted",
									children: ["Colophon", hasAfterword && !finished ? " · sealed" : ""]
								})
							})
						]
					}) : panel === "codex" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "flex-1 overflow-auto px-5 pb-8",
						children: [codex.filter((entry) => reachedFrom(anchor) >= (RANK[entry.from] ?? 0)).map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-t border-line py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "kicker",
									children: entry.group
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-serif text-xl",
									children: entry.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-sans text-xs text-muted",
									children: [
										entry.title,
										" · ",
										entry.faction
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-sans text-sm",
									children: entry.relation
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-sans text-sm text-muted",
									children: entry.ability
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-sans text-sm leading-relaxed text-muted",
									children: entry.body
								})
							]
						}, entry.name)), codex.some((entry) => reachedFrom(anchor) < (RANK[entry.from] ?? 0)) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "py-4 font-sans text-sm text-muted",
							children: "Later names stay hidden until you reach them."
						}) : null]
					}) : panel === "marks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col gap-4 overflow-auto px-5 pb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-12 rounded-full border border-line font-sans text-sm",
								onClick: () => toggleDogear(anchor),
								children: dogears.includes(anchor) ? "Dog-ear removed" : "Dog-ear this page"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-sans text-sm text-muted",
								children: [
									dogears.length,
									" dog-ears · ",
									savedPlates.length,
									" illustrations saved"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "font-sans text-sm text-muted",
								children: ["Private note", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: noteDraft,
									onChange: (event) => setNoteDraft(event.target.value),
									className: "mt-2 h-24 w-full rounded-2xl border border-line bg-paper p-3 text-ink"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-12 rounded-full bg-ink font-sans text-sm text-paper",
								onClick: () => {
									if (noteDraft.trim()) addNote(anchor, noteDraft.trim());
									setNoteDraft("");
								},
								children: "Save note"
							}),
							notes.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-serif text-base",
								children: item.text
							}, `${item.anchor}-${item.text}`))
						]
					}) : panel === "recap" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "flex flex-1 flex-col gap-4 overflow-auto px-5 pb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "font-sans text-sm text-muted",
							children: "Only what you have already read. Later chapters stay out."
						}), recapBank.filter((item) => reachedFrom(anchor) >= item.from).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-lg",
							children: item.ask
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-sans text-sm leading-relaxed text-muted",
							children: item.answer
						})] }, item.ask))]
					}) : panel === "chapter" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col gap-3 overflow-auto px-5 pb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-sm text-muted",
								children: "Notes on this chapter. Not on the sentence."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "flex flex-col gap-3",
								children: comments.filter((item) => item.chapter === chapterLabel).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "font-serif text-lg",
									children: item.text
								}, item.text))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-2 flex flex-col gap-2",
								onSubmit: (event) => {
									event.preventDefault();
									if (!noteLine.trim()) return;
									addComment(chapterLabel, noteLine.trim());
									setNoteLine("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: noteLine,
									onChange: (event) => setNoteLine(event.target.value),
									"aria-label": "Chapter note",
									className: "h-24 rounded-2xl border border-line bg-paper p-3 font-serif text-lg"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "h-11 rounded-full bg-ink font-sans text-sm text-paper",
									children: "Leave it on the chapter"
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col gap-8 overflow-auto px-5 pb-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "kicker",
								children: "Paper"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swatch, {
										name: "paper",
										current: theme,
										onPick: setTheme,
										label: "Ivory",
										className: "bg-swatch-paper"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swatch, {
										name: "sepia",
										current: theme,
										onPick: setTheme,
										label: "Sepia",
										className: "bg-swatch-sepia"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Swatch, {
										name: "night",
										current: theme,
										onPick: setTheme,
										label: "Night",
										className: "bg-swatch-night"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "kicker",
								children: "Body"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
									name: "bunko",
									current: mode,
									onPick: setMode,
									label: "Bunko"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeButton, {
									name: "scroll",
									current: mode,
									onPick: setMode,
									label: "Scroll"
								})]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "kicker",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeButton, {
											name: "sm",
											current: size,
											onPick: setSize,
											label: "Small",
											className: "text-sm"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeButton, {
											name: "md",
											current: size,
											onPick: setSize,
											label: "Book",
											className: "text-base"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeButton, {
											name: "lg",
											current: size,
											onPick: setSize,
											label: "Large",
											className: "text-lg"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceButton, {
											name: "newsreader",
											current: face,
											onPick: setFace,
											label: "News"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceButton, {
											name: "literata",
											current: face,
											onPick: setFace,
											label: "Literata"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceButton, {
											name: "fraunces",
											current: face,
											onPick: setFace,
											label: "Fraunces"
										})
									]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "kicker",
								children: "Width"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid grid-cols-3 gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWidth("narrow"),
										className: `h-11 rounded-full border font-sans text-sm ${width === "narrow" ? "border-vermillion" : "border-line"}`,
										children: "Narrow"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWidth("book"),
										className: `h-11 rounded-full border font-sans text-sm ${width === "book" ? "border-vermillion" : "border-line"}`,
										children: "Book"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setWidth("wide"),
										className: `h-11 rounded-full border font-sans text-sm ${width === "wide" ? "border-vermillion" : "border-line"}`,
										children: "Wide"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-12 rounded-full border border-line font-sans text-sm",
										onClick: () => {
											bumpListens();
											setHearing(true);
											setVoiceNote("Playing");
											speakBlocks(mode === "scroll" ? blocks$1 : pageBlocks, rate, setVoiceNote).finally(() => {
												setHearing(false);
												setVoiceNote("");
											});
										},
										children: hearing ? "Reading" : "Listen"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-2",
										children: [
											.9,
											1,
											1.25,
											1.5
										].map((speed) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => {
												setRate(speed);
												setSpeechRate(speed);
											},
											className: `h-11 flex-1 rounded-full border font-sans text-sm ${rate === speed ? "border-vermillion" : "border-line text-muted"}`,
											children: [speed, "×"]
										}, speed))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-12 rounded-full border border-line font-sans text-sm",
										onClick: () => stopSpeech(),
										children: "Stop voice"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-12 rounded-full border border-line font-sans text-sm",
										onClick: () => setPanel("recap"),
										children: "Recap, up to here"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-12 rounded-full border border-line font-sans text-sm",
										onClick: () => setPanel("chapter"),
										children: "Chapter notes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-12 rounded-full border border-line font-sans text-sm",
										onClick: () => setQuiet(!quiet),
										children: quiet ? "Line reactions are hidden" : "Hide line reactions"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-12 rounded-full border border-line font-sans text-sm",
										onClick: () => {
											setQuoteOpen(true);
											setPanel(null);
										},
										children: "Quote card"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-12 rounded-full border border-line font-sans text-sm",
										onClick: () => setPanel("codex"),
										children: "Codex"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-12 rounded-full border border-line font-sans text-sm",
										onClick: () => setPanel("marks"),
										children: "Marks and notes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										disabled: exporting,
										className: "h-12 rounded-full bg-ink font-sans text-sm text-paper disabled:opacity-50",
										onClick: () => {
											setExporting(true);
											downloadEpub().finally(() => setExporting(false));
										},
										children: exporting ? "Building EPUB…" : "Export EPUB"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-sans text-sm leading-relaxed text-muted",
								children: "Press Read, or double-tap the page, and the page fills the screen. Double-tap again for the framed page. The ribbon bookmarks this page."
							})
						]
					})]
				})
			}) : null,
			gloss ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-20 z-40 mx-auto w-[min(100%-1.5rem,24rem)] rounded-2xl bg-paper p-4 text-ink shadow-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: gloss
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-serif text-lg",
						children: glossary.find((item) => item.term === gloss)?.blurb
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-3 font-sans text-sm text-muted",
						onClick: () => setGloss(null),
						children: "Close"
					})
				]
			}) : null,
			litPlate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-50 flex flex-col bg-ink/90 p-4",
				onClick: () => setLitPlate(null),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: litPlate.src,
						alt: litPlate.alt,
						className: "min-h-0 flex-1 object-contain"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pt-3 text-center font-serif text-paper",
						children: litPlate.caption
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mx-auto mt-3 font-sans text-sm text-paper/80",
						onClick: (event) => {
							event.stopPropagation();
							setPassedLine(litPlate.caption);
							setLitPlate(null);
						},
						children: "Pass this illustration"
					})
				]
			}) : null,
			insertOpen && insertPlates.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-50 flex flex-col bg-paper",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-12 items-center justify-between px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker",
							children: "Color insert"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "font-sans text-sm",
							onClick: () => setInsertOpen(false),
							children: "Close"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: insertPlates[insertAt]?.src,
						alt: insertPlates[insertAt]?.alt ?? "",
						className: "min-h-0 flex-1 object-contain"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-14 items-center justify-between px-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-sans text-sm text-muted",
								disabled: insertAt <= 0,
								onClick: () => setInsertAt((value) => value - 1),
								children: "Prev"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-sans text-xs text-muted",
								children: [
									insertAt + 1,
									" / ",
									insertPlates.length
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-sans text-sm text-muted",
								disabled: insertAt >= insertPlates.length - 1,
								onClick: () => setInsertAt((value) => value + 1),
								children: "Next"
							})
						]
					})
				]
			}) : null,
			quoteOpen && quotePlate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-50 flex items-center justify-center bg-ink/50 p-4",
				onClick: () => setQuoteOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "w-full max-w-sm overflow-hidden bg-ink text-paper",
					onClick: (event) => event.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: quotePlate.src,
						alt: "",
						className: "aspect-[2/3] w-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figcaption", {
						className: "p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-serif text-lg leading-snug",
							children: [
								"“",
								quoteLine,
								"”"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-sans text-xs tracking-widest uppercase",
							children: book.title
						})]
					})]
				})
			}) : null
		]
	});
}
function reachedFrom(anchor) {
	let rank = 0;
	for (let index = 0; index <= anchor; index++) {
		const block = blocks[index];
		if (block?.kind === "chapter") rank = RANK[block.id] ?? rank;
	}
	return rank;
}
function PageBody({ blocks: pageBlocks, reached, onTerm, onPlate, links, glow, onLink }) {
	if (pageBlocks.length === 1) {
		const only = pageBlocks[0];
		if (only && SOLO_KINDS.has(only.kind)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBlock, {
				block: only,
				reached,
				onTerm,
				onPlate,
				links,
				glow,
				onLink
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: pageBlocks.map((block, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: glow && block.kind === "p" && !block.text.includes(glow) ? "opacity-25" : "",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBlock, {
			block,
			reached,
			onTerm,
			onPlate,
			links,
			glow,
			onLink
		})
	}, index)) });
}
function LiveBlock({ block, reached, onTerm, onPlate, links = [], glow = null, onLink = () => {} }) {
	if (block.kind === "insert") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col justify-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Color insert"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-serif text-4xl leading-tight",
				children: "Four illustrations, before the prose"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-serif text-lg text-muted",
				children: "Turn the page. The story starts after the insert."
			})
		]
	});
	if (block.kind === "imprint") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col justify-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Imprint"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-serif text-3xl",
				children: "LightNov"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-serif text-lg text-muted",
				children: "Original sample volume. Set in the author’s chosen face."
			})
		]
	});
	if (block.kind === "title") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col justify-center pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: book.volume
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-serif text-4xl leading-tight text-balance sm:text-5xl",
				children: book.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-serif text-xl text-muted italic",
				children: book.subtitle
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-8 h-px w-14 bg-vermillion" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 font-sans text-sm text-muted",
				children: "A LightNov sample · original text"
			})
		]
	});
	if (block.kind === "afterword") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col justify-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Afterword"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-serif text-3xl leading-tight",
				children: "He still doesn’t know who the letter is for."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-serif text-lg leading-relaxed text-muted",
				children: "That is the point of the sample. The next volume would open on the alley, not on an explanation."
			})
		]
	});
	if (block.kind === "cast") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "kicker",
		children: "Cast"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-4 flex flex-col gap-3",
		children: cast.map((person) => {
			const plate = blocks.find((item) => item.kind === "plate" && item.id === person.plate);
			const src = plate && plate.kind === "plate" ? plate.src : "/plates/cover.jpg";
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt: "",
					className: "size-14 object-cover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block font-serif text-lg",
					children: person.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-sans text-xs text-muted",
					children: person.role
				})] })]
			}, person.name);
		})
	})] });
	if (block.kind === "colophon") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col justify-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Colophon"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 font-serif text-4xl tabular-nums",
				children: [wordCount().toLocaleString(), " words"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-serif text-xl text-muted",
				children: [plateCount(), " illustrations in this volume"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 font-sans text-sm text-muted",
				children: "Set for LightNov. Paper, ribbon, and a short haptic on the turn."
			})
		]
	});
	if (block.kind === "end") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col items-center justify-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/plates/cover.jpg",
				alt: "",
				className: "max-h-[68%] w-auto object-contain"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 font-serif text-2xl",
				children: "Closed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "mt-4 inline-flex h-11 items-center gap-1.5 rounded-full border border-line px-4 font-sans text-sm text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Back"]
			})
		]
	});
	if (block.kind === "plate") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
		className: "relative flex h-full min-h-0 flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "min-h-0 flex-1",
			onClick: () => onPlate(block),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: block.src,
				alt: block.alt,
				className: "h-full w-full object-contain object-center"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute right-0 bottom-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlateSave, { id: block.id })
		})]
	});
	if (block.kind === "chapter") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "kicker",
			children: block.kicker
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-2 font-serif text-3xl leading-tight text-balance",
			children: block.title
		})]
	});
	if (block.kind === "ornament") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-center gap-3 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-line" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rotate-45 bg-vermillion" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-line" })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: `read-copy gap-after ${block.drop ? "drop-cap" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichText, {
			text: block.text,
			reached,
			onTerm,
			links,
			glow,
			onLink
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineMarks, { line: block.text })]
	});
}
function MeasureBlock({ block }) {
	if (SOLO_KINDS.has(block.kind)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-measure": true,
		className: "h-px"
	});
	if (block.kind === "chapter") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		"data-measure": true,
		className: "pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "kicker",
			children: block.kicker
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-2 font-serif text-3xl leading-tight",
			children: block.title
		})]
	});
	if (block.kind === "ornament") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		"data-measure": true,
		className: "flex items-center justify-center gap-3 py-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-line" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rotate-45 bg-vermillion" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px w-8 bg-line" })
		]
	});
	if (block.kind === "cast") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-measure": true,
		className: "h-80"
	});
	if (block.kind !== "p") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"data-measure": true,
		className: "h-px"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		"data-measure": true,
		className: `read-copy gap-after ${block.drop ? "drop-cap" : ""}`,
		children: block.text
	});
}
function RichText({ text, reached, onTerm, links, glow, onLink }) {
	const link = links.find((item) => text.includes(item.phrase));
	if (link) {
		const [before, after] = text.split(itemPhrase(link.phrase));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlossaryText, {
				text: before ?? "",
				reached,
				onTerm
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: glow === link.phrase ? "bind-hot" : "bind",
				onClick: () => onLink(link.id),
				children: link.phrase
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlossaryText, {
				text: after ?? "",
				reached,
				onTerm
			})
		] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlossaryText, {
		text,
		reached,
		onTerm
	});
}
function LineMarks({ line }) {
	const quiet = useReader((state) => state.quiet);
	const reactions = useReader((state) => state.reactions);
	const addReaction = useReader((state) => state.addReaction);
	const [open, setOpen] = (0, import_react.useState)(false);
	if (quiet) return null;
	const key = line.slice(0, 80);
	const marks = [
		"❤️",
		"😭",
		"😂",
		"👀",
		"😡"
	];
	const chosen = reactions.filter((item) => item.key === key);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "mt-1 flex flex-wrap items-center gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "font-sans text-xs text-muted",
			onClick: () => setOpen((value) => !value),
			children: chosen.length ? chosen.map((item) => item.emoji).join(" ") : "Mark"
		}), open ? marks.map((mark) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "h-8 rounded-full border border-line px-2 font-sans text-xs",
			onClick: () => addReaction(key, mark),
			children: mark
		}, mark)) : null]
	});
}
function itemPhrase(phrase) {
	return phrase;
}
function GlossaryText({ text, reached, onTerm }) {
	const visible = glossary.filter((item) => reached >= (RANK[item.from] ?? 0));
	if (!visible.length) return text;
	const pattern = new RegExp(`\\b(${visible.map((item) => item.term).join("|")})\\b`, "gi");
	return text.split(pattern).map((part, index) => {
		const hit = visible.find((item) => item.term.toLowerCase() === part.toLowerCase());
		if (!hit) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, index);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "term",
			onClick: () => onTerm(hit.term),
			children: part
		}, index);
	});
}
function PlateSave({ id }) {
	const saved = useReader((state) => state.savedPlates.includes(id));
	const toggle = useReader((state) => state.togglePlate);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "font-sans text-xs text-vermillion",
		onClick: () => toggle(id),
		children: saved ? "Saved" : "Save illustration"
	});
}
function ModeButton({ name, current, onPick, label }) {
	const selected = name === current;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": selected,
		onClick: () => onPick(name),
		className: `h-12 rounded-full border font-sans text-sm ${selected ? "border-vermillion text-ink" : "border-line text-muted"}`,
		children: label
	});
}
function FaceButton({ name, current, onPick, label }) {
	const selected = name === current;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": selected,
		onClick: () => onPick(name),
		className: `h-12 rounded-full border font-serif text-sm ${selected ? "border-vermillion text-ink" : "border-line text-muted"}`,
		children: label
	});
}
function Swatch({ name, current, onPick, label, className }) {
	const selected = name === current;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		"aria-pressed": selected,
		onClick: () => onPick(name),
		className: "flex flex-col items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-12 rounded-full border ${className} ${selected ? "border-vermillion" : "border-line"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-sans text-xs text-muted",
			children: label
		})]
	});
}
function SizeButton({ name, current, onPick, label, className }) {
	const selected = name === current;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": selected,
		onClick: () => onPick(name),
		className: `flex h-12 items-center justify-center rounded-full border font-serif ${className} ${selected ? "border-vermillion text-ink" : "border-line text-muted"}`,
		children: label
	});
}
function samePages(a, b) {
	if (a.length !== b.length) return false;
	for (let i = 0; i < a.length; i++) {
		const left = a[i];
		const right = b[i];
		if (!left || !right || left.length !== right.length) return false;
		for (let j = 0; j < left.length; j++) if (left[j] !== right[j]) return false;
	}
	return true;
}
function ReadPage() {
	const { chapter, plate, own, preview } = Route$5.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reader, {
		chapter,
		plate,
		own,
		preview
	});
}
//#endregion
export { ReadPage as component };
