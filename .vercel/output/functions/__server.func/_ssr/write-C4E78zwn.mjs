import { i as __toESM } from "../_runtime.mjs";
import { r as retention } from "./catalog-DKe5GSfw.mjs";
import { S as require_jsx_runtime, Y as require_react, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useReader, t as plates } from "./reader-store-mg20pq1O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/write-C4E78zwn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var pays = [
	{
		id: "free",
		label: "Free"
	},
	{
		id: "intro",
		label: "Free opening, then paid"
	},
	{
		id: "subscription",
		label: "Subscription"
	}
];
function Desk() {
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const setOwn = useReader((state) => state.setOwn);
	const setAnchor = useReader((state) => state.setAnchor);
	const drafts = useReader((state) => state.drafts);
	const addDraft = useReader((state) => state.addDraft);
	const setDraft = useReader((state) => state.setDraft);
	const pay = useReader((state) => state.pay);
	const setPay = useReader((state) => state.setPay);
	const reactions = useReader((state) => state.reactions);
	const listens = useReader((state) => state.listens);
	const comments = useReader((state) => state.comments);
	const sheetRef = (0, import_react.useRef)(null);
	const [title, setTitle] = (0, import_react.useState)("Untitled volume");
	const [tab, setTab] = (0, import_react.useState)("page");
	const [draftTitle, setDraftTitle] = (0, import_react.useState)("");
	const navigate = useNavigate();
	const drop = (src, label) => {
		const root = sheetRef.current;
		if (!root) return;
		const figure = document.createElement("figure");
		figure.dataset.plate = src;
		figure.dataset.label = label;
		figure.className = "my-4";
		const image = document.createElement("img");
		image.src = src;
		image.alt = label;
		image.className = "mx-auto max-h-64";
		figure.append(image);
		root.append(figure);
	};
	const readIt = () => {
		const root = sheetRef.current;
		if (!root) return;
		const next = [{
			kind: "chapter",
			id: "own",
			kicker: "Your volume",
			title: title.trim() || "Untitled volume"
		}];
		for (const node of root.children) {
			if (!(node instanceof HTMLElement)) continue;
			if (node.dataset.plate) {
				next.push({
					kind: "plate",
					id: `own-${next.length}`,
					src: node.dataset.plate,
					alt: node.dataset.label ?? "",
					caption: node.dataset.label ?? ""
				});
				continue;
			}
			const text = node.textContent?.replace(/\u00a0/g, " ").trim();
			if (!text) continue;
			next.push({
				kind: "p",
				text,
				drop: next.length === 1
			});
		}
		next.push({ kind: "end" });
		setOwn(title.trim() || "Untitled volume", next);
		setAnchor(0, title.trim() || "Untitled volume", 0);
		navigate({
			to: "/read",
			search: { own: true }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio min-h-dvh bg-desk text-ink",
		"data-theme": theme,
		"data-size": "md",
		"data-face": face,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex max-w-3xl items-end justify-between px-5 pt-6 pb-2 sm:px-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Author desk"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-serif text-3xl",
					children: "The volume"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-sans text-sm text-muted",
					children: "Shelf"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex max-w-3xl gap-2 px-5 pt-4 sm:px-8",
				children: [
					"page",
					"chapters",
					"numbers"
				].map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(name),
					className: `h-10 rounded-full px-4 font-sans text-sm ${tab === name ? "bg-ink text-paper" : "border border-line"}`,
					children: name === "page" ? "Page" : name === "chapters" ? "Chapters" : "Numbers"
				}, name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-3xl px-5 pt-4 pb-16 sm:px-8",
				children: [
					tab === "page" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: title,
							onChange: (event) => setTitle(event.target.value),
							"aria-label": "Volume title",
							className: "w-full bg-transparent font-serif text-3xl outline-none"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [plates.map((plate) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-10 rounded-full border border-line px-3 font-sans text-sm",
								onClick: () => drop(plate.src, plate.label),
								children: plate.label
							}, plate.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-10 rounded-full bg-ink px-4 font-sans text-sm text-paper",
								onClick: readIt,
								children: "Read it"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
							ref: sheetRef,
							contentEditable: true,
							suppressContentEditableWarning: true,
							"aria-label": "Page",
							className: "sheet mt-4 min-h-[60dvh] bg-paper px-6 py-8 font-serif text-lg leading-relaxed outline-none",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The tide had come in wrong." })
						})
					] }) : null,
					tab === "chapters" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex gap-2",
								onSubmit: (event) => {
									event.preventDefault();
									if (!draftTitle.trim()) return;
									addDraft(draftTitle.trim());
									setDraftTitle("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: draftTitle,
									onChange: (event) => setDraftTitle(event.target.value),
									placeholder: "New chapter",
									"aria-label": "New chapter",
									className: "h-12 flex-1 rounded-2xl border border-line bg-paper px-3 font-serif text-lg"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "h-12 rounded-full bg-ink px-4 font-sans text-sm text-paper",
									children: "Add"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "divide-y divide-line border-y border-line",
								children: drafts.map((draft) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-col gap-2 py-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-serif text-xl",
											children: draft.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex flex-wrap gap-2",
											children: [
												"draft",
												"scheduled",
												"published"
											].map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setDraft(draft.id, { status }),
												className: `h-9 rounded-full border px-3 font-sans text-xs ${draft.status === status ? "border-vermillion" : "border-line text-muted"}`,
												children: status
											}, status))
										}),
										draft.status === "scheduled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "date",
											value: draft.when,
											onChange: (event) => setDraft(draft.id, { when: event.target.value }),
											"aria-label": `Release date for ${draft.title}`,
											className: "h-11 max-w-48 rounded-xl border border-line bg-paper px-3 font-sans text-sm"
										}) : null
									]
								}, draft.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
									className: "kicker",
									children: "How it is offered"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-sans text-sm text-muted",
									children: "Nothing is charged. Banking is not connected."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-col gap-2",
									children: pays.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setPay(mode.id),
										className: `h-12 rounded-full border px-4 text-left font-sans text-sm ${pay === mode.id ? "border-vermillion" : "border-line"}`,
										children: mode.label
									}, mode.id))
								})
							] })
						]
					}) : null,
					tab === "numbers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-sans text-sm text-muted",
							children: "Sample shape of this volume, plus what happened on this device."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 flex flex-col gap-3",
							children: retention.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between font-sans text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [row.value, "%"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 h-1 overflow-hidden rounded-full bg-line",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full bg-vermillion",
									style: { width: `${row.value}%` }
								})
							})] }, row.label))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-8 font-serif text-xl",
							children: "On this device"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 font-sans text-sm text-muted",
							children: [
								listens,
								" listens · ",
								reactions.length,
								" line reactions · ",
								comments.length,
								" chapter notes"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 flex flex-col gap-1",
							children: reactions.slice(-8).map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "font-sans text-sm",
								children: [
									item.emoji,
									" · ",
									item.key.slice(0, 72)
								]
							}, `${item.key}-${index}`))
						})
					] }) : null
				]
			})
		]
	});
}
//#endregion
export { Desk as component };
