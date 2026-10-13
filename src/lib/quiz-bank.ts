export const LEVELS = ["easy", "medium", "hard", "mixed"] as const;
export type Level = (typeof LEVELS)[number];

export const LEVEL_META: Record<Level, { label: string; blurb: string; count: number }> = {
  easy: { label: "קל", blurb: "עשר שאלות בסיס, אותו סט לכל הכיתה", count: 10 },
  medium: { label: "בינוני", blurb: "שתים־עשרה שאלות, אותו סט לכל הכיתה", count: 12 },
  hard: { label: "קשה", blurb: "חמש־עשרה שאלות מתקדמות, אותו סט", count: 15 },
  mixed: { label: "מעורב", blurb: "שתים־עשרה שאלות מכל הרמות, קבועות לכיתה", count: 12 },
};

export type TopicId =
  | "basics"
  | "daily"
  | "llm"
  | "errors"
  | "deepfake"
  | "privacy"
  | "prompt"
  | "power"
  | "recommend"
  | "human"
  | "neural"
  | "energy"
  | "bias"
  | "skills"
  | "medicine"
  | "create"
  | "school"
  | "future"
  | "detect";

export const TOPIC_LABEL: Record<TopicId, string> = {
  basics: "מה זה AI",
  daily: "AI ביומיום",
  llm: "איך המודל עובד",
  errors: "טעויות והזיות",
  deepfake: "Deepfake",
  privacy: "פרטיות",
  prompt: "פרומפטים",
  power: "חוזקות של AI",
  recommend: "המלצות",
  human: "אדם מול AI",
  neural: "רשתות עצביות",
  energy: "סביבה ואנרגיה",
  bias: "הטיות",
  skills: "כישורים",
  medicine: "רפואה ומדע",
  create: "יצירתיות",
  school: "שימוש בלימודים",
  future: "אחריות ועתיד",
  detect: "זיהוי זיוף",
};

export type BankQuestion = {
  id: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
  topic: TopicId;
  tier: Exclude<Level, "mixed">;
};

export type StoredQuestion = {
  id: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
  topic: TopicId;
};

export const BANK: BankQuestion[] = [
  {
    id: "e1",
    tier: "easy",
    topic: "basics",
    q: "מה זה בינה מלאכותית (AI)?",
    options: ["רובוט עם רגשות", "תוכנה שלומדת מדפוסים בנתונים", "מחשב שתמיד צודק", "קסם"],
    answer: 1,
    explain: "AI היא תוכנה שמזהה דפוסים בנתונים ומשתפרת עם הזמן.",
  },
  {
    id: "e2",
    tier: "easy",
    topic: "daily",
    q: "איפה פוגשים AI ביומיום?",
    options: ["רק במעבדות", "בטיקטוק, ביוטיוב ובמשחקים", "רק במחשבים ישנים", "בספרים מודפסים"],
    answer: 1,
    explain: "המלצות, זיהוי פנים ותרגום כבר נמצאים בכלים שמשתמשים בהם כל יום.",
  },
  {
    id: "e3",
    tier: "easy",
    topic: "llm",
    q: "מה ChatGPT עושה כשהוא עונה?",
    options: ["מחפש בגוגל בזמן אמת", "מנחש את המילה הבאה לפי מה שלמד", "מרגיש את השאלה", "שואל בני אדם"],
    answer: 1,
    explain: "מודל שפה מנבא את ההמשך הסביר, הוא לא מבין כמו אדם.",
  },
  {
    id: "e4",
    tier: "easy",
    topic: "errors",
    q: "האם AI יכול לטעות?",
    options: ["לא, הוא תמיד צודק", "כן, הוא יכול להמציא מידע", "רק באנגלית", "רק בלילה"],
    answer: 1,
    explain: "AI יכול להזות. תשובה שנשמעת בטוחה עדיין צריכה בדיקה.",
  },
  {
    id: "e5",
    tier: "easy",
    topic: "deepfake",
    q: "מה זה Deepfake?",
    options: ["משחק מחשב", "תוכן מזויף שנראה אמיתי", "סוג של רובוט", "אפליקציית מוזיקה"],
    answer: 1,
    explain: "אפשר ליצור סרטון או קול של אדם שאומר דבר שמעולם לא אמר.",
  },
  {
    id: "e6",
    tier: "easy",
    topic: "privacy",
    q: "למה לא לשתף מידע אישי עם AI?",
    options: ["כי זה משעמם", "כי המידע יכול להישמר ולשמש לאימון", "כי AI לא קורא עברית", "אין סיבה"],
    answer: 1,
    explain: "שם, כתובת או תמונה אישית לא מקומם בצ'אט.",
  },
  {
    id: "e7",
    tier: "easy",
    topic: "prompt",
    q: "מה עוזר לקבל תשובה טובה יותר?",
    options: ["שאלה קצרה ומעורפלת", "פרומפט ספציפי וברור", "לכתוב רק באנגלית", "לשלוח תמונה של עצמכם"],
    answer: 1,
    explain: "ככל שמגדירים גיל, מטרה ואורך, התוצאה מדויקת יותר.",
  },
  {
    id: "e8",
    tier: "easy",
    topic: "power",
    q: "AI חזק במיוחד ב...",
    options: ["להרגיש רגשות", "לעבד כמויות גדולות של מידע מהר", "להיות חבר אמיתי", "לשחק כדורגל"],
    answer: 1,
    explain: "החוזק שלו הוא מהירות, זיהוי דפוסים וחישוב, לא רגש.",
  },
  {
    id: "e9",
    tier: "easy",
    topic: "recommend",
    q: "מה זה אלגוריתם המלצות?",
    options: ["מורה בבית הספר", "מערכת שלומדת מה אוהבים וממליצה", "סוג של משחק", "מחשבון"],
    answer: 1,
    explain: "טיקטוק, יוטיוב וספוטיפיי לומדים מצפייה, לייקים ודילוגים.",
  },
  {
    id: "e10",
    tier: "easy",
    topic: "human",
    q: "האם AI יכול להחליף לגמרי בני אדם?",
    options: ["כן, בכל דבר", "לא, יש דברים שבני אדם עושים טוב יותר", "רק בעבודה", "רק במשחקים"],
    answer: 1,
    explain: "יצירתיות אמיתית, אמפתיה ושיפוט מוסרי נשארים אנושיים.",
  },
  {
    id: "m1",
    tier: "medium",
    topic: "neural",
    q: "איך רשת עצבית מלאכותית עובדת באופן כללי?",
    options: ["שכבות של יחידות חישוב שמזהות דפוסים", "על ידי חיפוש בגוגל", "רק עם תמונות", "היא לא לומדת"],
    answer: 0,
    explain: "כל שכבה מזהה משהו מורכב יותר מהשכבה שלפניה.",
  },
  {
    id: "m2",
    tier: "medium",
    topic: "energy",
    q: "מה קורה כשמאמנים מודל AI גדול?",
    options: ["הוא צורך מעט מאוד אנרגיה", "הוא יכול לצרוך המון חשמל", "הוא לא צריך מחשבים", "הוא לומד רק מספרים"],
    answer: 1,
    explain: "אימון מודלים גדולים דורש מרכזי נתונים וקירור.",
  },
  {
    id: "m3",
    tier: "medium",
    topic: "bias",
    q: "למה AI יכול להיות מוטה?",
    options: ["כי הוא רע", "כי הנתונים שאומנו עליהם לא תמיד הוגנים", "כי הוא לא יודע מתמטיקה", "כי הוא ישן"],
    answer: 1,
    explain: "אם הדוגמאות מוטות, גם התשובות יהיו מוטות.",
  },
  {
    id: "m4",
    tier: "medium",
    topic: "human",
    q: "מה ההבדל העיקרי בין AI לאדם בחשיבה?",
    options: ["אין הבדל", "AI מנחש לפי דפוסים, אדם מבין משמעות", "AI תמיד חכם יותר", "אדם לא יכול ללמוד"],
    answer: 1,
    explain: "AI מצטיין בדפוסים, אבל חסרה לו הבנה של העולם.",
  },
  {
    id: "m5",
    tier: "medium",
    topic: "skills",
    q: "איזה כישור חשוב במיוחד בעידן AI?",
    options: ["לשנן הכל בעל פה", "חשיבה ביקורתית ויצירתיות", "לא להשתמש במחשב", "לכתוב מהר בלי לקרוא"],
    answer: 1,
    explain: "מי שבודק, שואל ויוצר נשאר בעל הבית של הכלי.",
  },
  {
    id: "m6",
    tier: "medium",
    topic: "errors",
    q: "מה זה הזיה (Hallucination) של AI?",
    options: ["כשהוא רואה דברים", "כשהוא ממציא מידע שנשמע אמיתי", "כשהוא נרדם", "כשהוא מדבר עברית"],
    answer: 1,
    explain: "התשובה יכולה להישמע משכנעת ועדיין להיות שגויה.",
  },
  {
    id: "m7",
    tier: "medium",
    topic: "deepfake",
    q: "למה כדאי לבדוק Deepfake?",
    options: ["כי הם תמיד אמיתיים", "כי קשה להבחין בינם לבין תוכן אמיתי", "כי הם רק בשחור־לבן", "אין צורך"],
    answer: 1,
    explain: "זיוף טוב נראה מושלם. ספקנות ובדיקת מקור הן ההגנה.",
  },
  {
    id: "m8",
    tier: "medium",
    topic: "recommend",
    q: "איך אלגוריתם של טיקטוק לומד?",
    options: ["רק לפי גיל", "לפי זמן צפייה, לייקים והתנהגות", "הוא לא לומד", "רק לפי השעה ביום"],
    answer: 1,
    explain: "כל אינטראקציה מזינה את הלולאה ומכוונת את הסרטון הבא.",
  },
  {
    id: "m9",
    tier: "medium",
    topic: "medicine",
    q: "מה שימוש חיובי של AI ברפואה?",
    options: ["להחליף רופאים לגמרי", "לעזור בזיהוי מחלות מתמונות", "לכתוב מרשמים בלי בדיקה", "אין שימושים"],
    answer: 1,
    explain: "AI יכול לסמן ממצאים מוקדם, וההחלטה נשארת אצל הרופא.",
  },
  {
    id: "m10",
    tier: "medium",
    topic: "detect",
    q: "מה כדאי לעשות לפני שמאמינים לתוכן שנוצר ב-AI?",
    options: ["לשתף מיד", "לבדוק ממקורות אמינים", "להאמין כי זה AI", "למחוק בלי לקרוא"],
    answer: 1,
    explain: "במיוחד בעובדות, חדשות ועבודות, בודקים מקור שני.",
  },
  {
    id: "m11",
    tier: "medium",
    topic: "create",
    q: "AI יכול לעזור ביצירתיות כי...",
    options: ["הוא מחליף אתכם", "הוא יכול להציע רעיונות ולעזור בביצוע", "הוא לא יכול לעזור", "רק מבוגרים יכולים להשתמש בו"],
    answer: 1,
    explain: "הוא שותף. הרעיון, הטעם והאחריות נשארים שלכם.",
  },
  {
    id: "m12",
    tier: "medium",
    topic: "school",
    q: "מה הסכנה בשימוש יתר ב-AI לעבודות בית ספר?",
    options: ["אין סכנה", "לא לומדים באמת ולא מפתחים חשיבה", "המורה תמיד יודע", "זה תמיד מותר להעתיק"],
    answer: 1,
    explain: "הכלי צריך לעזור להבין, לא להחליף את החשיבה.",
  },
  {
    id: "h1",
    tier: "hard",
    topic: "llm",
    q: "מה מאפיין מודל שפה גדול כמו ChatGPT?",
    options: ["הוא מבין באמת את העולם", "הוא מנבא את הטוקן הבא לפי הסתברות", "הוא מחפש באינטרנט בזמן אמת", "יש לו תודעה"],
    answer: 1,
    explain: "המודל מחשב מה סביר שיבוא אחר כך, לא מה נכון בעולם.",
  },
  {
    id: "h2",
    tier: "hard",
    topic: "energy",
    q: "למה אימון מודל גדול יקר לסביבה?",
    options: ["כי הוא צריך הרבה נייר", "כי הוא דורש המון חשמל וקירור", "כי הוא עובד רק בחורף", "אין עלות סביבתית"],
    answer: 1,
    explain: "שרתים וקירור צורכים חשמל ומים. שימוש מיותר גם עולה.",
  },
  {
    id: "h3",
    tier: "hard",
    topic: "bias",
    q: "מה הבעיה עם הטיות ב-AI?",
    options: ["אין בעיה", "המודל יכול לשכפל אפליה שנמצאת בנתונים", "הוא תמיד הוגן", "רק מודלים ישנים מוטים"],
    answer: 1,
    explain: "נתונים לא מאוזנים הופכים לתוצאות לא הוגנות.",
  },
  {
    id: "h4",
    tier: "hard",
    topic: "deepfake",
    q: "איך מפחיתים סיכון מ-Deepfakes?",
    options: ["מאמינים לכל סרטון", "בודקים מקור, מחפשים סימנים ונשארים ספקנים", "מפסיקים לצפות בוידאו", "משתפים כדי שכולם יחליטו"],
    answer: 1,
    explain: "אין כפתור קסם. בדיקה וספקנות הן ההגנה המעשית.",
  },
  {
    id: "h5",
    tier: "hard",
    topic: "neural",
    q: "מה מייחד למידה עמוקה מלמידה פשוטה יותר?",
    options: ["אין הבדל", "רשתות עם הרבה שכבות שמזהות דפוסים מורכבים", "היא לא לומדת", "היא עובדת רק על טקסט"],
    answer: 1,
    explain: "עומק השכבות מאפשר לזהות צורות, שפה ומשמעות ברמות גבוהות.",
  },
  {
    id: "h6",
    tier: "hard",
    topic: "llm",
    q: "למה AI לא מבין באמת שאלות?",
    options: ["כי הוא עצלן", "כי הוא פועל על דפוסים סטטיסטיים, לא על הבנת עולם", "כי הוא לא יודע עברית", "הוא כן מבין הכל"],
    answer: 1,
    explain: "אין לו מודל פנימי של העולם כמו שיש לאדם.",
  },
  {
    id: "h7",
    tier: "hard",
    topic: "future",
    q: "מה אתגר גדול של AI בעתיד?",
    options: ["אין אתגרים", "ליישר יכולות חזקות עם אחריות ופיקוח אנושי", "הוא תמיד איטי מדי", "אי אפשר להשתמש בו"],
    answer: 1,
    explain: "הכוח כבר כאן. השאלה היא מי מחליט ואיך בודקים.",
  },
  {
    id: "h8",
    tier: "hard",
    topic: "prompt",
    q: "איך פרומפט טוב משפיע על התוצאה?",
    options: ["הוא לא משפיע", "הוא מכוון את המודל ומקטין עמימות", "רק אם הוא באנגלית", "רק אם הוא קצר מאוד"],
    answer: 1,
    explain: "הקשר, קהל יעד ומגבלה ברורה מצמצמים תשובות כלליות.",
  },
  {
    id: "h9",
    tier: "hard",
    topic: "school",
    q: "מה הסיכון בתוכן לימודי שנוצר ב-AI בלי בדיקה?",
    options: ["אין סיכון", "מידע שגוי או מוטה שנשמע אמין", "המורה תמיד מתקן הכל", "המודל לא טועה בלימודים"],
    answer: 1,
    explain: "ביטחון בסגנון הכתיבה לא אומר שהעובדה נכונה.",
  },
  {
    id: "h10",
    tier: "hard",
    topic: "human",
    q: "איזה תפקיד נשאר חשוב לבני אדם?",
    options: ["להיות פסיביים", "להגדיר מטרות, לבדוק תוצאות ולקחת אחריות", "להפסיק לחשוב", "רק ללחוץ על כפתורים"],
    answer: 1,
    explain: "ההחלטה והערכים לא עוברים למודל.",
  },
  {
    id: "h11",
    tier: "hard",
    topic: "bias",
    q: "למה חשוב לגוון את נתוני האימון?",
    options: ["לא חשוב", "כדי להפחית הטיות ולעבוד טוב על אנשים שונים", "כדי שהמודל יהיה איטי", "רק בשביל יופי"],
    answer: 1,
    explain: "נתונים צרים מייצרים מודל שטועה על מי שלא הופיע בהם.",
  },
  {
    id: "h12",
    tier: "hard",
    topic: "school",
    q: "מה המשמעות של AI ככלי ולא כמחליף?",
    options: ["אפשר להעתיק הכל", "משתמשים בו כדי להגביר חשיבה, לא כדי לוותר עליה", "AI תמיד טוב יותר", "אין משמעות"],
    answer: 1,
    explain: "הכלי הכי שימושי כשהוא בשירות ההבנה שלכם.",
  },
  {
    id: "h13",
    tier: "hard",
    topic: "detect",
    q: "איך אפשר לזהות תוכן שנוצר על ידי AI?",
    options: ["אי אפשר אף פעם", "לפעמים לפי סגנון חלק מדי או חוסר עקביות, ואז בודקים", "רק אם יש סימן מים", "תמיד יש שגיאות כתיב"],
    answer: 1,
    explain: "אין שיטה מושלמת. ספקנות ובדיקה עדיין עובדות.",
  },
  {
    id: "h14",
    tier: "hard",
    topic: "medicine",
    q: "מה יתרון של AI במדע?",
    options: ["הוא מחליף מדענים", "הוא מנתח כמויות עצומות של נתונים ומוצא דפוסים", "הוא לא עוזר", "רק במתמטיקה של בית ספר"],
    answer: 1,
    explain: "בתרופות, באקלים ובחלל הוא מאיץ חיפוש. הפרשנות אנושית.",
  },
  {
    id: "h15",
    tier: "hard",
    topic: "future",
    q: "למה כדאי להבין איך AI עובד גם בלי להיות מתכנתים?",
    options: ["אין סיבה", "כדי להשתמש בו בחכמה ולהבין מתי הוא טועה", "רק בשביל ציון", "כי אסור להשתמש בלי תואר"],
    answer: 1,
    explain: "אזרחות דיגיטלית מתחילה בידיעה מה הכלי יכול ומה לא.",
  },
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = copy[i];
    copy[i] = copy[j] as T;
    copy[j] = swap as T;
  }
  return copy;
}

function reshuffleOptions(question: BankQuestion): StoredQuestion {
  const order = shuffle(question.options.map((_, index) => index));
  return {
    id: question.id,
    q: question.q,
    options: order.map((index) => question.options[index] as string),
    answer: order.indexOf(question.answer),
    explain: question.explain,
    topic: question.topic,
  };
}

export function buildRoomQuestions(level: Level): StoredQuestion[] {
  let picked: BankQuestion[];
  if (level === "easy") picked = BANK.filter((item) => item.tier === "easy");
  else if (level === "medium") picked = BANK.filter((item) => item.tier === "medium");
  else if (level === "hard") picked = BANK.filter((item) => item.tier === "hard");
  else {
    const take = (tier: BankQuestion["tier"], count: number) =>
      shuffle(BANK.filter((item) => item.tier === tier)).slice(0, count);
    picked = [...take("easy", 4), ...take("medium", 4), ...take("hard", 4)];
  }
  return shuffle(picked).map(reshuffleOptions);
}

export function isLevel(value: string): value is Level {
  return (LEVELS as readonly string[]).includes(value);
}
