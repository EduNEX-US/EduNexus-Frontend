import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

/** ---------- Types ---------- */
export type StudentProfile = {
  id: string;
  name: string;
  email: string;
  mobile: number | string;
  studClass: number | string;
  address: string;
  altMobile: number | string;
  guardian: string;
  imageUrl: string;
};

export type Notice = {
  id: string | number;
  title?: string;
  body?: string;
  message?: string;
  content?: string;
  createdAt?: string;
};

export type ExamSession = "UNIT_1" | "MID_SEM" | "UNIT_2" | "END";

/**
 * Your Marks entity returns ONE Marks row for latest (as per backend /marks/me/latest).
 * Adjust these keys if your Marks table uses different names.
 */
export type LatestMarksResponse = {
  id?: number;
  examSession?: ExamSession;
  resultDate?: string;
  english?: number;
  hindi?: number;
  math?: number;
  science?: number;
  socialScience?: number;
  computer?: number;
  generalKnowledge?: number;
  // some backends return a nested student object - ignore safely
};

export type RecentTestRow = {
  id: number;
  subject: string;
  date: string;
  score: number;
  total: number;
  grade: string;
};

/** ---------- Helpers ---------- */
const SUBJECTS: { key: keyof LatestMarksResponse; label: string; total: number }[] = [
  { key: "english", label: "English", total: 100 },
  { key: "hindi", label: "Hindi", total: 100 },
  { key: "math", label: "Mathematics", total: 100 },
  { key: "science", label: "Science", total: 100 },
  { key: "socialScience", label: "Social Science", total: 100 },
  { key: "computer", label: "Computer", total: 100 },
  { key: "generalKnowledge", label: "General Knowledge", total: 100 },
];

function safeText(v: any) {
  return v == null ? "" : String(v);
}

function formatDate(d?: string) {
  if (!d) return "";
  // if backend sends "2025-11-18" keep it readable
  return d.length >= 10 ? d.slice(0, 10) : d;
}

export const getGradeColor = (grade: string) => {
  if (grade.startsWith("A")) return "text-emerald-600 bg-emerald-200";
  if (grade.startsWith("B")) return "text-blue-600 bg-blue-200";
  if (grade.startsWith("C")) return "text-amber-600 bg-amber-200";
  return "text-red-600 bg-red-50";
};

function calcGrade(pct: number) {
  // basic school-style grading (change if you want)
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  return "D";
}

function toRecentTests(latest: LatestMarksResponse | null): RecentTestRow[] {
  if (!latest) return [];

  const date = formatDate(latest.resultDate) || "—";
  const rows: RecentTestRow[] = [];

  for (const s of SUBJECTS) {
    const v = (latest as any)[s.key];

    // Only include subject if marks exist (number)
    if (typeof v !== "number") continue;

    const pct = (v / s.total) * 100;
    rows.push({
      id: rows.length + 1,
      subject: s.label,
      date,
      score: v,
      total: s.total,
      grade: calcGrade(pct),
    });
  }

  // keep top 3 only (Recent Tests panel)
  return rows.slice(0, 3);
}

/** ---------- Hook ---------- */
export default function useFuncs() {
  const token = useAppSelector((s: any) => s.auth.token);

  // ---------- Student profile ----------
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");

  // ---------- Notices ----------
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticesLoading, setNoticesLoading] = useState(false);
  const [noticesError, setNoticesError] = useState("");

  // ---------- Latest marks ----------
  const [latestMarks, setLatestMarks] = useState<LatestMarksResponse | null>(null);
  const [marksLoading, setMarksLoading] = useState(false);
  const [marksError, setMarksError] = useState("");

  // ---------- Update profile ----------
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchStudentMe();
    fetchNotices();
    fetchLatestMarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /** ✅ GET /student/me */
  async function fetchStudentMe() {
    try {
      setStudentLoading(true);
      setStudentError("");

      const res = await fetch("http://localhost:8080/student/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStudent(null);
        setStudentError((data as any)?.error ?? "Failed to fetch student profile");
        return;
      }

      setStudent({
        id: safeText(data.id),
        name: safeText(data.name),
        email: safeText(data.email),
        mobile: data.mobile ?? "",
        studClass: data.studClass ?? "",
        address: safeText(data.address),
        altMobile: data.altMobile ?? "",
        guardian: safeText(data.guardian),
        imageUrl: safeText(data.imageUrl),
      });
    } catch {
      setStudent(null);
      setStudentError("Network error while fetching student profile");
    } finally {
      setStudentLoading(false);
    }
  }

  /** ✅ GET /notice */
  async function fetchNotices() {
    try {
      setNoticesLoading(true);
      setNoticesError("");

      const res = await fetch("http://localhost:8080/notice", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ([]));
      if (!res.ok) {
        setNotices([]);
        setNoticesError((data as any)?.error ?? "Failed to fetch notices");
        return;
      }

      setNotices(Array.isArray(data) ? data : []);
    } catch {
      setNotices([]);
      setNoticesError("Network error while fetching notices");
    } finally {
      setNoticesLoading(false);
    }
  }

  /** ✅ GET /marks/me/latest
   *  If no marks exist, backend may return null (or empty).
   */
  async function fetchLatestMarks() {
    try {
      setMarksLoading(true);
      setMarksError("");

      const res = await fetch("http://localhost:8080/marks/me/latest", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setLatestMarks(null);
        setMarksError((data as any)?.error ?? "Failed to fetch latest marks");
        return;
      }

      // backend may return null -> show "No recent tests"
      setLatestMarks(data && typeof data === "object" ? data : null);
    } catch {
      setLatestMarks(null);
      setMarksError("Network error while fetching latest marks");
    } finally {
      setMarksLoading(false);
    }
  }

  /**
   * ✅ PUT /student/me (multipart)
   * allowed fields: name, email, mobile, address
   */
  async function updateStudentMe(
    payload: { name?: string; email?: string; mobile?: string | number; address?: string },
    imageFile?: File | null
  ) {
    if (!token) throw new Error("NO_TOKEN");

    try {
      setUpdating(true);
      setUpdateError("");
      setUpdateSuccess("");

      const fd = new FormData();
      fd.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
      if (imageFile) fd.append("image", imageFile);

      const res = await fetch("http://localhost:8080/student/me", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setUpdateError((data as any)?.error ?? "Update failed");
        throw new Error((data as any)?.error ?? "UPDATE_FAILED");
      }

      // update local state immediately
      setStudent((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: data.name ?? prev.name,
          email: data.email ?? prev.email,
          mobile: data.mobile ?? prev.mobile,
          address: data.address ?? prev.address,
          imageUrl: data.imageUrl ?? prev.imageUrl,
        };
      });

      setUpdateSuccess("Profile updated successfully");
      return data;
    } finally {
      setUpdating(false);
    }
  }

  /** Derived: studentData for your UI card (same structure as you used) */
  const studentData = useMemo(() => {
    return {
      name: student?.name ?? "-",
      class: student?.studClass ?? "-",
      email: student?.email ?? "-",
      rollNo: student?.id ?? "-",
      admissionNo: student?.id ?? "-",
      parentName: student?.guardian ?? "-",
      parentPhone: student?.altMobile ? String(student.altMobile) : "-",
      address: student?.address ?? "-",
      imageUrl: student?.imageUrl
    };
  }, [student]);

  /** Derived: Recent tests (top 3) from latest marks */
  const recentTests: RecentTestRow[] = useMemo(() => {
    return toRecentTests(latestMarks);
  }, [latestMarks]);

  return {
    // profile
    student,
    studentData,
    studentLoading,
    studentError,
    fetchStudentMe,

    // notices
    notices,
    noticesLoading,
    noticesError,
    fetchNotices,

    // marks
    latestMarks,
    recentTests,
    marksLoading,
    marksError,
    fetchLatestMarks,

    // update
    updateStudentMe,
    updating,
    updateError,
    updateSuccess,

    // utility
    getGradeColor,
  };
}
