// ===================== Functionality.ts (Admin PTM Hook) =====================
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

type Teacher = { id: string; name: string };

type PtmSession = {
  id: string; // ✅ force string id (no null issues)

  ptmScope?: string;  // "ONE_TO_ONE" | "ALL"
  ptmTarget?: string; // "ADMIN"
  adminId?: string;
  teacherId?: string | null;

  meetLink?: string;
  purpose?: string;

  ptmDate?: string;   // "YYYY-MM-DD" or ISO
  startTime?: string; // "HH:mm" or "HH:mm:ss"
  endTime?: string;   // "HH:mm" or "HH:mm:ss"
  status?: string;
};

const API_BASE = "http://localhost:8080";

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

function norm(s: any) {
  return String(s ?? "").trim();
}

function isValidMeetLink(url: string) {
  return /^https?:\/\/.+/i.test(String(url || "").trim());
}

// ✅ if backend sends id = null, create a stable synthetic id
function fallbackId(p: any) {
  return [
    "PTM",
    norm(p?.adminId),
    norm(p?.teacherId),
    norm(p?.ptmScope),
    norm(p?.ptmTarget),
    toYYYYMMDD(p?.ptmDate),
    toHHmm(p?.startTime),
    toHHmm(p?.endTime),
    norm(p?.meetLink),
  ].join("|");
}

// ✅ key to match ALL master vs generated 1:1 children
function meetingKey(p: PtmSession) {
  return [
    norm(p.adminId),
    toYYYYMMDD(p.ptmDate),
    toHHmm(p.startTime),
    toHHmm(p.endTime),
    norm(p.meetLink),
    norm(p.purpose),
  ].join("|");
}

export default function useFuncs() {
  const token = useAppSelector((state) => state.auth.token);
  const adminId = useAppSelector((state) => state.auth.id);

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  const [rawPTMs, setRawPTMs] = useState<PtmSession[]>([]);
  const [loadingPTMs, setLoadingPTMs] = useState(false);

  const [scheduleMode, setScheduleMode] = useState<"SINGLE" | "ALL">("SINGLE");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");

  const [meetLink, setMeetLink] = useState<string>("");
  const [purpose, setPurpose] = useState<string>("");

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [filterTeacherId, setFilterTeacherId] = useState<string>("");

  useEffect(() => {
    if (!token || !adminId) return;
    fetchTeachers();
    fetchAdminPTMs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, adminId]);

  async function fetchTeachers() {
    try {
      if (!token) return;
      setLoadingTeachers(true);

      const res = await fetch(`${API_BASE}/admin/teachers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.log("fetchTeachers failed:", res.status);
        setTeachers([]);
        return;
      }

      const data = await res.json();
      const list: Teacher[] = (Array.isArray(data) ? data : [])
        .filter((d: any) => d?.role === 0)
        .map((d: any) => ({ id: String(d.id), name: String(d.name) }));

      setTeachers(list);
    } catch (e) {
      console.log("Error occurred while fetching teachers", e);
      setTeachers([]);
    } finally {
      setLoadingTeachers(false);
    }
  }

  async function fetchAdminPTMs() {
    try {
      if (!token || !adminId) return;
      setLoadingPTMs(true);

      const res = await fetch(`${API_BASE}/api/ptm/admin/${encodeURIComponent(String(adminId))}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.log("fetchAdminPTMs failed:", res.status, txt);
        setRawPTMs([]);
        return;
      }

      const data = await res.json();
      const list: any[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

      // ✅ normalize everything first (NO strict ptmTarget filter that can drop completed)
      const normalized: PtmSession[] = list.map((p: any) => {
        const idRaw = p?.id ?? p?.ptmId ?? p?.sessionId ?? null;
        const id = idRaw != null && String(idRaw).trim() !== "" ? String(idRaw) : fallbackId(p);

        const scope = norm(p?.ptmScope).toUpperCase();
        const target = norm(p?.ptmTarget).toUpperCase();

        return {
          id,

          ptmScope: scope || undefined,
          ptmTarget: target || "ADMIN", // ✅ fallback

          adminId: norm(p?.adminId || adminId) || String(adminId),
          teacherId: p?.teacherId != null && norm(p.teacherId) !== "" ? String(p.teacherId) : null,

          meetLink: norm(p?.meetLink),
          purpose: norm(p?.purpose),

          ptmDate: toYYYYMMDD(p?.ptmDate),
          startTime: toHHmm(p?.startTime),
          endTime: toHHmm(p?.endTime),

          status: norm(p?.status),
        };
      });

      // ✅ Keep only admin-side meetings safely
      const adminMeetings = normalized.filter((p) => (p.ptmTarget || "ADMIN").toUpperCase() === "ADMIN");

      // ✅ If backend still creates ONE_TO_ONE children for ALL, hide those duplicates:
      // Build set of ALL master keys
      const allMasters = adminMeetings.filter((p) => (p.ptmScope || "").toUpperCase() === "ALL");
      const allKeys = new Set(allMasters.map(meetingKey));

      // Hide ONE_TO_ONE rows that match ANY ALL master key (same date/time/link/purpose/adminId)
      // But keep true ONE_TO_ONE that doesn't match an ALL master.
      const cleaned = adminMeetings.filter((p) => {
        const scope = (p.ptmScope || "").toUpperCase();

        if (scope === "ALL") return true;

        if (scope === "ONE_TO_ONE") {
          const k = meetingKey(p);
          // if it matches an ALL master, it's a generated child -> hide
          if (allKeys.has(k)) return false;
          return true;
        }

        // unknown scopes: keep (safer)
        return true;
      });

      // ✅ sort by date/time ascending so UI classification behaves nicely
      cleaned.sort((a, b) => {
        const aKey = `${a.ptmDate || ""} ${a.startTime || ""}`;
        const bKey = `${b.ptmDate || ""} ${b.startTime || ""}`;
        return aKey.localeCompare(bKey);
      });

      setRawPTMs(cleaned);
    } catch (e) {
      console.log("Error occurred while fetching admin PTMs", e);
      setRawPTMs([]);
    } finally {
      setLoadingPTMs(false);
    }
  }

  function resetForm() {
    setSelectedTeacherId("");
    setMeetLink("");
    setPurpose("");
    setSelectedDate("");
    setStartTime("");
    setEndTime("");
  }

  function validate(): string | null {
    if (!token) return "No token found";
    if (!adminId) return "Admin ID missing";
    if (!purpose.trim()) return "Enter PTM purpose";
    if (!selectedDate) return "Select date";
    if (!startTime) return "Select start time";
    if (!endTime) return "Select end time";
    if (!meetLink || !isValidMeetLink(meetLink)) return "Enter a valid Meet link";

    if (scheduleMode === "SINGLE" && !selectedTeacherId) return "Select a teacher";
    if (scheduleMode === "ALL" && teachers.length === 0) return "No teachers available";
    return null;
  }

async function handleSchedule() {
  const err = validate();
  if (err) {
    alert(err);
    return;
  }

  try {
    // ---------------- SINGLE ----------------
    if (scheduleMode === "SINGLE") {
      const payload = {
        ptmScope: "ONE_TO_ONE",
        ptmTarget: "ADMIN",
        adminId: String(adminId),
        teacherId: String(selectedTeacherId),
        meetLink: meetLink.trim(),
        purpose: purpose.trim(),
        ptmDate: selectedDate,
        startTime: toHHmm(startTime),
        endTime: toHHmm(endTime),
        status: "SCHEDULED",
      };

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
        console.log("PTM create failed:", res.status, txt);
        alert("Failed to schedule PTM");
        return;
      }

      await fetchAdminPTMs();
      resetForm();
      alert("PTM scheduled for teacher");
      return;
    }

    // ---------------- ALL (MASTER + CHILDREN) ----------------
    // ✅ 1) Create master ALL row (admin sees only this)
    const masterPayload: any = {
      ptmScope: "ALL",
      ptmTarget: "ADMIN",
      adminId: String(adminId),
      // teacherId intentionally not set
      meetLink: meetLink.trim(),
      purpose: purpose.trim(),
      ptmDate: selectedDate,
      startTime: toHHmm(startTime),
      endTime: toHHmm(endTime),
      status: "SCHEDULED",
    };

    const masterRes = await fetch(`${API_BASE}/api/ptm/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(masterPayload),
    });

    if (!masterRes.ok) {
      const txt = await masterRes.text().catch(() => "");
      console.log("ALL master create failed:", masterRes.status, txt);
      alert("Failed to schedule (ALL master)");
      return;
    }

    // ✅ 2) Create ONE_TO_ONE child row per teacher (teachers can fetch + join)
    // (Admin UI will hide these automatically because they match master meetingKey)
    for (const t of teachers) {
      const childPayload: any = {
        ptmScope: "ONE_TO_ONE",
        ptmTarget: "ADMIN",
        adminId: String(adminId),
        teacherId: String(t.id),
        meetLink: meetLink.trim(), // later you can make this unique per teacher if needed
        purpose: purpose.trim(),
        ptmDate: selectedDate,
        startTime: toHHmm(startTime),
        endTime: toHHmm(endTime),
        status: "SCHEDULED",
      };

      const childRes = await fetch(`${API_BASE}/api/ptm/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(childPayload),
      });

      if (!childRes.ok) {
        const txt = await childRes.text().catch(() => "");
        console.log("ALL child create failed for teacher:", t.id, childRes.status, txt);
        alert(`Failed while scheduling for teacher ${t.name}`);
        return;
      }
    }

    await fetchAdminPTMs();
    resetForm();
    alert("PTM scheduled for all teachers");
  } catch (e) {
    console.log("Error occurred in PTM scheduling", e);
    alert("Error occurred in PTM scheduling");
  }
}


  // ✅ filter by teacher:
  // - keep ALL master always
  // - keep ONE_TO_ONE when teacher matches
  const scheduledPTMs = useMemo(() => {
    if (!filterTeacherId) return rawPTMs;

    return rawPTMs.filter((p) => {
      const scope = (p.ptmScope || "").toUpperCase();
      if (scope === "ALL") return true;
      return String(p.teacherId || "") === String(filterTeacherId);
    });
  }, [rawPTMs, filterTeacherId]);

  function handleScheduleMode(val: "SINGLE" | "ALL") {
    setScheduleMode(val);
    if (val === "ALL") setSelectedTeacherId("");
  }
  function handleSelectedTeacher(val: string) {
    setSelectedTeacherId(val);
  }
  function handleMeetLink(val: string) {
    setMeetLink(val);
  }
  function handlePurpose(val: string) {
    setPurpose(val);
  }
  function handleSelectedDate(val: string) {
    setSelectedDate(val);
  }
  function handleStartTime(val: string) {
    setStartTime(val);
  }
  function handleEndTime(val: string) {
    setEndTime(val);
  }
  function handleFilterTeacher(val: string) {
    setFilterTeacherId(val);
  }

  return {
    adminId,

    teachers,
    loadingTeachers,

    scheduledPTMs,
    loadingPTMs,

    scheduleMode,
    selectedTeacherId,
    meetLink,
    purpose,
    selectedDate,
    startTime,
    endTime,

    filterTeacherId,

    fetchTeachers,
    fetchAdminPTMs,

    handleScheduleMode,
    handleSelectedTeacher,
    handleMeetLink,
    handlePurpose,
    handleSelectedDate,
    handleStartTime,
    handleEndTime,

    handleFilterTeacher,
    handleSchedule,
  };
}
