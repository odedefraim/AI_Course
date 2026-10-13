import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz.functions-ChtwjJi3.js
var import_jsx_runtime = require_jsx_runtime();
function Shell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-line bg-paper-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-5xl items-center justify-between px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-lg font-extrabold tracking-tight",
					children: "כיתת בינה"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "חידון כיתתי · ח׳–ט׳"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "mx-auto max-w-5xl px-4 py-8",
			children
		})]
	});
}
function Panel({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: `min-w-0 max-w-full rounded-card border border-line bg-paper-2 p-5 shadow-sm ${className}`,
		children
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var levelSchema = _enum([
	"easy",
	"medium",
	"hard",
	"mixed"
]);
var codeSchema = string().trim().toUpperCase().regex(/^[A-Z0-9]{5}$/);
var clientKeySchema = string().uuid();
var createRoom = createServerFn({ method: "POST" }).validator(object({ level: levelSchema })).handler(createSsrRpc("6b85c16a28669f611ac8d990929d4d6192caafb7017989995a7dcbf96c7067c3"));
var getRoom = createServerFn({ method: "POST" }).validator(object({ code: codeSchema })).handler(createSsrRpc("9aada0a818d3df3ca1b7d8b5415685dc4177014a98ab76e7226732482c7442f2"));
var checkAnswer = createServerFn({ method: "POST" }).validator(object({
	code: codeSchema,
	questionId: string().min(1).max(12),
	choice: number().int().min(0).max(3)
})).handler(createSsrRpc("73734a97b46527b5626b272b6a67714f5a0824ed2f223413dbf6c0564d4435ec"));
var getAttempt = createServerFn({ method: "POST" }).validator(object({
	code: codeSchema,
	clientKey: clientKeySchema
})).handler(createSsrRpc("63a780fbe60bf42051a5217e46af21b0504ed15220bb9317212150a948e97588"));
var submitAttempt = createServerFn({ method: "POST" }).validator(object({
	code: codeSchema,
	clientKey: clientKeySchema,
	choices: array(object({
		id: string(),
		choice: number().int()
	})).max(20)
})).handler(createSsrRpc("b48224803e5c322f45585a62434e848b93c04d30da71a43be71aeff566a8fd0a"));
var getBoard = createServerFn({ method: "POST" }).validator(object({ code: codeSchema })).handler(createSsrRpc("e7b2bd36084fc3b34fb72e04c5cdc29df6a715b4108947f5c602e7c9d9f3b2c7"));
//#endregion
export { getAttempt as a, submitAttempt as c, createRoom as i, Shell as n, getBoard as o, checkAnswer as r, getRoom as s, Panel as t };
