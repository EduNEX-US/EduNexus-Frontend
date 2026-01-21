import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

type Student = { id: string; name: string };

type PtmRow = {
  id: number;
  teacherId: string;
  adminId?: string;
  studentId?: string;
  classNo?: number;

  ptmScope?: "CLASS" | "ONE_TO_ONE";
  ptmTarget?: "STUDENT" | "ADMIN";

  meetLink: string;
  purpose?: string;
  ptmDate: string;
  startTime: string; 
  endTime: string; 
  status?: string;
};

const API_BASE = "http://localhost:8080";

const PTM_JOIN_EARLY_MS = 30 * 1000;
const PTM_JOIN_LATE_MS = 30 * 1000; 

function toYYYYMMDD(d: string) {
  if (!d) return "";
  const s = String(d).trim();
  return s.length >= 10 ? s.slice(0, 10) : s;
}

function toHHmm(t: string) {
  if (!t) return "";
  const s = String(t).trim();
  const parts = s.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : s;
}

// ✅ robust local datetime parsing (no timezone surprises)
function parseLocalDateTime(dateStr: string, timeStr: string) {
  const ds = toYYYYMMDD(dateStr);
  const ts = toHHmm(timeStr);

  const [y, m, d] = ds.split("-").map((x) => Number(x));
  const [hh, mm] = ts.split(":").map((x) => Number(x));

  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

function computePtmState(ptm: PtmRow) {
  const start = parseLocalDateTime(ptm.ptmDate, ptm.startTime);
  const end = parseLocalDateTime(ptm.ptmDate, ptm.endTime);

  // expiry = ptmDate + 1 day 23:59:59 (local)
  const expiryBase = parseLocalDateTime(ptm.ptmDate, "23:59");
  const expiry = new Date(expiryBase.getTime());
  expiry.setHours(23, 59, 59, 999);
  expiry.setDate(expiry.getDate() + 1);

  const now = new Date();

  // If date parse fails, be safe: don't allow join
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { label: "Scheduled", joinAllowed: false, expired: false };
  }

  const nowMs = now.getTime();
  const startMs = start.getTime();
  const endMs = end.getTime();
  const expiryMs = expiry.getTime();

  // ✅ Scheduled until a tiny bit before start (buffer)
  if (nowMs < startMs - PTM_JOIN_EARLY_MS) {
    return { label: "Scheduled", joinAllowed: false, expired: false };
  }

  // ✅ Live between start/end (with buffer)
  if (nowMs >= startMs - PTM_JOIN_EARLY_MS && nowMs <= endMs + PTM_JOIN_LATE_MS) {
    return { label: "Live Now", joinAllowed: true, expired: false };
  }

  // ✅ Expired after 24h window
  if (nowMs > expiryMs) {
    return { label: "Expired", joinAllowed: false, expired: true };
  }

  return { label: "Completed", joinAllowed: false, expired: false };
}

function isValidMeetLink(url: string) {
  return /^https?:\/\/.+/i.test(url.trim());
}

export default function useFuncs() {
  const token = useAppSelector((state) => state.auth.token);
  const teacherId = useAppSelector((state) => state.auth.id);

  // ✅ get class from redux profile (NO choose class dropdown)
  const profile = useAppSelector((s) => s.auth.profile as any);
  const teacherClassNo: number | null =
    profile?.tClass != null && profile?.tClass !== ""
      ? Number(profile.tClass)
      : profile?.teacher_class != null
      ? Number(profile.teacher_class)
      : null;

  // CREATE (students only)
  const [createMode, setCreateMode] = useState<"CLASS" | "ONE_TO_ONE">("CLASS");

  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");

  const [purpose, setPurpose] = useState<string>("");
  const [meetLink, setMeetLink] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  // VIEW
  const [viewMode, setViewMode] = useState<"upcoming" | "completed">("upcoming");
  const [viewWith, setViewWith] = useState<"STUDENTS" | "ADMINS">("STUDENTS");

  const [loadingPTMs, setLoadingPTMs] = useState(false);
  const [ptms, setPtms] = useState<PtmRow[]>([]);

  const upcomingPTMs = useMemo(() => {
    return ptms.filter((p) => {
      const s = computePtmState(p);
      return !s.expired && s.label !== "Completed";
    });
  }, [ptms]);

  const completedPTMs = useMemo(() => {
    return ptms.filter((p) => {
      const s = computePtmState(p);
      return s.label === "Completed" || s.expired;
    });
  }, [ptms]);

  useEffect(() => {
    if (!token || !teacherId) return;
    fetchTeacherPTMs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, teacherId]);

  // ✅ auto-load students once class is known
  useEffect(() => {
    if (!token || !teacherClassNo) {
      setStudents([]);
      return;
    }
    fetchStudentsByMyClass();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, teacherClassNo]);

  async function fetchTeacherPTMs() {
    try {
      setLoadingPTMs(true);
      const res = await fetch(`${API_BASE}/api/ptm/teacher/${encodeURIComponent(String(teacherId))}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.log("fetchTeacherPTMs failed:", res.status, txt);
        setPtms([]);
        return;
      }

      const data = await res.json();
      const list: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

      const normalized: PtmRow[] = list.map((p: any) => ({
        id: Number(p.id),
        teacherId: String(p.teacherId ?? ""),
        adminId: p.adminId ? String(p.adminId) : undefined,
        studentId: p.studentId ? String(p.studentId) : undefined,
        classNo: typeof p.classNo === "number" ? p.classNo : p.classNo ? Number(p.classNo) : undefined,

        ptmScope: p.ptmScope,
        ptmTarget: p.ptmTarget,

        meetLink: String(p.meetLink ?? ""),
        purpose: p.purpose ? String(p.purpose) : "",

        // ✅ FIX: normalize backend formats
        ptmDate: toYYYYMMDD(String(p.ptmDate ?? "")),
        startTime: toHHmm(String(p.startTime ?? "")),
        endTime: toHHmm(String(p.endTime ?? "")),

        status: p.status,
      }));

      // Sort: nearest first (upcoming)
      normalized.sort((a, b) => {
        const aStart = parseLocalDateTime(a.ptmDate, a.startTime).getTime();
        const bStart = parseLocalDateTime(b.ptmDate, b.startTime).getTime();
        return aStart - bStart;
      });

      setPtms(normalized);
    } catch (e) {
      console.log("Error occurred while fetching teacher PTMs", e);
      setPtms([]);
    } finally {
      setLoadingPTMs(false);
    }
  }

  async function fetchStudentsByMyClass() {
    if (!teacherClassNo || !token) {
      setStudents([]);
      return;
    }

    try {
      setLoadingStudents(true);
      const res = await fetch(`${API_BASE}/teacher/students/class/${teacherClassNo}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.log("fetchStudentsByMyClass failed:", res.status, txt);
        setStudents([]);
        return;
      }

      const data = await res.json();
      const list: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

      setStudents(
        list.map((s: any) => ({
          id: String(s.id ?? s.studentId ?? s.student_id ?? ""),
          name: String(s.name ?? s.studentName ?? s.student_name ?? ""),
        }))
      );
    } catch (e) {
      console.log("Error occurred while fetching students", e);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  }

  function resetCreate() {
    setSelectedStudentId("");
    setPurpose("");
    setMeetLink("");
    setSelectedDate("");
    setStartTime("");
    setEndTime("");
  }

  function validateCreate(): string | null {
    if (!token) return "No token found";
    if (!teacherId) return "Teacher ID missing";
    if (!teacherClassNo) return "Teacher class missing in profile";
    if (!purpose.trim()) return "Enter PTM purpose";
    if (!selectedDate) return "Select date";
    if (!startTime) return "Select start time";
    if (!endTime) return "Select end time";
    if (!meetLink || !isValidMeetLink(meetLink)) return "Enter a valid Meet link";
    if (createMode === "ONE_TO_ONE" && !selectedStudentId) return "Select a student";
    return null;
  }

  async function handleCreateStudentPTM() {
    const err = validateCreate();
    if (err) {
      alert(err);
      return;
    }

    const payload: any = {
      ptmScope: createMode === "CLASS" ? "CLASS" : "ONE_TO_ONE",
      ptmTarget: "STUDENT",
      teacherId: String(teacherId),
      classNo: teacherClassNo,
      studentId: createMode === "ONE_TO_ONE" ? selectedStudentId : undefined,
      meetLink: meetLink.trim(),
      purpose: purpose.trim(),
      ptmDate: selectedDate, // teacher enters YYYY-MM-DD already
      startTime: toHHmm(startTime),
      endTime: toHHmm(endTime),
      status: "SCHEDULED",
    };

    try {
      const res = await fetch(`${API_BASE}/api/ptm/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.log("Teacher PTM create failed:", res.status, txt);
        alert("Failed to create PTM");
        return;
      }

      await fetchTeacherPTMs();
      resetCreate();
      alert("PTM created for students");
    } catch (e) {
      console.log("Error occurred while creating PTM", e);
      alert("Error occurred while creating PTM");
    }
  }

  function handleJoinPTM(ptm: PtmRow) {
    const state = computePtmState(ptm);
    if (!state.joinAllowed) {
      alert(`You cannot join now. Status: ${state.label}`);
      return;
    }
    if (!ptm.meetLink) {
      alert("Meeting link not available.");
      return;
    }
    window.open(ptm.meetLink, "_blank", "noreferrer");
  }

  return {
    // VIEW
    viewMode,
    setViewMode,
    viewWith,
    setViewWith,
    loadingPTMs,
    upcomingPTMs,
    completedPTMs,
    computePtmState,
    handleJoinPTM,
    fetchTeacherPTMs,

    // CREATE
    teacherClassNo,

    createMode,
    setCreateMode,

    students,
    loadingStudents,
    selectedStudentId,
    setSelectedStudentId,

    purpose,
    setPurpose,

    meetLink,
    setMeetLink,
    selectedDate,
    setSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,

    handleCreateStudentPTM,
  };
}
