import { useState, useReducer, useMemo } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

export type ExamSession = "UNIT_1" | "MID_SEM" | "UNIT_2" | "END";

export type MarksFormState = {
  studentId: string;
  english: string;
  hindi: string;
  math: string;
  science: string;
  generalKnowledge: string; // class <= 5
  socialScience: string;    // class >= 6
  computer: string;
};

export type MarksEntryPayload = {
  studentId: string;
  english: number | null;
  hindi: number | null;
  math: number | null;
  science: number | null;
  gk: number | null;
  socialScience: number | null;
  computer: number | null;
};

export type MarksManualPayload = {
  classId: number;
  examSession: ExamSession;
  resultDate: string;
  entries: MarksEntryPayload[];
};

export type MarksRow = {
  id: number;
  classId: number;
  examSession: ExamSession;
  resultDate: string;

  english: number | null;
  hindi: number | null;
  math: number | null;
  science: number | null;
  socialScience: number | null;
  generalKnowledge: number | null;
  computer: number | null;

  student: any;
};

type Action =
  | { type: "studentId"; payload: string }
  | {
      type:
        | "english"
        | "hindi"
        | "math"
        | "science"
        | "generalKnowledge"
        | "socialScience"
        | "computer";
      payload: string;
    }
  | { type: "reset" }
  | { type: "fillFromRow"; payload: { row: MarksRow; usesGK: boolean } };

const initialState: MarksFormState = {
  studentId: "",
  english: "",
  hindi: "",
  math: "",
  science: "",
  generalKnowledge: "",
  socialScience: "",
  computer: "",
};

function reducer(state: MarksFormState, action: Action): MarksFormState {
  switch (action.type) {
    case "studentId":
      return { ...state, studentId: action.payload };

    case "english":
    case "hindi":
    case "math":
    case "science":
    case "generalKnowledge":
    case "socialScience":
    case "computer":
      return { ...state, [action.type]: action.payload };

    case "fillFromRow": {
      const { row, usesGK } = action.payload;
      return {
        studentId: getStudentId(row),
        english: row.english == null ? "" : String(row.english),
        hindi: row.hindi == null ? "" : String(row.hindi),
        math: row.math == null ? "" : String(row.math),
        science: row.science == null ? "" : String(row.science),
        generalKnowledge: usesGK ? (row.generalKnowledge == null ? "" : String(row.generalKnowledge)) : "",
        socialScience: !usesGK ? (row.socialScience == null ? "" : String(row.socialScience)) : "",
        computer: row.computer == null ? "" : String(row.computer),
      };
    }

    case "reset":
      return initialState;

    default:
      return state;
  }
}

function toNumOrNull(v: string): number | null {
  const t = v.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

async function parseError(res: Response) {
  const data = await res.json().catch(() => ({}));
  return data?.error || data?.message || "REQUEST_FAILED";
}

function getStudentName(row: MarksRow): string {
  const s: any = row?.student || {};
  return s?.stud_name || s?.name || s?.studentName || s?.fullName || s?.studName || "-";
}

function getStudentId(row: MarksRow): string {
  const s: any = row?.student || {};
  return s?.stud_id || s?.studentId || s?.id || s?.student_id || "-";
}

export default function useFuncs() {
  const token = useAppSelector((s) => s.auth.token);
  const profile = useAppSelector((s) => s.auth.profile);

  const [state, dispatch] = useReducer(reducer, initialState);

  const [showManual, setShowManual] = useState(false);
  const [showCSV, setShowCSV] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const [resultDate, setResultDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [examSession, setExamSession] = useState<ExamSession>("UNIT_1");

  const [teacherRows, setTeacherRows] = useState<MarksRow[]>([]);
  const [loadingRows, setLoadingRows] = useState(false);

  // ✅ NEW: edit mode
  const [editingId, setEditingId] = useState<number | null>(null);

  const examSessionOptions: { label: string; value: ExamSession }[] = [
    { label: "Unit 1", value: "UNIT_1" },
    { label: "Mid Sem", value: "MID_SEM" },
    { label: "Unit 2", value: "UNIT_2" },
    { label: "End", value: "END" },
  ];

  // class rule: <=5 GK else SS
  const usesGK = useMemo(() => Number(profile?.tClass) <= 5, [profile]);

  function handleResultDate(val: string) {
    setResultDate(val);
  }

  function handleExamSession(val: ExamSession) {
    setExamSession(val);
  }

  function handleManualShow(val: boolean) {
    setShowManual(val);
  }

  function handleCSVShow(val: boolean) {
    setShowCSV(val);
  }

  function handleESC(e: KeyboardEvent) {
    if (e.key === "Escape") {
      handleManualShow(false);
      handleCSVShow(false);
    }
  }

  // ===================== UPLOAD (manual -> also used for update) =====================
  async function uploadMarksManual(payload: MarksManualPayload) {
    if (!token) throw new Error("NO_TOKEN");

    const res = await fetch("http://localhost:8080/marks/manual", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(await parseError(res));
    return res.json();
  }

  async function handleManualUpload() {
    const classId = Number(profile?.tClass);
    if (!classId || !resultDate || !examSession || !state.studentId.trim()) {
      alert("Class, Exam Session, Date, and Student ID are required");
      return;
    }

    const gk = classId <= 5 ? toNumOrNull(state.generalKnowledge) : null;
    const ss = classId >= 6 ? toNumOrNull(state.socialScience) : null;

    const payload: MarksManualPayload = {
      classId,
      examSession,
      resultDate,
      entries: [
        {
          studentId: state.studentId.trim(),
          english: toNumOrNull(state.english),
          hindi: toNumOrNull(state.hindi),
          math: toNumOrNull(state.math),
          science: toNumOrNull(state.science),
          gk,
          socialScience: ss,
          computer: toNumOrNull(state.computer),
        },
      ],
    };

    try {
      await uploadMarksManual(payload);

      dispatch({ type: "reset" });
      setEditingId(null);
      setShowManual(false);

      await fetchMarksForTeacher();
    } catch (e: any) {
      alert(e?.message ?? "Upload failed");
    }
  }

  async function uploadMarksCsv() {
    if (!csvFile) return;

    const classId = Number(profile?.tClass);
    if (!classId) return alert("No class assigned");
    if (!resultDate) return alert("Please select result date");
    if (!examSession) return alert("Please select exam session");
    if (!token) return alert("No token");

    const fd = new FormData();
    fd.append("file", csvFile);
    fd.append("classId", String(classId));
    fd.append("examSession", examSession);
    fd.append("resultDate", resultDate);

    const res = await fetch("http://localhost:8080/marks/csv", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    if (!res.ok) {
      alert(await parseError(res));
      return;
    }

    setCsvFile(null);
    setShowCSV(false);
    await fetchMarksForTeacher();
  }

  // ===================== FETCH (teacher view) =====================
  async function fetchMarksForTeacher() {
    if (!token) return;
    const classId = Number(profile?.tClass);
    if (!classId) return;

    setLoadingRows(true);
    try {
      const url = `http://localhost:8080/marks/teacher?classId=${classId}&examSession=${examSession}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        alert(await parseError(res));
        setTeacherRows([]);
        return;
      }

      const data = await res.json().catch(() => []);
      setTeacherRows(Array.isArray(data) ? data : []);
    } finally {
      setLoadingRows(false);
    }
  }

  // ===================== DELETE (NEW) =====================
  async function deleteMarksRow(id: number) {
    if (!token) return alert("No token");

    const ok = confirm("Delete this student's marks for this session?");
    if (!ok) return;

    const res = await fetch(`http://localhost:8080/marks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert(await parseError(res));
      return;
    }

    await fetchMarksForTeacher();
  }

  // ===================== EDIT (NEW) =====================
  function startEdit(row: MarksRow) {
    setEditingId(row.id);
    dispatch({ type: "fillFromRow", payload: { row, usesGK } });
    setShowManual(true);
    setShowCSV(false);
  }

  function cancelEdit() {
    setEditingId(null);
    dispatch({ type: "reset" });
    setShowManual(false);
  }

  return {
    profile,

    // session
    examSession,
    examSessionOptions,
    handleExamSession,
    usesGK,

    // form
    state,
    dispatch,

    // manual
    showManual,
    handleManualShow,
    handleManualUpload,

    // csv
    showCSV,
    handleCSVShow,
    csvFile,
    setCsvFile,
    uploadMarksCsv,

    // date
    resultDate,
    handleResultDate,

    // view
    teacherRows,
    loadingRows,
    fetchMarksForTeacher,
    getStudentName,
    getStudentId,

    // edit/delete
    editingId,
    startEdit,
    cancelEdit,
    deleteMarksRow,

    // misc
    handleESC,
  };
}
