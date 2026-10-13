import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BarChart3, GraduationCap, Users } from "lucide-react";
import { Shell, Panel } from "@/components/shell";
import { LEVELS, LEVEL_META, type Level } from "@/lib/quiz-bank";
import { createRoom } from "@/lib/quiz.functions";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const navigate = useNavigate();
  const [level, setLevel] = useState<Level>("easy");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function openClass() {
    setBusy(true);
    setError("");
    try {
      const room = await createRoom({ data: { level } });
      await navigate({ to: "/board/$code", params: { code: room.code } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "לא הצלחנו לפתוח כיתה");
    } finally {
      setBusy(false);
    }
  }

  function join(event: React.FormEvent) {
    event.preventDefault();
    const next = code.trim().toUpperCase();
    if (!/^[A-Z0-9]{5}$/.test(next)) {
      setError("הקוד הוא 5 תווים, בלי האותיות O ו-I");
      return;
    }
    setError("");
    void navigate({ to: "/play/$code", params: { code: next } });
  }

  return (
    <Shell>
      <div className="mb-8 max-w-2xl">
        <p className="mb-2 text-sm font-semibold text-primary">לכיתות ח׳–ט׳</p>
        <h1 className="text-balance text-4xl font-extrabold leading-tight">
          חידון אחד. כל הכיתה. תמונה ברורה של מה לחזק.
        </h1>
        <p className="mt-3 text-pretty text-lg leading-relaxed text-muted">
          המורה פותח כיתה ומשתף קוד. כל התלמידים עונים על אותו סט שאלות. הלוח
          מתעדכן לבד: כמה ענו נכון, כמה לא, ואילו נושאים צריך ללמד שוב.
        </p>
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <Panel>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-ink">
              <GraduationCap className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold">פתיחת כיתה</h2>
              <p className="text-sm text-muted">בחרו רמה וקבלו קוד לשיתוף</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map((item) => {
              const meta = LEVEL_META[item];
              const selected = level === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLevel(item)}
                  className={
                    "min-h-16 rounded-2xl border px-3 py-3 text-right transition " +
                    (selected
                      ? "border-primary bg-primary text-primary-ink"
                      : "border-line bg-paper hover:border-ink")
                  }
                >
                  <span className="block font-bold">{meta.label}</span>
                  <span className={"mt-1 block text-xs " + (selected ? "text-primary-ink" : "text-muted")}>
                    {meta.count} שאלות
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-muted">{LEVEL_META[level].blurb}</p>
          <button
            type="button"
            disabled={busy}
            onClick={() => void openClass()}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ink px-4 font-bold text-paper disabled:opacity-60"
          >
            <BarChart3 className="size-4" aria-hidden="true" />
            {busy ? "פותחים..." : "פתחו כיתה ועברו ללוח"}
          </button>
        </Panel>

        <Panel>
          <div className="mb-4 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-signal text-signal-ink">
              <Users className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold">כניסת תלמיד</h2>
              <p className="text-sm text-muted">הקלידו את הקוד שקיבלתם מהמורה</p>
            </div>
          </div>
          <form onSubmit={join} className="flex flex-col gap-3">
            <label className="text-sm font-semibold" htmlFor="room-code">
              קוד כיתה
            </label>
            <input
              id="room-code"
              dir="ltr"
              inputMode="text"
              autoCapitalize="characters"
              autoComplete="off"
              maxLength={5}
              value={code}
              onChange={(event) => setCode(event.target.value.toUpperCase())}
              placeholder="ABCDE"
              className="min-h-14 w-full min-w-0 rounded-2xl border border-line bg-paper px-4 text-center text-xl font-extrabold tracking-widest text-ink outline-none focus:border-ink"
            />
            <button
              type="submit"
              className="min-h-12 rounded-2xl bg-signal px-4 font-bold text-signal-ink"
            >
              היכנסו לחידון
            </button>
          </form>
        </Panel>
      </div>

      {error ? (
        <p className="mt-4 rounded-2xl border border-danger bg-danger-ink px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
        לא נשמרים שמות. כל מכשיר נספר פעם אחת, והלוח מציג רק כמויות: נכון, לא נכון,
        ונושאים שכדאי לחזק. במכשיר משותף אפשר להתחיל תלמיד נוסף אחרי הסיום.
      </p>
    </Shell>
  );
}
