//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-BSpD5rM2.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/board/$code",
			"/play/$code"
		],
		preloads: [
			"/assets/index-CmSMpxgh.js",
			"/assets/rolldown-runtime-hePW80VL.js",
			"/assets/link-DFfOJZoy.js",
			"/assets/preload-helper-BrVLRAW_.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-CmSMpxgh.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-LUZWNgWF.js",
			"/assets/quiz.functions-a_HVL6Hk.js",
			"/assets/quiz-bank-Dq9SZ68-.js"
		]
	},
	"/board/$code": {
		filePath: "/workspace/src/routes/board.$code.tsx",
		children: void 0,
		preloads: ["/assets/board._code-CUr3OTss.js", "/assets/quiz.functions-a_HVL6Hk.js"]
	},
	"/play/$code": {
		filePath: "/workspace/src/routes/play.$code.tsx",
		children: void 0,
		preloads: [
			"/assets/play._code-DUGiSDwv.js",
			"/assets/quiz.functions-a_HVL6Hk.js",
			"/assets/quiz-bank-Dq9SZ68-.js"
		]
	}
} });
//#endregion
export { tsrStartManifest };
