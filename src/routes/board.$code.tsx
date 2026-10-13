import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Copy, RefreshCw } from "lucide-react";
import { Shell, Panel } from "@/components/shell";
import { getBoard } from "@/lib/quiz.functions";

export const Route = createFileRoute("/board/$code")({ component: Board });

type BoardData = Awaited<ReturnType<typeof getBoard>>;

function Board() {
  const { code } = Route.useParams();
  const [data, setData] = useState<BoardData | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
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
    void load();
    const timer = window.setInterval(() => void load(), 4000);
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

  if (error) {
    return (
      <Shell>
        <Panel>
          <p className="text-danger">{error}</p>
        </Panel>
      </Shell>
    );
  }

  if (!data) {
    return (
      <Shell>
        <p className="text-muted">טוענים את לוח הכיתה...</p>
      </Shell>
    );
  }

  if (!data.ok) {
    return (
      <Shell>
        <Panel>
          <h1 className="text-2xl font-extrabold">הכיתה לא נמצאה</h1>
          <Link to="/" className="mt-3 inline-flex min-h-12 items-center font-bold text-primary">
            פתחו כיתה חדשה
          </Link>
        </Panel>
      </Shell>
    );
  }

  const strengthen = data.topics.filter((topic) => topic.strengthen);
  const chart = data.topics.map((topic) => ({
    label: topic.label,
    נכון: topic.correct,
    לא: topic.wrong,
  }));

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary">לוח מורה · רמה {data.levelLabel}</p>
          <h1 className="text-balance text-3xl font-extrabold">מה הכיתה כבר יודעת</h1>
        </div>
        <div className="flex items-center gap-2">
          <p dir="ltr" className="rounded-2xl bg-ink px-3 py-3 text-2xl font-extrabold tracking-widest text-paper sm:px-4 sm:text-3xl">
            {data.code}
          </p>
          <button
            type="button"
            onClick={() => void copyCode()}
            className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-line bg-paper-2 px-3 font-bold"
          >
            <Copy className="size-4" aria-hidden="true" />
            {copied ? "הועתק" : "העתיקו"}
          </button>
        </div>
      </div>

      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted">
        שתפו את הקוד. התלמידים נכנסים ממסך הבית. הלוח מתרענן לבד, בלי שמות.
        <Link to="/play/$code" params={{ code: data.code }} className="ms-2 font-bold text-ink underline">
          קישור לחידון
        </Link>
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="הגשות" value={String(data.submissions)} />
        <Stat label="ממוצע" value={`${data.average}%`} />
        <Stat label="שאלות" value={String(data.questionCount)} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        <Band label="90% ומעלה" value={data.bands.high} />
        <Band label="70–89%" value={data.bands.good} />
        <Band label="50–69%" value={data.bands.mid} />
        <Band label="מתחת ל-50%" value={data.bands.low} />
      </div>

      <Panel className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-extrabold">מה צריך לחזק</h2>
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <RefreshCw className="size-3" aria-hidden="true" />
            מתעדכן לבד
          </span>
        </div>
        {data.submissions === 0 ? (
          <p className="text-muted">עדיין אין הגשות. ברגע שתלמיד מסיים, הנושאים החלשים יופיעו כאן.</p>
        ) : strengthen.length === 0 ? (
          <p className="font-semibold text-signal">אין נושא עם יותר מ-35% טעויות. אפשר להעלות רמה.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {strengthen.map((topic) => (
              <li key={topic.topic} className="rounded-2xl border border-line bg-paper px-4 py-3">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-bold">{topic.label}</p>
                  <p className="text-sm tabular-nums text-danger">{Math.round(topic.wrongRate * 100)}% טעויות</p>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {topic.correct} נכון · {topic.wrong} לא נכון
                </p>
                <Meter correct={topic.correct} wrong={topic.wrong} />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {chart.length > 0 && data.submissions > 0 ? (
        <Panel className="mt-4">
          <h2 className="mb-3 text-xl font-extrabold">נכון מול לא נכון לפי נושא</h2>
          <div dir="ltr" className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chart} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 4 }}>
                <XAxis type="number" allowDecimals={false} stroke="var(--color-muted)" />
                <YAxis type="category" dataKey="label" width={110} stroke="var(--color-ink)" tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="נכון" stackId="a" fill="var(--color-signal)" />
                <Bar dataKey="לא" stackId="a" fill="var(--color-danger)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      ) : null}

      <Panel className="mt-4">
        <h2 className="mb-3 text-xl font-extrabold">שאלות, מהחלשה לחזקה</h2>
        <ol className="flex flex-col gap-3">
          {data.questions.map((question, index) => (
            <li key={question.id} className="border-b border-line pb-3 last:border-0">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold">
                  <span className="text-muted">{index + 1}. </span>
                  {question.q}
                </p>
                <p className="shrink-0 text-sm tabular-nums text-muted">
                  {question.correct} נכון · {question.wrong} לא
                </p>
              </div>
              <p className="mt-1 text-xs font-semibold text-primary">{question.topicLabel}</p>
              <Meter correct={question.correct} wrong={question.wrong} />
            </li>
          ))}
        </ol>
      </Panel>
    </Shell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Panel className="p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-extrabold tabular-nums">{value}</p>
    </Panel>
  );
}

function Band({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-line bg-paper-2 px-3 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="text-2xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}

function Meter({ correct, wrong }: { correct: number; wrong: number }) {
  const total = correct + wrong;
  const width = total === 0 ? 0 : Math.round((correct / total) * 100);
  return (
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
      <div className="h-full bg-signal" style={{ width: `${width}%` }} />
    </div>
  );
}
