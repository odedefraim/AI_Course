import { a as object, i as number, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as isLevel, i as buildRoomQuestions, n as LEVEL_META, r as TOPIC_LABEL } from "./quiz-bank-Cq3_XLcm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quiz.functions-C52hEfa3.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
var levelSchema = _enum([
	"easy",
	"medium",
	"hard",
	"mixed"
]);
var codeSchema = string().trim().toUpperCase().regex(/^[A-Z0-9]{5}$/);
var clientKeySchema = string().uuid();
function parsePayload(value) {
	const raw = typeof value === "string" ? JSON.parse(value) : value;
	if (!raw || typeof raw !== "object" || !("questions" in raw)) throw new Error("הכיתה לא תקינה");
	return raw;
}
function parseAnswers(value) {
	const raw = typeof value === "string" ? JSON.parse(value) : value;
	if (!Array.isArray(raw)) return [];
	return raw;
}
function isUniqueViolation(error) {
	if (typeof error === "object" && error && "code" in error && error.code === "23505") return true;
	const message = error instanceof Error ? error.message : String(error);
	return /unique|duplicate/i.test(message);
}
async function db() {
	const { getSql } = await import("./db-DxlV_ndc.mjs");
	return getSql();
}
function makeCode() {
	let code = "";
	for (let i = 0; i < 5; i += 1) code += CODE_ALPHABET[Math.floor(Math.random() * 32)];
	return code;
}
function toPublic(questions) {
	return questions.map((question) => ({
		id: question.id,
		q: question.q,
		options: question.options,
		topic: question.topic
	}));
}
function grade(questions, choices) {
	const byId = new Map(choices.map((choice) => [choice.id, choice.choice]));
	return questions.map((question) => {
		const choice = byId.get(question.id);
		const picked = typeof choice === "number" ? choice : -1;
		return {
			id: question.id,
			choice: picked,
			correct: picked === question.answer
		};
	});
}
function reviewOf(questions, answers) {
	const byId = new Map(answers.map((answer) => [answer.id, answer]));
	return questions.map((question) => {
		const answer = byId.get(question.id);
		return {
			id: question.id,
			q: question.q,
			choice: answer?.choice ?? -1,
			answer: question.answer,
			correct: answer?.correct ?? false,
			explain: question.explain,
			topic: question.topic,
			topicLabel: TOPIC_LABEL[question.topic]
		};
	});
}
async function loadRoom(code) {
	const row = (await (await db())`
    select code, level, payload from rooms where code = ${code}
  `)[0];
	if (!row || !isLevel(row.level)) return null;
	return {
		code: row.code,
		level: row.level,
		payload: parsePayload(row.payload)
	};
}
var createRoom_createServerFn_handler = createServerRpc({
	id: "6b85c16a28669f611ac8d990929d4d6192caafb7017989995a7dcbf96c7067c3",
	name: "createRoom",
	filename: "src/lib/quiz.functions.ts"
}, (opts) => createRoom.__executeServer(opts));
var createRoom = createServerFn({ method: "POST" }).validator(object({ level: levelSchema })).handler(createRoom_createServerFn_handler, async ({ data }) => {
	const level = data.level;
	const questions = buildRoomQuestions(level);
	const payload = { questions };
	const sql = await db();
	for (let attempt = 0; attempt < 6; attempt += 1) {
		const code = makeCode();
		try {
			await sql`
          insert into rooms (code, level, payload)
          values (${code}, ${level}, ${JSON.stringify(payload)}::jsonb)
        `;
			return {
				code,
				level,
				levelLabel: LEVEL_META[level].label,
				count: questions.length
			};
		} catch (error) {
			if (!isUniqueViolation(error)) throw error;
		}
	}
	throw new Error("לא הצלחנו לפתוח כיתה. נסו שוב.");
});
var getRoom_createServerFn_handler = createServerRpc({
	id: "9aada0a818d3df3ca1b7d8b5415685dc4177014a98ab76e7226732482c7442f2",
	name: "getRoom",
	filename: "src/lib/quiz.functions.ts"
}, (opts) => getRoom.__executeServer(opts));
var getRoom = createServerFn({ method: "POST" }).validator(object({ code: codeSchema })).handler(getRoom_createServerFn_handler, async ({ data }) => {
	const room = await loadRoom(data.code);
	if (!room) return { ok: false };
	return {
		ok: true,
		code: room.code,
		level: room.level,
		levelLabel: LEVEL_META[room.level].label,
		questions: toPublic(room.payload.questions)
	};
});
var checkAnswer_createServerFn_handler = createServerRpc({
	id: "73734a97b46527b5626b272b6a67714f5a0824ed2f223413dbf6c0564d4435ec",
	name: "checkAnswer",
	filename: "src/lib/quiz.functions.ts"
}, (opts) => checkAnswer.__executeServer(opts));
var checkAnswer = createServerFn({ method: "POST" }).validator(object({
	code: codeSchema,
	questionId: string().min(1).max(12),
	choice: number().int().min(0).max(3)
})).handler(checkAnswer_createServerFn_handler, async ({ data }) => {
	const room = await loadRoom(data.code);
	if (!room) throw new Error("הכיתה לא נמצאה");
	const question = room.payload.questions.find((item) => item.id === data.questionId);
	if (!question) throw new Error("השאלה לא שייכת לכיתה הזו");
	return {
		correct: data.choice === question.answer,
		answer: question.answer,
		explain: question.explain
	};
});
var getAttempt_createServerFn_handler = createServerRpc({
	id: "63a780fbe60bf42051a5217e46af21b0504ed15220bb9317212150a948e97588",
	name: "getAttempt",
	filename: "src/lib/quiz.functions.ts"
}, (opts) => getAttempt.__executeServer(opts));
var getAttempt = createServerFn({ method: "POST" }).validator(object({
	code: codeSchema,
	clientKey: clientKeySchema
})).handler(getAttempt_createServerFn_handler, async ({ data }) => {
	const room = await loadRoom(data.code);
	if (!room) return {
		ok: false,
		found: false
	};
	const row = (await (await db())`
      select score, total, answers from attempts
      where room_code = ${data.code} and client_key = ${data.clientKey}
    `)[0];
	if (!row) return {
		ok: true,
		found: false
	};
	return {
		ok: true,
		found: true,
		score: Number(row.score),
		total: Number(row.total),
		review: reviewOf(room.payload.questions, parseAnswers(row.answers))
	};
});
var submitAttempt_createServerFn_handler = createServerRpc({
	id: "b48224803e5c322f45585a62434e848b93c04d30da71a43be71aeff566a8fd0a",
	name: "submitAttempt",
	filename: "src/lib/quiz.functions.ts"
}, (opts) => submitAttempt.__executeServer(opts));
var submitAttempt = createServerFn({ method: "POST" }).validator(object({
	code: codeSchema,
	clientKey: clientKeySchema,
	choices: array(object({
		id: string(),
		choice: number().int()
	})).max(20)
})).handler(submitAttempt_createServerFn_handler, async ({ data }) => {
	const room = await loadRoom(data.code);
	if (!room) throw new Error("הכיתה לא נמצאה");
	const questions = room.payload.questions;
	const expected = new Set(questions.map((question) => question.id));
	if (data.choices.length !== questions.length || data.choices.some((choice) => !expected.has(choice.id))) throw new Error("התשובות לא תואמות את החידון של הכיתה");
	const answers = grade(questions, data.choices);
	const score = answers.filter((answer) => answer.correct).length;
	const total = questions.length;
	const sql = await db();
	const id = crypto.randomUUID();
	try {
		await sql`
        insert into attempts (id, room_code, client_key, score, total, answers)
        values (
          ${id},
          ${data.code},
          ${data.clientKey},
          ${score},
          ${total},
          ${JSON.stringify(answers)}::jsonb
        )
      `;
	} catch (error) {
		if (!isUniqueViolation(error)) throw error;
	}
	const row = (await sql`
      select score, total, answers from attempts
      where room_code = ${data.code} and client_key = ${data.clientKey}
    `)[0];
	if (!row) throw new Error("ההגשה לא נשמרה");
	return {
		score: Number(row.score),
		total: Number(row.total),
		review: reviewOf(room.payload.questions, parseAnswers(row.answers))
	};
});
var getBoard_createServerFn_handler = createServerRpc({
	id: "e7b2bd36084fc3b34fb72e04c5cdc29df6a715b4108947f5c602e7c9d9f3b2c7",
	name: "getBoard",
	filename: "src/lib/quiz.functions.ts"
}, (opts) => getBoard.__executeServer(opts));
var getBoard = createServerFn({ method: "POST" }).validator(object({ code: codeSchema })).handler(getBoard_createServerFn_handler, async ({ data }) => {
	const room = await loadRoom(data.code);
	if (!room) return { ok: false };
	const rows = await (await db())`
      select score, total, answers from attempts
      where room_code = ${data.code}
      order by created_at asc
      limit 500
    `;
	const questions = room.payload.questions;
	const stats = new Map(questions.map((question) => [question.id, {
		correct: 0,
		wrong: 0
	}]));
	const scores = [];
	for (const row of rows) {
		const total = Number(row.total) || questions.length;
		const score = Number(row.score);
		scores.push(total === 0 ? 0 : Math.round(score / total * 100));
		for (const answer of parseAnswers(row.answers)) {
			const stat = stats.get(answer.id);
			if (!stat) continue;
			if (answer.correct) stat.correct += 1;
			else stat.wrong += 1;
		}
	}
	const questionStats = questions.map((question) => {
		const stat = stats.get(question.id) ?? {
			correct: 0,
			wrong: 0
		};
		const n = stat.correct + stat.wrong;
		const wrongRate = n === 0 ? 0 : stat.wrong / n;
		return {
			id: question.id,
			q: question.q,
			topic: question.topic,
			topicLabel: TOPIC_LABEL[question.topic],
			correct: stat.correct,
			wrong: stat.wrong,
			wrongRate
		};
	});
	const topicMap = /* @__PURE__ */ new Map();
	for (const question of questionStats) {
		const current = topicMap.get(question.topic) ?? {
			correct: 0,
			wrong: 0
		};
		current.correct += question.correct;
		current.wrong += question.wrong;
		topicMap.set(question.topic, current);
	}
	const topics = [...topicMap.entries()].map(([topic, stat]) => {
		const n = stat.correct + stat.wrong;
		const wrongRate = n === 0 ? 0 : stat.wrong / n;
		return {
			topic,
			label: TOPIC_LABEL[topic],
			correct: stat.correct,
			wrong: stat.wrong,
			wrongRate,
			strengthen: n > 0 && wrongRate >= .35
		};
	});
	topics.sort((a, b) => b.wrongRate - a.wrongRate);
	const submissions = rows.length;
	const average = submissions === 0 ? 0 : Math.round(scores.reduce((sum, value) => sum + value, 0) / submissions);
	const bands = {
		high: scores.filter((score) => score >= 90).length,
		good: scores.filter((score) => score >= 70 && score < 90).length,
		mid: scores.filter((score) => score >= 50 && score < 70).length,
		low: scores.filter((score) => score < 50).length
	};
	return {
		ok: true,
		code: room.code,
		level: room.level,
		levelLabel: LEVEL_META[room.level].label,
		questionCount: questions.length,
		submissions,
		average,
		bands,
		questions: [...questionStats].sort((a, b) => b.wrongRate - a.wrongRate),
		topics
	};
});
//#endregion
export { checkAnswer_createServerFn_handler, createRoom_createServerFn_handler, getAttempt_createServerFn_handler, getBoard_createServerFn_handler, getRoom_createServerFn_handler, submitAttempt_createServerFn_handler };
