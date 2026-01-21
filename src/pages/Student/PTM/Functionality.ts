import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

type BackendPtm = {
  id: number | string;
  teacherId?: string;
  adminId?: string;
  studentId?: string;
  classNo?: number | string;

  ptmScope?: "CLASS" | "ONE_TO_ONE" | "ALL";
  ptmTarget?: "STUDENT" | "ADMIN";

  meetLink?: string;
  purpose?: string;
  ptmDate?: string;     // "YYYY-MM-DD" or ISO
  startTime?: string;   // "HH:mm" or "HH:mm:ss"
  endTime?: string;     // "HH:mm" or "HH:mm:ss"
  status?: string;
};

type StudentUpcoming = {
  agenda: string;
  date: string;
  time: string;
  venue: string;
  meetLink: string;
};

type StudentPast = {
  id: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
  summary: string;
};

export type ptmDataShape = {
  upcoming: StudentUpcoming | null;
  past: StudentPast[];
};

// ✅ keep your UI import style
export const ptmData: ptmDataShape = {
  upcoming: null,
  past: [],
};

const API_BASE = "http://localhost:8080";

const PTM_JOIN_EARLY_MS = 30 * 1000;
const PTM_JOIN_LATE_MS = 30 * 1000;

function toYYYYMMDD(d: any) {
  if (!d) return "";
  const s = String(d).trim();
  return s.length >= 10 ? s.slice(0, 10) : s;
}

function toHHmm(t: any) {
  if (!t) return "";
  const s = String(t).trim();
  const parts = s.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : s;
}

function parseLocalDateTime(dateStr: string, timeStr: string) {
  const ds = toYYYYMMDD(dateStr);
  const ts = toHHmm(timeStr);

  const [y, m, d] = ds.split("-").map(Number);
  const [hh, mm] = ts.split(":").map(Number);

  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

function computePtmState(ptm: { ptmDate: string; startTime: string; endTime: string }) {
  const start = parseLocalDateTime(ptm.ptmDate, ptm.startTime);
  const end = parseLocalDateTime(ptm.ptmDate, ptm.endTime);

  const expiryBase = parseLocalDateTime(ptm.ptmDate, "23:59");
  const expiry = new Date(expiryBase.getTime());
  expiry.setHours(23, 59, 59, 999);
  expiry.setDate(expiry.getDate() + 1);

  const now = new Date();

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { label: "Scheduled", joinAllowed: false, expired: false };
  }

  const nowMs = now.getTime();
  const startMs = start.getTime();
  const endMs = end.getTime();
  const expiryMs = expiry.getTime();

  if (nowMs < startMs - PTM_JOIN_EARLY_MS) return { label: "Scheduled", joinAllowed: false, expired: false };

  if (nowMs >= startMs - PTM_JOIN_EARLY_MS && nowMs <= endMs + PTM_JOIN_LATE_MS) {
    return { label: "Live Now", joinAllowed: true, expired: false };
  }

  if (nowMs > expiryMs) return { label: "Expired", joinAllowed: false, expired: true };

  return { label: "Completed", joinAllowed: false, expired: false };
}

function uniqById(list: BackendPtm[]) {
  const map = new Map<string, BackendPtm>();
  for (const p of list) map.set(String(p.id), p);
  return Array.from(map.values());
}

export default function useFuncs() {
  const token = useAppSelector((s) => s.auth.token);
  const studentId = useAppSelector((s) => s.auth.id);

  const profile = useAppSelector((s) => s.auth.profile as any);

  // ✅ much wider classNo mapping (your student entity uses stud_class)
  const profileClassNo: number | null =
    profile?.stud_class != null && profile?.stud_class !== ""
      ? Number(profile.stud_class)
      : profile?.studClass != null && profile?.studClass !== ""
      ? Number(profile.studClass)
      : profile?.sClass != null && profile?.sClass !== ""
      ? Number(profile.sClass)
      : profile?.student_class != null && profile?.student_class !== ""
      ? Number(profile.student_class)
      : profile?.classNo != null && profile?.classNo !== ""
      ? Number(profile.classNo)
      : null;

  const [classNo, setClassNo] = useState<number | null>(profileClassNo);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ptmDataShape>({ upcoming: null, past: [] });

  const [nowTick, setNowTick] = useState(0);

useEffect(() => {
  const id = setInterval(() => setNowTick((x) => x + 1), 15000); // 15s
  return () => clearInterval(id);
}, []);

// we fetch from class if redux has some issue
  useEffect(() => {
    if (!token || !studentId) return;
    if (classNo != null) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/student/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const me = await res.json();
        const cls = me?.stud_class ?? me?.studClass ?? me?.student_class ?? me?.classNo;
        if (cls != null && cls !== "") setClassNo(Number(cls));
      } catch {
        // ignore
      }
    })();
  }, [token, studentId, classNo]);

  useEffect(() => {
    if (!token || !studentId) return;
    fetchStudentPTMs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, studentId, classNo]);

  async function fetchStudentPTMs() {
    if (!token || !studentId) return;

    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // 1:1
      const oneReq = fetch(`${API_BASE}/api/ptm/student/one/${encodeURIComponent(String(studentId))}`, {
        headers,
      }).catch(() => null);

      // class
      const clsReq =
        classNo != null
          ? fetch(`${API_BASE}/api/ptm/student/class/${encodeURIComponent(String(classNo))}`, { headers }).catch(
              () => null
            )
          : Promise.resolve(null);

      const [oneRes, clsRes] = await Promise.all([oneReq, clsReq]);

      const oneJson = oneRes && oneRes.ok ? await oneRes.json() : [];
      const clsJson = clsRes && clsRes.ok ? await clsRes.json() : [];

      const oneList: BackendPtm[] = Array.isArray(oneJson) ? oneJson : Array.isArray(oneJson?.data) ? oneJson.data : [];
      const clsList: BackendPtm[] = Array.isArray(clsJson) ? clsJson : Array.isArray(clsJson?.data) ? clsJson.data : [];

      const merged = uniqById([...oneList, ...clsList])
        // ✅ IMPORTANT: don’t hide class meetings if ptmTarget is null/empty (legacy rows)
        .filter((p) => p && p.ptmTarget !== "ADMIN")
        .map((p) => ({
          ...p,
          id: String(p.id),
          ptmDate: toYYYYMMDD(p.ptmDate),
          startTime: toHHmm(p.startTime),
          endTime: toHHmm(p.endTime),
          meetLink: String(p.meetLink ?? ""),
          purpose: String(p.purpose ?? ""),
        }));

      merged.sort((a, b) => {
        const aStart = parseLocalDateTime(String(a.ptmDate), String(a.startTime)).getTime();
        const bStart = parseLocalDateTime(String(b.ptmDate), String(b.startTime)).getTime();
        return aStart - bStart;
      });

      const live = merged.filter((p) => computePtmState(p as any).joinAllowed);
      const upcomingPick =
        (live.length > 0 ? live[0] : merged.find((p) => computePtmState(p as any).label === "Scheduled")) || null;

      const past = merged
        .filter((p) => {
          const st = computePtmState(p as any);
          return st.label === "Completed" || st.expired;
        })
        .sort((a, b) => {
          const aStart = parseLocalDateTime(String(a.ptmDate), String(a.startTime)).getTime();
          const bStart = parseLocalDateTime(String(b.ptmDate), String(b.startTime)).getTime();
          return bStart - aStart;
        });

      const upcoming: StudentUpcoming | null = upcomingPick
        ? (() => {
            const st = computePtmState(upcomingPick as any);
            return {
              agenda: upcomingPick.purpose?.trim() ? upcomingPick.purpose : "Parent-Teacher Meeting",
              date: String(upcomingPick.ptmDate),
              time: `${String(upcomingPick.startTime)} - ${String(upcomingPick.endTime)}`,
              venue: "Online",
              meetLink: st.joinAllowed ? String(upcomingPick.meetLink || "") : "",
            };
          })()
        : null;

      const pastUI: StudentPast[] = past.map((p) => ({
        id: String(p.id),
        teacher: p.teacherId ? `Teacher (${p.teacherId})` : "Teacher",
        subject: p.purpose?.trim() ? p.purpose : "PTM",
        date: String(p.ptmDate),
        time: `${String(p.startTime)} - ${String(p.endTime)}`,
        summary: computePtmState(p as any).expired ? "This meeting expired." : "This meeting was completed.",
      }));

      setData({ upcoming, past: pastUI });
      ptmData.upcoming = upcoming;
      ptmData.past = pastUI;
    } catch (e) {
      console.log("Error fetching student PTMs", e);
      setData({ upcoming: null, past: [] });
      ptmData.upcoming = null;
      ptmData.past = [];
    } finally {
      setLoading(false);
    }
  }

  const hasUpcomingJoin = useMemo(() => !!data.upcoming?.meetLink, [data.upcoming]);

  return {
    loading,
    hasUpcomingJoin,
    fetchStudentPTMs,
    ptmData: data,
  };
}
