import { i as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as shareCard, i as cacheVolume, n as book, o as chapters, r as bumpBadge } from "./book-tools-D-HmOi-d.mjs";
import { n as useReader } from "./reader-store-mg20pq1O.mjs";
import { d as BookOpen, o as Image, r as Share2, s as Download, u as Bookmark } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-3mQogOLX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Shelf() {
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const anchor = useReader((state) => state.anchor);
	const chapterTitle = useReader((state) => state.chapterTitle);
	const progress = useReader((state) => state.progress);
	const reset = useReader((state) => state.reset);
	const sealed = useReader((state) => state.sealed);
	const setSealed = useReader((state) => state.setSealed);
	const offline = useReader((state) => state.offline);
	const setOffline = useReader((state) => state.setOffline);
	const importedTitle = useReader((state) => state.importedTitle);
	const setImportedTitle = useReader((state) => state.setImportedTitle);
	const setManuscript = useReader((state) => state.setManuscript);
	const ownTitle = useReader((state) => state.ownTitle);
	const fileRef = (0, import_react.useRef)(null);
	const [installOpen, setInstallOpen] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const started = anchor > 0;
	(0, import_react.useEffect)(() => {
		bumpBadge(started);
	}, [started]);
	const onFile = async (file) => {
		if (!file) return;
		const text = await file.text();
		try {
			const parsed = JSON.parse(text);
			setImportedTitle(parsed.title || file.name.replace(/\.[^.]+$/, ""));
			if (!parsed.title) setManuscript(text);
		} catch {
			setImportedTitle(file.name.replace(/\.[^.]+$/, ""));
			setManuscript(text);
		}
		setNotice("Volume landed on the shelf.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio min-h-dvh bg-desk text-ink",
		"data-theme": theme,
		"data-size": "md",
		"data-face": face,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-5xl items-end justify-between gap-3 px-5 pt-6 pb-2 sm:px-8 sm:pt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					style: { textTransform: "none" },
					children: "LightNov"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-serif text-lg text-ink",
					children: "A book, with plates"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/discover",
							className: "inline-flex h-11 items-center rounded-full border border-line px-4 font-sans text-sm text-ink",
							children: "Discover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/write",
							className: "inline-flex h-11 items-center rounded-full border border-line px-4 font-sans text-sm text-ink",
							children: "Write"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setInstallOpen(true),
							className: "inline-flex h-11 items-center rounded-full border border-line px-4 font-sans text-sm text-ink",
							children: "Install"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-5xl px-5 pt-6 sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-5xl leading-none text-ink sm:text-7xl",
					children: "Under construction"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-sans text-lg text-muted",
					children: "from 22:00 to 01:00"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto grid max-w-5xl gap-8 px-5 pt-8 pb-16 sm:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14 lg:pt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "book relative bg-ink",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/plates/cover.jpg",
							alt: "Cover of Salt & Second Chances: a lamplighter on a night pier.",
							className: "h-full w-full object-cover"
						}), sealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "wrap-face",
							onClick: () => setSealed(false),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "seal",
									children: "New"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-serif text-2xl text-balance text-center",
									children: "A volume just landed"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-sans text-sm",
									children: "Unwrap"
								})
							]
						}) : null]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker",
							children: book.volume
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-serif text-4xl leading-tight text-balance text-ink sm:text-5xl",
							children: book.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-serif text-xl text-muted italic",
							children: book.subtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-xl font-serif text-lg leading-relaxed text-ink",
							children: book.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-sans text-sm text-muted",
							children: "Original sample · 2 chapters · color insert · plates"
						}),
						started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 flex items-center gap-2 font-sans text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {
									className: "size-4 text-vermillion",
									"aria-hidden": "true"
								}),
								"Ribbon in ",
								chapterTitle,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-line px-2 py-0.5 text-xs text-ink",
									children: "Home-screen badge"
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-1 w-full max-w-xs overflow-hidden rounded-full bg-line",
							"aria-hidden": "true",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-vermillion",
								style: { width: `${Math.max(started ? 4 : 0, Math.round(progress * 100))}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/read",
								className: "inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 font-sans text-sm font-medium text-paper",
								children: started ? "Continue reading" : "Open the book"
							}), started ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: reset,
								className: "inline-flex h-12 items-center justify-center rounded-full px-4 font-sans text-sm text-muted",
								children: "Start over"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 font-sans text-sm",
									onClick: () => {
										cacheVolume().then((ok) => {
											setOffline(ok);
											setNotice(ok ? "Plates saved for offline." : "This browser blocked the offline save.");
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), offline ? "Saved offline" : "Keep offline"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 font-sans text-sm",
									onClick: () => fileRef.current?.click(),
									children: "Open a volume file"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 font-sans text-sm",
									onClick: () => {
										shareCard(book.blurb).then((result) => {
											setNotice(result === "shared" ? "Share sheet opened." : "Quote copied.");
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" }), "Share"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileRef,
									type: "file",
									accept: ".json,.md,application/json,text/markdown,text/plain",
									className: "hidden",
									onChange: (event) => {
										const file = event.target.files?.[0];
										onFile(file);
										event.target.value = "";
									}
								})
							]
						}),
						notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-sans text-sm text-muted",
							children: notice
						}) : null,
						importedTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 rounded-2xl border border-line p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "kicker",
									children: "Landed from a file"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-serif text-2xl",
									children: importedTitle
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-sans text-sm text-muted",
									children: "It is in the studio, on the page."
								})
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-10 divide-y divide-line border-y border-line",
							children: chapters.map((chapter) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/read",
								search: { chapter: chapter.id },
								className: "flex min-h-16 items-center justify-between gap-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "kicker",
									children: chapter.kicker
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-1 block font-serif text-xl text-ink",
									children: chapter.title
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-sans text-sm text-muted",
									children: "Read"
								})]
							}) }, chapter.id))
						}),
						ownTitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/read",
							search: { own: true },
							className: "mt-8 block border-t border-line pt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "kicker",
								children: "Your volume"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 font-serif text-2xl",
								children: ownTitle
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-8 grid gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
										className: "size-4",
										"aria-hidden": "true"
									}),
									title: "Pages",
									children: "Bunko pages or a night scroll. Same volume."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, {
										className: "size-4",
										"aria-hidden": "true"
									}),
									title: "Plates",
									children: "Color insert first, then plates where the scene needs them."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Fact, {
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, {
										className: "size-4",
										"aria-hidden": "true"
									}),
									title: "Ribbon",
									children: "Your place stays on this device, and can badge the icon."
								})
							]
						})
					]
				})]
			}),
			installOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-end justify-center bg-ink/40 p-4 sm:items-center",
				onClick: () => setInstallOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-3xl bg-paper p-6 text-ink",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "kicker",
							children: "Add to your home screen"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-serif text-3xl",
							children: "LightNov, on its own"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-sans text-sm leading-relaxed text-muted",
							children: "Install it and it opens without the browser bar. The icon uses this volume’s cover mood. On iPhone: Share, then Add to Home Screen. On Android: the browser menu, then Install app."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-6 inline-flex h-12 items-center rounded-full bg-ink px-5 font-sans text-sm text-paper",
							onClick: () => setInstallOpen(false),
							children: "Close"
						})
					]
				})
			}) : null
		]
	});
}
function Fact({ icon, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "list-none",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-2 font-sans text-sm font-medium text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-vermillion",
				children: icon
			}), title]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 font-sans text-sm leading-relaxed text-muted",
			children
		})]
	});
}
function Home() {
	const anchor = useReader((state) => state.anchor);
	const navigate = useNavigate();
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const finish = () => {
			const seen = sessionStorage.getItem("lightnov-seen");
			const place = useReader.getState().anchor;
			if (!seen && place > 0) {
				sessionStorage.setItem("lightnov-seen", "1");
				navigate({
					to: "/read",
					replace: true
				});
				return;
			}
			sessionStorage.setItem("lightnov-seen", "1");
			setReady(true);
		};
		if (useReader.persist.hasHydrated()) finish();
		return useReader.persist.onFinishHydration(finish);
	}, [navigate]);
	if (!ready && anchor > 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {});
}
//#endregion
export { Home as component };
