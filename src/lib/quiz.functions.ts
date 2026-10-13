import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  LEVEL_META,
  TOPIC_LABEL,
  buildRoomQuestions,
  isLevel,
  type Level,
  type StoredQuestion,
  type TopicId,
} from "@/lib/quiz-bank";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

type RoomPayload = { questions: StoredQuestion[] };

type AnswerRow = { id: string; choice: number; correct: boolean };

export type PublicQuestion = {
  id: string;
  q: string;
  options: string[];
  topic: TopicId;
};

export type ReviewItem = {
  id: string;
  q: string;
  choice: number;
  answer: number;
  correct: boolean;
  explain: string;
  topic: TopicId;
  topicLabel: string;
};

const levelSchema = z.enum(["easy", "medium", "hard", "mixed"]);
const codeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9]{5}$/);
const clientKeySchema = z.string().uuid();

function parsePayload(value: unknown): RoomPayload {
  const raw = typeof value === "string" ? (JSON.parse(value) as unknown) : value;
  if (!raw || typeof raw !== "object" || !("questions" in raw)) {
    throw new Error("הכיתה לא תקינה");
  }
  return raw as RoomPayload;
}

function parseAnswers(value: unknown): AnswerRow[] {
  const raw = typeof value === "string" ? (JSON.parse(value) as unknown) : value;
  if (!Array.isArray(raw)) return [];
  return raw as AnswerRow[];
}

function isUniqueViolation(error: unknown): boolean {
  if (typeof error === "object" && error && "code" in error && error.code === "23505") return true;
  const message = error instanceof Error ? error.message : String(error);
  return /unique|duplicate/i.test(message);
}

async function db() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

function makeCode(): string {
  let code = "";
  for (let i = 0; i < 5; i += 1) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

function toPublic(questions: StoredQuestion[]): PublicQuestion[] {
  return questions.map((question) => ({
    id: question.id,
    q: question.q,
    options: question.options,
    topic: question.topic,
  }));
}

function grade(questions: StoredQuestion[], choices: { id: string; choice: number }[]): AnswerRow[] {
  const byId = new Map(choices.map((choice) => [choice.id, choice.choice]));
  return questions.map((question) => {
    const choice = byId.get(question.id);
    const picked = typeof choice === "number" ? choice : -1;
    return {
      id: question.id,
      choice: picked,
      correct: picked === question.answer,
    };
  });
}

function reviewOf(questions: StoredQuestion[], answers: AnswerRow[]): ReviewItem[] {
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
      topicLabel: TOPIC_LABEL[question.topic],
    };
  });
}

async function loadRoom(code: string) {
  const sql = await db();
  const rows = await sql<{ code: string; level: string; payload: unknown }>`
    select code, level, payload from rooms where code = ${code}
  `;
  const row = rows[0];
  if (!row || !isLevel(row.level)) return null;
  return { code: row.code, level: row.level, payload: parsePayload(row.payload) };
}

export const createRoom = createServerFn({ method: "POST" })
  .validator(z.object({ level: levelSchema }))
  .handler(async ({ data }) => {
    const level = data.level as Level;
    const questions = buildRoomQuestions(level);
    const payload: RoomPayload = { questions };
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
          count: questions.length,
        };
      } catch (error) {
        if (!isUniqueViolation(error)) throw error;
      }
    }
    throw new Error("לא הצלחנו לפתוח כיתה. נסו שוב.");
  });

export const getRoom = createServerFn({ method: "POST" })
  .validator(z.object({ code: codeSchema }))
  .handler(async ({ data }) => {
    const room = await loadRoom(data.code);
    if (!room) return { ok: false as const };
    return {
      ok: true as const,
      code: room.code,
      level: room.level,
      levelLabel: LEVEL_META[room.level].label,
      questions: toPublic(room.payload.questions),
    };
  });

export const checkAnswer = createServerFn({ method: "POST" })
  .validator(
    z.object({
      code: codeSchema,
      questionId: z.string().min(1).max(12),
      choice: z.number().int().min(0).max(3),
    }),
  )
  .handler(async ({ data }) => {
    const room = await loadRoom(data.code);
    if (!room) throw new Error("הכיתה לא נמצאה");
    const question = room.payload.questions.find((item) => item.id === data.questionId);
    if (!question) throw new Error("השאלה לא שייכת לכיתה הזו");
    return {
      correct: data.choice === question.answer,
      answer: question.answer,
      explain: question.explain,
    };
  });

export const getAttempt = createServerFn({ method: "POST" })
  .validator(z.object({ code: codeSchema, clientKey: clientKeySchema }))
  .handler(async ({ data }) => {
    const room = await loadRoom(data.code);
    if (!room) return { ok: false as const, found: false as const };
    const sql = await db();
    const rows = await sql<{ score: number; total: number; answers: unknown }>`
      select score, total, answers from attempts
      where room_code = ${data.code} and client_key = ${data.clientKey}
    `;
    const row = rows[0];
    if (!row) return { ok: true as const, found: false as const };
    return {
      ok: true as const,
      found: true as const,
      score: Number(row.score),
      total: Number(row.total),
      review: reviewOf(room.payload.questions, parseAnswers(row.answers)),
    };
  });

export const submitAttempt = createServerFn({ method: "POST" })
  .validator(
    z.object({
      code: codeSchema,
      clientKey: clientKeySchema,
      choices: z.array(z.object({ id: z.string(), choice: z.number().int() })).max(20),
    }),
  )
  .handler(async ({ data }) => {
    const room = await loadRoom(data.code);
    if (!room) throw new Error("הכיתה לא נמצאה");
    const questions = room.payload.questions;
    const expected = new Set(questions.map((question) => question.id));
    if (data.choices.length !== questions.length || data.choices.some((choice) => !expected.has(choice.id))) {
      throw new Error("התשובות לא תואמות את החידון של הכיתה");
    }
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
    const saved = await sql<{ score: number; total: number; answers: unknown }>`
      select score, total, answers from attempts
      where room_code = ${data.code} and client_key = ${data.clientKey}
    `;
    const row = saved[0];
    if (!row) throw new Error("ההגשה לא נשמרה");
    return {
      score: Number(row.score),
      total: Number(row.total),
      review: reviewOf(room.payload.questions, parseAnswers(row.answers)),
    };
  });

export const getBoard = createServerFn({ method: "POST" })
  .validator(z.object({ code: codeSchema }))
  .handler(async ({ data }) => {
    const room = await loadRoom(data.code);
    if (!room) return { ok: false as const };
    const sql = await db();
    const rows = await sql<{ score: number; total: number; answers: unknown }>`
      select score, total, answers from attempts
      where room_code = ${data.code}
      order by created_at asc
      limit 500
    `;
    const questions = room.payload.questions;
    const stats = new Map(questions.map((question) => [question.id, { correct: 0, wrong: 0 }]));
    const scores: number[] = [];
    for (const row of rows) {
      const total = Number(row.total) || questions.length;
      const score = Number(row.score);
      scores.push(total === 0 ? 0 : Math.round((score / total) * 100));
      for (const answer of parseAnswers(row.answers)) {
        const stat = stats.get(answer.id);
        if (!stat) continue;
        if (answer.correct) stat.correct += 1;
        else stat.wrong += 1;
      }
    }
    const questionStats = questions.map((question) => {
      const stat = stats.get(question.id) ?? { correct: 0, wrong: 0 };
      const n = stat.correct + stat.wrong;
      const wrongRate = n === 0 ? 0 : stat.wrong / n;
      return {
        id: question.id,
        q: question.q,
        topic: question.topic,
        topicLabel: TOPIC_LABEL[question.topic],
        correct: stat.correct,
        wrong: stat.wrong,
        wrongRate,
      };
    });
    const topicMap = new Map<TopicId, { correct: number; wrong: number }>();
    for (const question of questionStats) {
      const current = topicMap.get(question.topic) ?? { correct: 0, wrong: 0 };
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
        strengthen: n > 0 && wrongRate >= 0.35,
      };
    });
    topics.sort((a, b) => b.wrongRate - a.wrongRate);
    const submissions = rows.length;
    const average =
      submissions === 0 ? 0 : Math.round(scores.reduce((sum, value) => sum + value, 0) / submissions);
    const bands = {
      high: scores.filter((score) => score >= 90).length,
      good: scores.filter((score) => score >= 70 && score < 90).length,
      mid: scores.filter((score) => score >= 50 && score < 70).length,
      low: scores.filter((score) => score < 50).length,
    };
    return {
      ok: true as const,
      code: room.code,
      level: room.level,
      levelLabel: LEVEL_META[room.level].label,
      questionCount: questions.length,
      submissions,
      average,
      bands,
      questions: [...questionStats].sort((a, b) => b.wrongRate - a.wrongRate),
      topics,
    };
  });
