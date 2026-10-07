import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/narrate-txehPjO9.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var VOICE = "eve";
var narrate_createServerFn_handler = createServerRpc({
	id: "340febb3d5d84b9fd95c842b0bf8cea39a73770228f18977f95ba2b6ca815a9f",
	name: "narrate",
	filename: "src/lib/narrate.ts"
}, (opts) => narrate.__executeServer(opts));
var narrate = createServerFn({ method: "POST" }).validator((input) => {
	const text = typeof input?.text === "string" ? input.text.replace(/\s+/g, " ").trim().slice(0, 1500) : "";
	if (!text) throw new Error("Nothing to read");
	return { text };
}).handler(narrate_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Voice is not available"
	};
	const res = await fetch("https://api.x.ai/v1/tts", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			text: data.text,
			voice_id: VOICE,
			language: "en"
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `Voice failed (${res.status})`
	};
	const bytes = new Uint8Array(await res.arrayBuffer());
	let binary = "";
	for (let index = 0; index < bytes.length; index += 32768) binary += String.fromCharCode(...bytes.subarray(index, index + 32768));
	return {
		ok: true,
		audio: btoa(binary)
	};
});
//#endregion
export { narrate_createServerFn_handler };
