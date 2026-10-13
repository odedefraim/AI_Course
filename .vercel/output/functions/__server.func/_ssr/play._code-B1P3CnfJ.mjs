import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, Y as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route } from "./router-B4b2-Zkq.mjs";
import { a as getAttempt, c as submitAttempt, n as Shell, r as checkAnswer, s as getRoom, t as Panel } from "./quiz.functions-ChtwjJi3.mjs";
import { r as TOPIC_LABEL } from "./quiz-bank-Cq3_XLcm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/play._code-B1P3CnfJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "kitat-bina-client";
function readKey() {
	const existing = localStorage.getItem(KEY);
	if (existing) return existing;
	const next = crypto.randomUUID();
	localStorage.setItem(KEY, next);
	return next;
}
function rotateKey() {
	const next = crypto.randomUUID();
	localStorage.setItem(KEY, next);
	return next;
}
function Play() {
	const { code } = Route.useParams();
	const [phase, setPhase] = (0, import_react.useState)({ kind: "loading" });
	const [clientKey, setClientKey] = (0, import_react.useState)("");
	const lockRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const key = readKey();
		setClientKey(key);
		let stop = false;
		(async () => {
			try {
				const room = await getRoom({ data: { code } });
				if (stop) return;
				if (!room.ok) {
					setPhase({ kind: "missing" });
					return;
				}
				const attempt = await getAttempt({ data: {
					code,
					clientKey: key
				} });
				if (stop) return;
				if (attempt.ok && attempt.found) {
					setPhase({
						kind: "done",
						score: attempt.score,
						total: attempt.total,
						review: attempt.review
					});
					return;
				}
				setPhase({
					kind: "quiz",
					questions: room.questions,
					index: 0,
					choices: {},
					locked: false,
					reveal: null
				});
			} catch (error) {
				if (!stop) setPhase({
					kind: "error",
					message: error instanceof Error ? error.message : "שגיאה בטעינה"
				});
			}
		})();
		return () => {
			stop = true;
		};
	}, [code]);
	async function choose(choice) {
		if (phase.kind !== "quiz" || phase.locked || lockRef.current) return;
		const question = phase.questions[phase.index];
		if (!question) return;
		lockRef.current = true;
		const snapshot = phase;
		setPhase({
			...snapshot,
			locked: true
		});
		try {
			const result = await checkAnswer({ data: {
				code,
				questionId: question.id,
				choice
			} });
			setPhase({
				kind: "quiz",
				questions: snapshot.questions,
				index: snapshot.index,
				choices: {
					...snapshot.choices,
					[question.id]: choice
				},
				locked: true,
				reveal: result
			});
		} catch (error) {
			lockRef.current = false;
			setPhase({
				kind: "error",
				message: error instanceof Error ? error.message : "לא הצלחנו לבדוק"
			});
		}
	}
	async function next() {
		if (phase.kind !== "quiz" || !phase.reveal) return;
		if (!(phase.index >= phase.questions.length - 1)) {
			lockRef.current = false;
			setPhase({
				kind: "quiz",
				questions: phase.questions,
				index: phase.index + 1,
				choices: phase.choices,
				locked: false,
				reveal: null
			});
			return;
		}
		const choices = phase.questions.map((question) => ({
			id: question.id,
			choice: phase.choices[question.id] ?? -1
		}));
		try {
			const saved = await submitAttempt({ data: {
				code,
				clientKey,
				choices
			} });
			setPhase({
				kind: "done",
				score: saved.score,
				total: saved.total,
				review: saved.review
			});
		} catch (error) {
			setPhase({
				kind: "error",
				message: error instanceof Error ? error.message : "ההגשה לא נשמרה"
			});
		}
	}
	function anotherStudent() {
		const key = rotateKey();
		setClientKey(key);
		setPhase({ kind: "loading" });
		(async () => {
			const room = await getRoom({ data: { code } });
			if (!room.ok) {
				setPhase({ kind: "missing" });
				return;
			}
			setPhase({
				kind: "quiz",
				questions: room.questions,
				index: 0,
				choices: {},
				locked: false,
				reveal: null
			});
		})();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		phase.kind === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: "טוענים את החידון..."
		}) : null,
		phase.kind === "missing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold",
				children: "הקוד לא נמצא"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted",
				children: "בדקו את חמשת התווים עם המורה."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-4 inline-flex min-h-12 items-center font-bold text-primary",
				children: "חזרה למסך הכניסה"
			})
		] }) : null,
		phase.kind === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold",
				children: "משהו השתבש"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-danger",
				children: phase.message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-4 min-h-12 font-bold",
				onClick: () => window.location.reload(),
				children: "נסו שוב"
			})
		] }) : null,
		phase.kind === "quiz" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuizView, {
			code,
			phase,
			onChoose: (choice) => void choose(choice),
			onNext: () => void next()
		}) : null,
		phase.kind === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoneView, {
			code,
			score: phase.score,
			total: phase.total,
			review: phase.review,
			onAnother: anotherStudent
		}) : null
	] });
}
function QuizView({ code, phase, onChoose, onNext }) {
	const question = phase.questions[phase.index];
	if (!question) return null;
	const progress = Math.round(phase.index / phase.questions.length * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-semibold tabular-nums",
					children: [
						"שאלה ",
						phase.index + 1,
						" מתוך ",
						phase.questions.length
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					dir: "ltr",
					className: "font-bold tracking-widest text-ink",
					children: code
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-5 h-2 overflow-hidden rounded-full bg-line",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-primary transition-all",
					style: { width: `${progress}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 text-sm font-semibold text-primary",
				children: TOPIC_LABEL[question.topic]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-balance text-2xl font-extrabold leading-snug",
				children: question.q
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-col gap-3",
				children: question.options.map((option, index) => {
					const picked = phase.choices[question.id] === index;
					const show = phase.reveal !== null;
					const isAnswer = show && phase.reveal?.answer === index;
					const isWrongPick = show && picked && !phase.reveal?.correct;
					let tone = "border-line bg-paper-2 hover:border-ink";
					if (isAnswer) tone = "border-signal bg-signal text-signal-ink";
					else if (isWrongPick) tone = "border-danger bg-danger text-danger-ink";
					else if (show) tone = "border-line bg-paper text-muted";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: phase.locked,
						onClick: () => onChoose(index),
						className: `min-h-14 rounded-2xl border px-4 text-right text-base font-semibold transition ${tone}`,
						children: option
					}, option);
				})
			}),
			phase.reveal ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-2xl border px-4 py-3 text-sm leading-relaxed " + (phase.reveal.correct ? "border-signal bg-signal-ink text-ink" : "border-danger bg-danger-ink text-ink"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold",
						children: phase.reveal.correct ? "נכון" : "לא מדויק"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: phase.reveal.explain
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onNext,
						className: "mt-3 min-h-12 rounded-2xl bg-ink px-5 font-bold text-paper",
						children: phase.index >= phase.questions.length - 1 ? "סיימו ושלחו ללוח הכיתה" : "השאלה הבאה"
					})
				]
			}) : null
		]
	});
}
function DoneView({ code, score, total, review, onAnother }) {
	const percent = total === 0 ? 0 : Math.round(score / total * 100);
	const weak = /* @__PURE__ */ new Map();
	for (const item of review) if (!item.correct) weak.set(item.topic, (weak.get(item.topic) ?? 0) + 1);
	const focus = [...weak.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm font-semibold text-muted",
				children: ["ההגשה נשמרה בכיתה ", code]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-5xl font-extrabold tabular-nums text-signal",
				children: [
					score,
					"/",
					total
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-lg",
				children: [percent, "% נכונות"]
			}),
			focus.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold",
					children: "כדאי לחזק"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 flex flex-wrap gap-2",
					children: focus.map(([topic]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-full bg-paper px-3 py-1 text-sm font-semibold",
						children: TOPIC_LABEL[topic]
					}, topic))
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-semibold text-signal",
				children: "עניתם נכון על הכל."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/board/$code",
					params: { code },
					className: "inline-flex min-h-12 items-center rounded-2xl bg-ink px-4 font-bold text-paper",
					children: "לוח הכיתה"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onAnother,
					className: "min-h-12 rounded-2xl border border-line px-4 font-bold",
					children: "תלמיד נוסף במכשיר הזה"
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-4 flex flex-col gap-3",
			children: review.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-card border border-line bg-paper-2 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold text-muted",
						children: [
							index + 1,
							". ",
							item.topicLabel
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-bold",
						children: item.q
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm font-semibold " + (item.correct ? "text-signal" : "text-danger"),
						children: item.correct ? "נכון" : "לא נכון"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-muted",
						children: item.explain
					})
				]
			}, item.id))
		})]
	});
}
//#endregion
export { Play as component };
