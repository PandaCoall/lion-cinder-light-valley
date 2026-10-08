import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, S as useRouter, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Route$7 } from "./router-DhyAnJ2q.mjs";
import { n as signInWithGoogle, t as authClient } from "./client-CRsMPsJW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-D_WE-e38.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const { next } = Route$7.useSearch();
	const router = useRouter();
	const back = next && next.startsWith("/") ? next : "/profile";
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const finish = () => {
		router.navigate({ to: back });
	};
	const submitEmail = async () => {
		setError("");
		setBusy(true);
		try {
			const result = mode === "up" ? await authClient.signUp.email({
				email: email.trim(),
				password,
				name: email.trim().split("@")[0] || "Reader",
				callbackURL: back
			}) : await authClient.signIn.email({
				email: email.trim(),
				password,
				callbackURL: back
			});
			if (result.error) {
				setError(result.error.message ?? "That email could not be used.");
				return;
			}
			finish();
		} catch (caught) {
			setError(caught instanceof Error ? caught.message : "That email could not be used.");
		} finally {
			setBusy(false);
		}
	};
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
					children: mode === "up" ? "Create account" : "Sign in"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-sans text-sm text-muted",
					children: "Use Google, or your own email. Guests can open three books. An account keeps the rest."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-6 h-12 w-full rounded-full bg-[#FFE62D] font-sans text-sm text-[#1a100c]",
						onClick: () => {
							setError("");
							signInWithGoogle(back).catch((caught) => {
								setError(caught instanceof Error ? caught.message : "Google sign-in failed");
							});
						},
						children: "Continue with Google"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-center font-sans text-xs text-muted",
						children: "or your email"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 flex flex-col gap-2",
						onSubmit: (event) => {
							event.preventDefault();
							submitEmail();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "email",
								required: true,
								autoComplete: "email",
								value: email,
								onChange: (event) => setEmail(event.target.value),
								placeholder: "Email",
								"aria-label": "Email",
								className: "h-12 rounded-full border border-line bg-paper px-4 font-sans text-sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "password",
								required: true,
								minLength: 8,
								autoComplete: mode === "up" ? "new-password" : "current-password",
								value: password,
								onChange: (event) => setPassword(event.target.value),
								placeholder: "Password, at least 8 characters",
								"aria-label": "Password",
								className: "h-12 rounded-full border border-line bg-paper px-4 font-sans text-sm"
							}),
							error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-2 font-sans text-sm text-[#FD4499]",
								children: error
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "h-12 rounded-full bg-[#12B8FF] font-sans text-sm text-[#1a100c] disabled:opacity-60",
								children: busy ? "Please wait" : mode === "up" ? "Create account" : "Sign in with email"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "mt-4 font-sans text-sm text-muted",
						onClick: () => {
							setMode(mode === "up" ? "in" : "up");
							setError("");
						},
						children: mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"
					})
				] }),
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
