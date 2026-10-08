import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as GROK_PROVIDERS, u as Route$7 } from "./router-BssuV81m.mjs";
import { n as signIn } from "./client-DNRKl5_r.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-5eG32vLH.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { next } = Route$7.useSearch();
	const back = next && next.startsWith("/") ? next : "/profile";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "folio grid min-h-dvh place-items-center bg-desk px-6 text-ink",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					style: { textTransform: "none" },
					children: "LightNov"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-serif text-4xl",
					children: "Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-sans text-sm text-muted",
					children: "Guests can open three books. An account keeps the rest."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => signIn(provider.providerId, { callbackURL: back }),
						className: "h-12 rounded-full border border-line bg-paper font-sans text-sm",
						children: ["Continue with ", provider.label]
					}, provider.providerId))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex h-11 items-center font-sans text-sm text-muted",
					children: "Back home"
				})
			]
		})
	});
}
//#endregion
export { Login as component };
