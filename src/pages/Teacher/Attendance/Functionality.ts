import { useReducer, useState } from "react";

/* ================= TYPES ================= */

type AttendanceStatus = "Present" | "Absent" | "Late";

interface AttendanceForm {
  className: string;
  studentId: string;
  status: AttendanceStatus;
  date: string;
}

type Action =
  | { type: "class"; payload: string }
  | { type: "student"; payload: string }
  | { type: "status"; payload: AttendanceStatus }
  | { type: "date"; payload: string }
  | { type: "reset" };

/* ================= REDUCER ================= */

const initialState: AttendanceForm = {
  className: "",
  studentId: "",
  status: "Present",
  date: "",
};

function reducer(state: AttendanceForm, action: Action): AttendanceForm {
  switch (action.type) {
    case "class":
      return { ...state, className: action.payload };
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

/* ================= HOOK ================= */

export default function useFuncs() {
  const [attendanceForm, dispatch] = useReducer(reducer, initialState);

  /* ---------- CSV ---------- */
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const uploadCsv = () => {
    if (!csvFile) return;

    // TODO: connect API
    console.log("Uploading CSV:", csvFile);

    setCsvFile(null);
    setShowCSV(false);
  };

  /* ---------- MODALS ---------- */
  const [showManual, setShowManual] = useState(false);
  const [showCSV, setShowCSV] = useState(false);

  const handleManualShow = (val: boolean) => setShowManual(val);
  const handleCSVShow = (val: boolean) => setShowCSV(val);

  /* ---------- MANUAL SUBMIT ---------- */
  const handleManualUpload = () => {
    if (
      !attendanceForm.className ||
      !attendanceForm.studentId ||
      !attendanceForm.date
    )
      return;

    // TODO: connect API
    console.log("Manual Attendance:", attendanceForm);

    dispatch({ type: "reset" });
    setShowManual(false);
  };

  /* ---------- ESC KEY ---------- */
  const handleESC = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowManual(false);
      setShowCSV(false);
    }
  };

  return { attendanceForm, csvFile, showManual, showCSV, dispatch, setCsvFile, uploadCsv, handleManualUpload, handleManualShow, handleCSVShow, handleESC };
}
