import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as GraduationCap, o as ChartColumn, t as Users } from "../_libs/lucide-react.mjs";
import { i as createRoom, n as Shell, t as Panel } from "./quiz.functions-ChtwjJi3.mjs";
import { n as LEVEL_META, t as LEVELS } from "./quiz-bank-Cq3_XLcm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B3XzDUQf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const navigate = useNavigate();
	const [level, setLevel] = (0, import_react.useState)("easy");
	const [code, setCode] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	async function openClass() {
		setBusy(true);
		setError("");
		try {
			const room = await createRoom({ data: { level } });
			await navigate({
				to: "/board/$code",
				params: { code: room.code }
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "לא הצלחנו לפתוח כיתה");
		} finally {
			setBusy(false);
		}
	}
	function join(event) {
		event.preventDefault();
		const next = code.trim().toUpperCase();
		if (!/^[A-Z0-9]{5}$/.test(next)) {
			setError("הקוד הוא 5 תווים, בלי האותיות O ו-I");
			return;
		}
		setError("");
		navigate({
			to: "/play/$code",
			params: { code: next }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8 max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm font-semibold text-primary",
					children: "לכיתות ח׳–ט׳"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-balance text-4xl font-extrabold leading-tight",
					children: "חידון אחד. כל הכיתה. תמונה ברורה של מה לחזק."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-pretty text-lg leading-relaxed text-muted",
					children: "המורה פותח כיתה ומשתף קוד. כל התלמידים עונים על אותו סט שאלות. הלוח מתעדכן לבד: כמה ענו נכון, כמה לא, ואילו נושאים צריך ללמד שוב."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-w-0 gap-4 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-ink",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, {
							className: "size-5",
							"aria-hidden": "true"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xl font-bold",
						children: "פתיחת כיתה"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "בחרו רמה וקבלו קוד לשיתוף"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-2",
					children: LEVELS.map((item) => {
						const meta = LEVEL_META[item];
						const selected = level === item;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setLevel(item),
							className: "min-h-16 rounded-2xl border px-3 py-3 text-right transition " + (selected ? "border-primary bg-primary text-primary-ink" : "border-line bg-paper hover:border-ink"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-bold",
								children: meta.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1 block text-xs " + (selected ? "text-primary-ink" : "text-muted"),
								children: [meta.count, " שאלות"]
							})]
						}, item);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: LEVEL_META[level].blurb
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: busy,
					onClick: () => void openClass(),
					className: "mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 font-bold text-paper disabled:opacity-60",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, {
						className: "size-4",
						"aria-hidden": "true"
					}), busy ? "פותחים..." : "פתחו כיתה ועברו ללוח"]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-11 items-center justify-center rounded-2xl bg-signal text-signal-ink",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
						className: "size-5",
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-bold",
					children: "כניסת תלמיד"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "הקלידו את הקוד שקיבלתם מהמורה"
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: join,
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "text-sm font-semibold",
						htmlFor: "room-code",
						children: "קוד כיתה"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "room-code",
						dir: "ltr",
						inputMode: "text",
						autoCapitalize: "characters",
						autoComplete: "off",
						maxLength: 5,
						value: code,
						onChange: (event) => setCode(event.target.value.toUpperCase()),
						placeholder: "ABCDE",
						className: "min-h-14 w-full min-w-0 rounded-2xl border border-line bg-paper px-4 text-center text-xl font-extrabold tracking-widest text-ink outline-none focus:border-ink"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "min-h-12 rounded-2xl bg-signal px-4 font-bold text-signal-ink",
						children: "היכנסו לחידון"
					})
				]
			})] })]
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 rounded-2xl border border-danger bg-danger-ink px-4 py-3 text-sm text-danger",
			role: "alert",
			children: error
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 max-w-2xl text-sm leading-relaxed text-muted",
			children: "לא נשמרים שמות. כל מכשיר נספר פעם אחת, והלוח מציג רק כמויות: נכון, לא נכון, ונושאים שכדאי לחזק. במכשיר משותף אפשר להתחיל תלמיד נוסף אחרי הסיום."
		})
	] });
}
//#endregion
export { Home as component };
