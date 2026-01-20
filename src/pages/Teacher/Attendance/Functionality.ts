import { useReducer, useState, useEffect } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

type AttendanceStatus = "Present" | "Absent" | "Late";

interface AttendanceForm {
  studentId: string;
  status: AttendanceStatus;
  date: string;
}

// ✅ matches backend AttendanceTeacherRowDTO (/attendance/teacher/students)
export type AttendanceMonthRow = {
  studentId: string;
  name: string;
  email: string;
  address: string;
  guardian: string;
  mobile?: string;

  classId: number;
  yearMonth: string;

  totalDays: number | null;
  present: number | null;
  absent: number | null;
  late: number | null;

  uploaded: boolean;
};

const initialState: AttendanceForm = {
  studentId: "",
  status: "Present",
  date: "",
};

function reducer(state: AttendanceForm, action: any): AttendanceForm {
  switch (action.type) {
    case "student":
      return { ...state, studentId: action.payload };
    case "status":
      return { ...state, status: action.payload };
    case "date":
      return { ...state, date: action.payload };
    case "reset":
      return initialState;
    default:
      return state;
  }
}

// ✅ helper: YYYY-MM
function currentMonthValue() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}

function toMonthIndex(yyyyMm: string) {
  const [y, m] = yyyyMm.split("-").map(Number);
  return y * 12 + (m - 1); // 0-based
}

function fromMonthIndex(idx: number) {
  const y = Math.floor(idx / 12);
  const m = (idx % 12) + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

// session starts in April and ends in March
function sessionStartEnd(today: Date) {
  const y = today.getFullYear();
  const m = today.getMonth() + 1;

  // if today is Jan/Feb/Mar => session started last year April
  const startYear = m <= 3 ? y - 1 : y;
  const start = `${startYear}-04`;
  const end = `${startYear + 1}-03`;

  return { start, end };
}

export default function useFuncs() {
  const token = useAppSelector((s) => s.auth.token);
  const profile = useAppSelector((s) => s.auth.profile);

  // ✅ class from teacher redux profile
  const teacherClassId = Number((profile as any)?.tClass ?? 0) || 0;

  const [attendanceForm, dispatch] = useReducer(reducer, initialState);

  const [csvFile, setCsvFile] = useState<File | null>(null);

  // ✅ Month picker (also used for fetch + upload)
  const [yearMonth, setYearMonth] = useState<string>(currentMonthValue());

  // modal state
  const [showManual, setShowManual] = useState(false);
  const [showCSV, setShowCSV] = useState(false);

  const handleManualShow = (val: boolean) => setShowManual(val);
  const handleCSVShow = (val: boolean) => setShowCSV(val);

  // Month navigation boundaries (April -> March)
  const { start: minMonth, end: maxMonth } = sessionStartEnd(new Date());
  const canGoPrev = toMonthIndex(yearMonth) > toMonthIndex(minMonth);
  const canGoNext = toMonthIndex(yearMonth) < toMonthIndex(maxMonth);

  function goPrevMonth() {
    if (!canGoPrev) return;
    setYearMonth(fromMonthIndex(toMonthIndex(yearMonth) - 1));
  }

  function goNextMonth() {
    if (!canGoNext) return;
    setYearMonth(fromMonthIndex(toMonthIndex(yearMonth) + 1));
  }

  // ✅ Monthly teacher rows (table)
  const [rows, setRows] = useState<AttendanceMonthRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // status messaging
  const [uploaded, setUploaded] = useState<boolean | null>(null); // null=loading/unknown
  const [notUploadedMsg, setNotUploadedMsg] = useState<string>("");

  // For UI label
  const marked = rows.length > 0;

  // ✅ Fetch monthly list (always returns students; each row says uploaded true/false)
  async function fetchAttendanceForMonth(month: string) {
    if (!token) return;
    if (!teacherClassId) {
      setError("No class assigned to teacher");
      return;
    }

    setLoading(true);
    setError("");
    setNotUploadedMsg("");
    setUploaded(null);

    try {
      const url = `http://localhost:8080/attendance/teacher/students?classId=${encodeURIComponent(
        teacherClassId
      )}&yearMonth=${encodeURIComponent(month)}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ([]));

      if (!res.ok) {
        setRows([]);
        setUploaded(false);
        setError((data as any)?.error ?? `Failed (${res.status})`);
        return;
      }

      const arr = Array.isArray(data) ? (data as AttendanceMonthRow[]) : [];
      setRows(arr);

      // if every row is uploaded=false => month not uploaded
      const anyUploaded = arr.some((r) => r.uploaded === true);
      setUploaded(anyUploaded);
      if (!anyUploaded) setNotUploadedMsg("Attendance not uploaded for this month");
    } catch (e: any) {
      setRows([]);
      setUploaded(false);
      setError(e?.message ?? "Network error while fetching attendance");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Auto fetch when token/class/month ready
  useEffect(() => {
    if (!token || !teacherClassId) return;
    fetchAttendanceForMonth(yearMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, teacherClassId, yearMonth]);

  // ✅ Upload CSV (class from profile + yearMonth + file)
  async function uploadCsv() {
    if (!token) throw new Error("NO_TOKEN");
    if (!teacherClassId) throw new Error("NO_CLASS_ASSIGNED");
    if (!csvFile) return;

    try {
      setLoading(true);
      setError("");

      const fd = new FormData();
      fd.append("classId", String(teacherClassId));
      fd.append("yearMonth", yearMonth); // ✅ MUST MATCH controller param name
      fd.append("file", csvFile);

      const res = await fetch("http://localhost:8080/attendance/csv", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError((data as any)?.error ?? `CSV upload failed (${res.status})`);
        return;
      }

      // ✅ close modal + reset
      setCsvFile(null);
      setShowCSV(false);

      // ✅ refresh month list
      fetchAttendanceForMonth(yearMonth);
    } catch {
      setError("Network error while uploading CSV");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Update a single student's attendance for the month (PUT /attendance/teacher/{studentId}/{yearMonth}?classId=)
  async function updateStudentMonth(
    studentId: string,
    month: string,
    payload: { totalDays?: number; present?: number; absent?: number; late?: number }
  ) {
    if (!token) throw new Error("NO_TOKEN");
    if (!teacherClassId) throw new Error("NO_CLASS_ASSIGNED");
    if (!studentId) throw new Error("NO_STUDENT_ID");

    try {
      setLoading(true);
      setError("");

      const url = `http://localhost:8080/attendance/teacher/${encodeURIComponent(
        studentId
      )}/${encodeURIComponent(month)}?classId=${encodeURIComponent(teacherClassId)}`;

      const res = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError((data as any)?.error ?? `Update failed (${res.status})`);
        throw new Error((data as any)?.error ?? "UPDATE_FAILED");
      }

      // refresh list after update
      await fetchAttendanceForMonth(month);
      return data;
    } finally {
      setLoading(false);
    }
  }

  const handleManualUpload = () => {
    setShowManual(false);
    dispatch({ type: "reset" });
  };

  const handleESC = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowManual(false);
      setShowCSV(false);
    }
  };

  return {
    teacherClassId,

    attendanceForm,
    dispatch,

    // ✅ csv + month
    csvFile,
    setCsvFile,
    yearMonth,
    setYearMonth,

    showManual,
    showCSV,
    handleManualShow,
    handleCSVShow,
    handleESC,

    uploadCsv,
    handleManualUpload,

    // ✅ monthly table state
    rows,
    marked,
    loading,
    error,

    // ✅ fetch + status
    fetchAttendanceForMonth,
    uploaded,
    notUploadedMsg,

    // ✅ month navigation
    canGoPrev,
    canGoNext,
    goPrevMonth,
    goNextMonth,
    minMonth,
    maxMonth,

    // ✅ update student
    updateStudentMonth,
  };
}
