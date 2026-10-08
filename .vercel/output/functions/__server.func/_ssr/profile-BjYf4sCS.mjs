import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as hasGateSessionMarker } from "./router-DhyAnJ2q.mjs";
import { t as AppNav } from "./nav-CzuovPGK.mjs";
import { r as signOut } from "./client-CRsMPsJW.mjs";
import { t as useReader } from "./reader-store-CB2CzwHY.mjs";
import { n as useOpenBook, t as useCurrentUser } from "./open-book-C88gd3Xs.mjs";
import { t as cacheVolume } from "./book-tools-MYxdNRSU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BjYf4sCS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
function Profile() {
	const theme = useReader((state) => state.theme);
	const face = useReader((state) => state.face);
	const offline = useReader((state) => state.offline);
	const setOffline = useReader((state) => state.setOffline);
	const { signedIn, opened, limit } = useOpenBook();
	const [install, setInstall] = (0, import_react.useState)(false);
	const [notice, setNotice] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "folio flex min-h-dvh flex-col bg-desk text-ink",
		"data-theme": theme,
		"data-face": face,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto w-full max-w-3xl px-5 pt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "Profile"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-serif text-4xl",
					children: "Your account"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-5 py-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-paper p-5",
					children: [signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-serif text-2xl",
							children: "Reading as a guest"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 font-sans text-sm text-muted",
							children: [
								opened,
								" of ",
								limit,
								" books opened. Sign in to keep going past that."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							className: "mt-4 inline-flex h-11 items-center rounded-full bg-ink px-4 font-sans text-sm text-paper",
							children: "Sign in"
						})
					] }), null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-3xl bg-paper p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl",
							children: "On this device"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-4 h-11 rounded-full border border-line px-4 font-sans text-sm",
							onClick: () => {
								cacheVolume().then((ok) => {
									setOffline(ok);
									setNotice(ok ? "Illustrations saved for offline reading." : "Offline save is not available here.");
								});
							},
							children: offline ? "Illustrations saved offline" : "Save illustrations offline"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-3 block h-11 rounded-full border border-line px-4 font-sans text-sm",
							onClick: () => setInstall(true),
							children: "Install LightNov"
						}),
						notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-sans text-sm text-muted",
							children: notice
						}) : null
					]
				})]
			}),
			install ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 flex items-end justify-center bg-ink/40 p-4",
				onClick: () => setInstall(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-3xl bg-paper p-6",
					onClick: (event) => event.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/__grok/icon-180.png",
							alt: "",
							className: "size-16 rounded-2xl"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-serif text-3xl",
							children: "Add LightNov"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-sans text-sm leading-relaxed text-muted",
							children: "On iPhone: Share, then Add to Home Screen. On Android: the browser menu, then Install app."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-5 h-12 rounded-full bg-ink px-5 font-sans text-sm text-paper",
							onClick: () => setInstall(false),
							children: "Close"
						})
					]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppNav, {})
		]
	});
}
//#endregion
export { Profile as component };
