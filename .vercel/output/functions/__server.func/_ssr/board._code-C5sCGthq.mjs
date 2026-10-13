import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Copy, r as RefreshCw } from "../_libs/lucide-react.mjs";
import { r as Route$1 } from "./router-B4b2-Zkq.mjs";
import { n as Shell, o as getBoard, t as Panel } from "./quiz.functions-ChtwjJi3.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board._code-C5sCGthq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Board() {
	const { code } = Route$1.useParams();
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		let stop = false;
		async function load() {
			try {
				const next = await getBoard({ data: { code } });
				if (!stop) {
					setData(next);
					setError("");
				}
			} catch (err) {
				if (!stop) setError(err instanceof Error ? err.message : "לא הצלחנו לטעון את הלוח");
			}
		}
		load();
		const timer = window.setInterval(() => void load(), 4e3);
		return () => {
			stop = true;
			window.clearInterval(timer);
		};
	}, [code]);
	async function copyCode() {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			setCopied(false);
		}
	}
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-danger",
		children: error
	}) }) });
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "טוענים את לוח הכיתה..."
	}) });
	if (!data.ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "text-2xl font-extrabold",
		children: "הכיתה לא נמצאה"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/",
		className: "mt-3 inline-flex min-h-12 items-center font-bold text-primary",
		children: "פתחו כיתה חדשה"
	})] }) });
	const strengthen = data.topics.filter((topic) => topic.strengthen);
	const chart = data.topics.map((topic) => ({
		label: topic.label,
		נכון: topic.correct,
		לא: topic.wrong
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm font-semibold text-primary",
				children: ["לוח מורה · רמה ", data.levelLabel]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-balance text-3xl font-extrabold",
				children: "מה הכיתה כבר יודעת"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					dir: "ltr",
					className: "rounded-2xl bg-ink px-3 py-3 text-2xl font-extrabold tracking-widest text-paper sm:px-4 sm:text-3xl",
					children: data.code
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => void copyCode(),
					className: "inline-flex min-h-12 items-center gap-2 rounded-2xl border border-line bg-paper-2 px-3 font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
						className: "size-4",
						"aria-hidden": "true"
					}), copied ? "הועתק" : "העתיקו"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mb-5 max-w-2xl text-sm leading-relaxed text-muted",
			children: ["שתפו את הקוד. התלמידים נכנסים ממסך הבית. הלוח מתרענן לבד, בלי שמות.", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/play/$code",
				params: { code: data.code },
				className: "ms-2 font-bold text-ink underline",
				children: "קישור לחידון"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "הגשות",
					value: String(data.submissions)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "ממוצע",
					value: `${data.average}%`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "שאלות",
					value: String(data.questionCount)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-3 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Band, {
					label: "90% ומעלה",
					value: data.bands.high
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Band, {
					label: "70–89%",
					value: data.bands.good
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Band, {
					label: "50–69%",
					value: data.bands.mid
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Band, {
					label: "מתחת ל-50%",
					value: data.bands.low
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-extrabold",
					children: "מה צריך לחזק"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
						className: "size-3",
						"aria-hidden": "true"
					}), "מתעדכן לבד"]
				})]
			}), data.submissions === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: "עדיין אין הגשות. ברגע שתלמיד מסיים, הנושאים החלשים יופיעו כאן."
			}) : strengthen.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold text-signal",
				children: "אין נושא עם יותר מ-35% טעויות. אפשר להעלות רמה."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-3",
				children: strengthen.map((topic) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl border border-line bg-paper px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold",
								children: topic.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm tabular-nums text-danger",
								children: [Math.round(topic.wrongRate * 100), "% טעויות"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								topic.correct,
								" נכון · ",
								topic.wrong,
								" לא נכון"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
							correct: topic.correct,
							wrong: topic.wrong
						})
					]
				}, topic.topic))
			})]
		}),
		chart.length > 0 && data.submissions > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-xl font-extrabold",
				children: "נכון מול לא נכון לפי נושא"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				dir: "ltr",
				className: "h-80 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: chart,
						layout: "vertical",
						margin: {
							top: 4,
							right: 12,
							left: 8,
							bottom: 4
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								type: "number",
								allowDecimals: false,
								stroke: "var(--color-muted)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								type: "category",
								dataKey: "label",
								width: 110,
								stroke: "var(--color-ink)",
								tick: { fontSize: 12 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "נכון",
								stackId: "a",
								fill: "var(--color-signal)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "לא",
								stackId: "a",
								fill: "var(--color-danger)",
								radius: [
									0,
									6,
									6,
									0
								]
							})
						]
					})
				})
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-xl font-extrabold",
				children: "שאלות, מהחלשה לחזקה"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "flex flex-col gap-3",
				children: data.questions.map((question, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "border-b border-line pb-3 last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [index + 1, ". "]
								}), question.q]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "shrink-0 text-sm tabular-nums text-muted",
								children: [
									question.correct,
									" נכון · ",
									question.wrong,
									" לא"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs font-semibold text-primary",
							children: question.topicLabel
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
							correct: question.correct,
							wrong: question.wrong
						})
					]
				}, question.id))
			})]
		})
	] });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-3xl font-extrabold tabular-nums",
			children: value
		})]
	});
}
function Band({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-line bg-paper-2 px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-2xl font-extrabold tabular-nums",
			children: value
		})]
	});
}
function Meter({ correct, wrong }) {
	const total = correct + wrong;
	const width = total === 0 ? 0 : Math.round(correct / total * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 h-2 overflow-hidden rounded-full bg-line",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full bg-signal",
			style: { width: `${width}%` }
		})
	});
}
//#endregion
export { Board as component };
