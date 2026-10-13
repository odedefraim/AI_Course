import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Shell, Panel } from "@/components/shell";
import { TOPIC_LABEL, type TopicId } from "@/lib/quiz-bank";
import { checkAnswer, getAttempt, getRoom, submitAttempt, type PublicQuestion, type ReviewItem } from "@/lib/quiz.functions";

export const Route = createFileRoute("/play/$code")({ component: Play });

const KEY = "kitat-bina-client";

function readKey(): string {
  const existing = localStorage.getItem(KEY);
  if (existing) return existing;
  const next = crypto.randomUUID();
  localStorage.setItem(KEY, next);
  return next;
}

function rotateKey(): string {
  const next = crypto.randomUUID();
  localStorage.setItem(KEY, next);
  return next;
}

type Phase =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "quiz"; questions: PublicQuestion[]; index: number; choices: Record<string, number>; locked: boolean; reveal: null | { correct: boolean; answer: number; explain: string } }
  | { kind: "done"; score: number; total: number; review: ReviewItem[] }
  | { kind: "error"; message: string };

function Play() {
  const { code } = Route.useParams();
  const [phase, setPhase] = useState<Phase>({ kind: "loading" });
  const [clientKey, setClientKey] = useState("");
  const lockRef = useRef(false);

  useEffect(() => {
    const key = readKey();
    setClientKey(key);
    let stop = false;
    void (async () => {
      try {
        const room = await getRoom({ data: { code } });
        if (stop) return;
        if (!room.ok) {
          setPhase({ kind: "missing" });
          return;
        }
        const attempt = await getAttempt({ data: { code, clientKey: key } });
        if (stop) return;
        if (attempt.ok && attempt.found) {
          setPhase({ kind: "done", score: attempt.score, total: attempt.total, review: attempt.review });
          return;
        }
        setPhase({
          kind: "quiz",
          questions: room.questions,
          index: 0,
          choices: {},
          locked: false,
          reveal: null,
        });
      } catch (error) {
        if (!stop) setPhase({ kind: "error", message: error instanceof Error ? error.message : "שגיאה בטעינה" });
      }
    })();
    return () => {
      stop = true;
    };
  }, [code]);

  async function choose(choice: number) {
    if (phase.kind !== "quiz" || phase.locked || lockRef.current) return;
    const question = phase.questions[phase.index];
    if (!question) return;
    lockRef.current = true;
    const snapshot = phase;
    setPhase({ ...snapshot, locked: true });
    try {
      const result = await checkAnswer({ data: { code, questionId: question.id, choice } });
      setPhase({
        kind: "quiz",
        questions: snapshot.questions,
        index: snapshot.index,
        choices: { ...snapshot.choices, [question.id]: choice },
        locked: true,
        reveal: result,
      });
    } catch (error) {
      lockRef.current = false;
      setPhase({ kind: "error", message: error instanceof Error ? error.message : "לא הצלחנו לבדוק" });
    }
  }

  async function next() {
    if (phase.kind !== "quiz" || !phase.reveal) return;
    const last = phase.index >= phase.questions.length - 1;
    if (!last) {
      lockRef.current = false;
      setPhase({
        kind: "quiz",
        questions: phase.questions,
        index: phase.index + 1,
        choices: phase.choices,
        locked: false,
        reveal: null,
      });
      return;
    }
    const choices = phase.questions.map((question) => ({
      id: question.id,
      choice: phase.choices[question.id] ?? -1,
    }));
    try {
      const saved = await submitAttempt({ data: { code, clientKey, choices } });
      setPhase({ kind: "done", score: saved.score, total: saved.total, review: saved.review });
    } catch (error) {
      setPhase({ kind: "error", message: error instanceof Error ? error.message : "ההגשה לא נשמרה" });
    }
  }

  function anotherStudent() {
    const key = rotateKey();
    setClientKey(key);
    setPhase({ kind: "loading" });
    void (async () => {
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
        reveal: null,
      });
    })();
  }

  return (
    <Shell>
      {phase.kind === "loading" ? <p className="text-muted">טוענים את החידון...</p> : null}
      {phase.kind === "missing" ? (
        <Panel>
          <h1 className="text-2xl font-extrabold">הקוד לא נמצא</h1>
          <p className="mt-2 text-muted">בדקו את חמשת התווים עם המורה.</p>
          <Link to="/" className="mt-4 inline-flex min-h-12 items-center font-bold text-primary">
            חזרה למסך הכניסה
          </Link>
        </Panel>
      ) : null}
      {phase.kind === "error" ? (
        <Panel>
          <h1 className="text-2xl font-extrabold">משהו השתבש</h1>
          <p className="mt-2 text-danger">{phase.message}</p>
          <button type="button" className="mt-4 min-h-12 font-bold" onClick={() => window.location.reload()}>
            נסו שוב
          </button>
        </Panel>
      ) : null}
      {phase.kind === "quiz" ? (
        <QuizView code={code} phase={phase} onChoose={(choice) => void choose(choice)} onNext={() => void next()} />
      ) : null}
      {phase.kind === "done" ? (
        <DoneView code={code} score={phase.score} total={phase.total} review={phase.review} onAnother={anotherStudent} />
      ) : null}
    </Shell>
  );
}

function QuizView({
  code,
  phase,
  onChoose,
  onNext,
}: {
  code: string;
  phase: Extract<Phase, { kind: "quiz" }>;
  onChoose: (choice: number) => void;
  onNext: () => void;
}) {
  const question = phase.questions[phase.index];
  if (!question) return null;
  const progress = Math.round((phase.index / phase.questions.length) * 100);
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between text-sm text-muted">
        <span className="font-semibold tabular-nums">
          שאלה {phase.index + 1} מתוך {phase.questions.length}
        </span>
        <span dir="ltr" className="font-bold tracking-widest text-ink">
          {code}
        </span>
      </div>
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <p className="mb-2 text-sm font-semibold text-primary">{TOPIC_LABEL[question.topic]}</p>
      <h1 className="text-balance text-2xl font-extrabold leading-snug">{question.q}</h1>
      <div className="mt-5 flex flex-col gap-3">
        {question.options.map((option, index) => {
          const picked = phase.choices[question.id] === index;
          const show = phase.reveal !== null;
          const isAnswer = show && phase.reveal?.answer === index;
          const isWrongPick = show && picked && !phase.reveal?.correct;
          let tone = "border-line bg-paper-2 hover:border-ink";
          if (isAnswer) tone = "border-signal bg-signal text-signal-ink";
          else if (isWrongPick) tone = "border-danger bg-danger text-danger-ink";
          else if (show) tone = "border-line bg-paper text-muted";
          return (
            <button
              key={option}
              type="button"
              disabled={phase.locked}
              onClick={() => onChoose(index)}
              className={`min-h-14 rounded-2xl border px-4 text-right text-base font-semibold transition ${tone}`}
            >
              {option}
            </button>
          );
        })}
      </div>
      {phase.reveal ? (
        <div
          className={
            "mt-4 rounded-2xl border px-4 py-3 text-sm leading-relaxed " +
            (phase.reveal.correct
              ? "border-signal bg-signal-ink text-ink"
              : "border-danger bg-danger-ink text-ink")
          }
        >
          <p className="font-bold">{phase.reveal.correct ? "נכון" : "לא מדויק"}</p>
          <p className="mt-1">{phase.reveal.explain}</p>
          <button
            type="button"
            onClick={onNext}
            className="mt-3 min-h-12 rounded-2xl bg-ink px-5 font-bold text-paper"
          >
            {phase.index >= phase.questions.length - 1 ? "סיימו ושלחו ללוח הכיתה" : "השאלה הבאה"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function DoneView({
  code,
  score,
  total,
  review,
  onAnother,
}: {
  code: string;
  score: number;
  total: number;
  review: ReviewItem[];
  onAnother: () => void;
}) {
  const percent = total === 0 ? 0 : Math.round((score / total) * 100);
  const weak = new Map<TopicId, number>();
  for (const item of review) {
    if (!item.correct) weak.set(item.topic, (weak.get(item.topic) ?? 0) + 1);
  }
  const focus = [...weak.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  return (
    <div className="mx-auto max-w-2xl">
      <Panel>
        <p className="text-sm font-semibold text-muted">ההגשה נשמרה בכיתה {code}</p>
        <p className="mt-2 text-5xl font-extrabold tabular-nums text-signal">
          {score}/{total}
        </p>
        <p className="mt-1 text-lg">{percent}% נכונות</p>
        {focus.length > 0 ? (
          <div className="mt-4">
            <p className="font-bold">כדאי לחזק</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {focus.map(([topic]) => (
                <li key={topic} className="rounded-full bg-paper px-3 py-1 text-sm font-semibold">
                  {TOPIC_LABEL[topic]}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="mt-4 font-semibold text-signal">עניתם נכון על הכל.</p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/board/$code"
            params={{ code }}
            className="inline-flex min-h-12 items-center rounded-2xl bg-ink px-4 font-bold text-paper"
          >
            לוח הכיתה
          </Link>
          <button type="button" onClick={onAnother} className="min-h-12 rounded-2xl border border-line px-4 font-bold">
            תלמיד נוסף במכשיר הזה
          </button>
        </div>
      </Panel>
      <ol className="mt-4 flex flex-col gap-3">
        {review.map((item, index) => (
          <li key={item.id} className="rounded-card border border-line bg-paper-2 p-4">
            <p className="text-sm font-semibold text-muted">
              {index + 1}. {item.topicLabel}
            </p>
            <p className="mt-1 font-bold">{item.q}</p>
            <p className={"mt-2 text-sm font-semibold " + (item.correct ? "text-signal" : "text-danger")}>
              {item.correct ? "נכון" : "לא נכון"}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{item.explain}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
