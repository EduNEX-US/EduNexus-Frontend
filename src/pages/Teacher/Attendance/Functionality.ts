import { useReducer, useState, useEffect } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

type AttendanceStatus = "Present" | "Absent" | "Late";

interface AttendanceForm {
  className: string;
  studentId: string;
  status: AttendanceStatus;
  date: string;
}

type AttendanceRow = {
  id: string;
  name: string;
  email: string;
  address: string;
  guardian: string;
  status: "PRESENT" | "ABSENT" | "LATE";
};

const initialState: AttendanceForm = {
  className: "",
  studentId: "",
  status: "Present",
  date: "",
};

function reducer(state: AttendanceForm, action: any): AttendanceForm {
  switch (action.type) {
    case "class": return { ...state, className: action.payload };
    case "student": return { ...state, studentId: action.payload };
    case "status": return { ...state, status: action.payload };
    case "date": return { ...state, date: action.payload };
    case "reset": return initialState;
    default: return state;
  }
}

export default function useFuncs() {
  const token = useAppSelector((s) => s.auth.token);
  const [attendanceForm, dispatch] = useReducer(reducer, initialState);

  const [csvFile, setCsvFile] = useState<File | null>(null);

  // ✅ NEW: view attendance list
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [marked, setMarked] = useState<boolean>(false);
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // keep your modal state same
  const [showManual, setShowManual] = useState(false);
  const [showCSV, setShowCSV] = useState(false);

  const handleManualShow = (val: boolean) => setShowManual(val);
  const handleCSVShow = (val: boolean) => setShowCSV(val);

  // ✅ Fetch attendance for date
  async function fetchAttendanceForDate(dateStr: string) {
    const classId = Number(attendanceForm.className);
    if (!token || !classId) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/attendance/class/${classId}?date=${dateStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      console.log(data);
      setMarked(Boolean(data.marked));
      setRows(data.rows ?? []);
    } catch {
      setMarked(false);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  // useEffect(()=>{
  //   fetchAttendanceForDate()
  // },[])
  // ✅ when class changes or date changes → refetch
  useEffect(() => {
    if (attendanceForm.className) {
      fetchAttendanceForDate(selectedDate);
    }
  }, [attendanceForm.className, selectedDate]);

  // ✅ Date filter handler (use in UI date input)
  function handleSelectedDate(val: string) {
    setSelectedDate(val);
  }

  // keep uploadCsv same for now, you’ll connect it later
  const uploadCsv = () => {
    if (!csvFile) return;
    console.log("Uploading CSV:", csvFile);
    setCsvFile(null);
    setShowCSV(false);
  };

  const handleManualUpload = () => {
    if (!attendanceForm.className || !attendanceForm.studentId || !attendanceForm.date) return;
    console.log("Manual Attendance:", attendanceForm);
    dispatch({ type: "reset" });
    setShowManual(false);
  };

  const handleESC = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowManual(false);
      setShowCSV(false);
    }
  };

  return {
    attendanceForm,
    csvFile,
    showManual,
    showCSV,
    dispatch,
    setCsvFile,
    uploadCsv,
    handleManualUpload,
    handleManualShow,
    handleCSVShow,
    handleESC,

    // ✅ NEW exports for view + filter
    selectedDate,
    handleSelectedDate,
    marked,
    rows,
    loading,
    fetchAttendanceForDate,
  };
}
