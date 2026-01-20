import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

export type ExamSession = "UNIT_1" | "MID_SEM" | "UNIT_2" | "END";

export const examSessionOptions = [
  { value: "UNIT_1", label: "Unit 1" },
  { value: "MID_SEM", label: "Mid Sem" },
  { value: "UNIT_2", label: "Unit 2" },
  { value: "END", label: "End Exam" },
] as const;

export type BackendMarksRow = {
  id?: number;

  examSession?: ExamSession | string | null;
  resultDate?: string | null;

  english?: number | null;
  hindi?: number | null;
  math?: number | null;
  science?: number | null;

  gk?: number | null;
  generalKnowledge?: number | null;

  socialScience?: number | null;
  computer?: number | null;
};

export type MarkEntry = {
  subject: string;
  score: number;
  total: number;
  grade: string;
};

export interface ChartDataItem {
  name: string;
  score: number; // percentage
  fullName: string;
}

const TOTAL_PER_SUBJECT = 100;

function safeNum(v: any): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function gradeFromPercent(p: number) {
  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B+";
  if (p >= 60) return "B";
  if (p >= 50) return "C";
  return "D";
}

function normalizeSession(v: any): ExamSession | null {
  const s = String(v ?? "").trim().toUpperCase();
  if (s === "UNIT_1") return "UNIT_1";
  if (s === "MID_SEM") return "MID_SEM";
  if (s === "UNIT_2") return "UNIT_2";
  if (s === "END") return "END";
  return null;
}

export default function useFuncs() {
  const token = useAppSelector((s) => s.auth.token);
  const profile = useAppSelector((s) => s.auth.profile);

  // ✅ default is anything (will be replaced on first load by latest)
  const [selectedExam, setSelectedExam] = useState<ExamSession>("UNIT_1");

  const [rows, setRows] = useState<BackendMarksRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ to prevent calling latest again and again
  const [bootstrapped, setBootstrapped] = useState(false);

  function handleSelectedExam(val: ExamSession) {
    setSelectedExam(val);
  }

  // ✅ 1) first open: get latest -> set selectedExam accordingly
  useEffect(() => {
    if (!token || bootstrapped) return;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:8080/marks/me/latest", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = await res.text();

        if (!res.ok) {
          // if token/role issue you'll see it here
          setError(`Failed to load latest marks (${res.status})`);
          setBootstrapped(true);
          return;
        }

        const data = raw ? JSON.parse(raw) : null;

        // data can be null if no marks exist
        if (data && typeof data === "object") {
          const latestSession = normalizeSession((data as any).examSession);
          if (latestSession) {
            // ✅ this will trigger the 2nd effect to fetch /marks/me for that session
            setSelectedExam(latestSession);
          } else {
            // fallback: keep default
          }
        }

        setBootstrapped(true);
      } catch {
        setError("Network error while fetching latest marks");
        setBootstrapped(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, bootstrapped]);

  // ✅ 2) whenever selectedExam changes (including after latest), fetch that session marks
  useEffect(() => {
    if (!token) return;
    // if you want: avoid fetching before latest bootstrap is done:
    // if (!bootstrapped) return;

    fetchMyMarks(selectedExam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, selectedExam]);

  async function fetchMyMarks(examSession: ExamSession) {
    try {
      if (!token) return;

      setLoading(true);
      setError("");

      const url = `http://localhost:8080/marks/me?examSession=${encodeURIComponent(
        examSession
      )}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawText = await res.text();

      if (!res.ok) {
        // ✅ IMPORTANT: when no marks exist, backend returns null (200) in your current code.
        // but if security blocks, you'll get 403 here, and show error.
        setRows([]);

        try {
          const maybeJson = JSON.parse(rawText);
          setError(maybeJson?.error ?? `Failed (${res.status})`);
        } catch {
          setError(`Failed (${res.status})`);
        }
        return;
      }

      const data = rawText ? JSON.parse(rawText) : null;

      // Your backend /marks/me returns a single Marks or null.
      // Normalize to array so rest of code works same.
      const normalized =
        Array.isArray(data) ? data : data && typeof data === "object" ? [data] : [];

      setRows(normalized);
    } catch {
      setRows([]);
      setError("Network error while fetching marks");
    } finally {
      setLoading(false);
    }
  }

  // ✅ pick latest row if multiple
  const activeRow: BackendMarksRow | null = useMemo(() => {
    if (!rows || rows.length === 0) return null;

    const sorted = [...rows].sort((a, b) =>
      String(b.resultDate ?? "").localeCompare(String(a.resultDate ?? ""))
    );

    return sorted[0] ?? null;
  }, [rows]);

  const isPrimaryClass = useMemo(() => {
    const cls =
      Number(profile?.stud_class ?? profile?.studClass ?? profile?.classId ?? 0) || 0;
    return cls < 5;
  }, [profile]);

  const entries: MarkEntry[] = useMemo(() => {
    if (!activeRow) return [];

    const english = safeNum(activeRow.english);
    const hindi = safeNum(activeRow.hindi);
    const math = safeNum(activeRow.math);
    const science = safeNum(activeRow.science);
    const computer = safeNum(activeRow.computer);

    const gk = safeNum(activeRow.gk ?? activeRow.generalKnowledge);
    const ss = safeNum(activeRow.socialScience);

    const list: { subject: string; value: number | null }[] = [
      { subject: "English", value: english },
      { subject: "Hindi", value: hindi },
      { subject: "Math", value: math },
      { subject: "Science", value: science },
      isPrimaryClass
        ? { subject: "General Knowledge", value: gk }
        : { subject: "Social Science", value: ss },
      { subject: "Computer", value: computer },
    ];

    return list
      .filter((x) => x.value !== null)
      .map((x) => {
        const score = Number(x.value);
        const percent = (score / TOTAL_PER_SUBJECT) * 100;
        return {
          subject: x.subject,
          score,
          total: TOTAL_PER_SUBJECT,
          grade: gradeFromPercent(percent),
        };
      });
  }, [activeRow, isPrimaryClass]);

  function calculatePercentage(score: number, total: number) {
    return ((score / total) * 100).toFixed(1);
  }

  function getGradeColor(grade: string) {
    if (grade.startsWith("A")) return "text-emerald-600 bg-emerald-50";
    if (grade.startsWith("B")) return "text-blue-600 bg-blue-50";
    if (grade.startsWith("C")) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  }

  const chartData: ChartDataItem[] = useMemo(() => {
    return entries.map((m) => ({
      name: m.subject.substring(0, 4),
      score: Number(calculatePercentage(m.score, m.total)),
      fullName: m.subject,
    }));
  }, [entries]);

  const totals = useMemo(() => {
    const totalScore = entries.reduce((a, m) => a + m.score, 0);
    const totalPossible = entries.reduce((a, m) => a + m.total, 0);
    return { totalScore, totalPossible };
  }, [entries]);

  return {
    // session
    selectedExam,
    examSessionOptions,
    handleSelectedExam,

    // backend
    rows,
    activeRow,
    loading,
    error,

    // computed
    entries,
    chartData,
    totals,

    // helpers
    calculatePercentage,
    getGradeColor,

    // optional
    fetchMyMarks,
  };
}
