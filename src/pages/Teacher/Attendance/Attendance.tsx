import { useEffect, useMemo, useState } from "react";
import { Section, Div, Span, Button } from "../../../Components/Assembler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFileCsv,
  faXmark,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import useFuncs, { type AttendanceMonthRow } from "./Functionality.ts";

export default function Attendance() {
  const {
    teacherClassId,

    uploadCsv,
    csvFile,
    setCsvFile,

    yearMonth,
    setYearMonth,

    canGoPrev,
    canGoNext,
    goPrevMonth,
    goNextMonth,

    uploaded,
    notUploadedMsg,

    showCSV,
    handleCSVShow,
    handleESC,

    rows,
    loading,
    error,

    updateStudentMonth,
  } = useFuncs();

  useEffect(() => {
    window.addEventListener("keydown", handleESC);
    return () => window.removeEventListener("keydown", handleESC);
  }, []);

  // ✅ search
  const [search, setSearch] = useState("");
  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const name = (r.name ?? "").toLowerCase();
      const id = (r.studentId ?? "").toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [rows, search]);

  // ✅ edit modal
  const [showEdit, setShowEdit] = useState(false);
  const [editRow, setEditRow] = useState<AttendanceMonthRow | null>(null);

  // NOTE: totalDays is shown but NOT editable now
  const [editPresent, setEditPresent] = useState<string>("");
  const [editAbsent, setEditAbsent] = useState<string>("");
  const [editLate, setEditLate] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [editErr, setEditErr] = useState<string>("");

  function openEdit(r: AttendanceMonthRow) {
    setEditErr("");

    if (r.uploaded === false || uploaded === false) return;

    setEditRow(r);
    setEditPresent(String(r.present ?? 0));
    setEditAbsent(String(r.absent ?? 0));
    setEditLate(String(r.late ?? 0));
    setShowEdit(true);
  }

  function closeEdit() {
    setShowEdit(false);
    setEditRow(null);
    setEditErr("");
    setSaving(false);
  }

  function toNonNegInt(s: string) {
    const n = Number(s);
    if (!Number.isFinite(n)) return null;
    if (!Number.isInteger(n)) return null;
    if (n < 0) return null;
    return n;
  }

  async function saveEdit() {
    if (!editRow) return;

    const present = toNonNegInt(editPresent);
    const absent = toNonNegInt(editAbsent);
    const late = toNonNegInt(editLate);

    if (present === null || absent === null || late === null) {
      setEditErr("Present / Absent / Late must be non-negative whole numbers");
      return;
    }

    const totalDays = editRow.totalDays ?? 0;

    // ✅ IMPORTANT RULE:
    // combined must NOT be greater than totalDays
    if (present + absent + late > totalDays) {
      setEditErr("New Attendance Values Sum Up To More Than Total Days");
      return;
    }

    try {
      setSaving(true);
      setEditErr("");

      // ✅ totalDays not sent -> backend will keep existing totalDays
      await updateStudentMonth(editRow.studentId, editRow.yearMonth, {
        present,
        absent,
        late,
      });

      closeEdit();
    } catch (e: any) {
      setEditErr(e?.message ?? "Failed to update attendance");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Section cn="w-full min-h-screen bg-orange-50 p-6 overflow-y-auto">
      {/* ===== HEADER ===== */}
      <Div cn="flex justify-between items-center mb-8">
        <Span cn="text-2xl font-bold text-amber-900">Manage Attendance</Span>

        <Div cn="flex gap-4">
          <Button
            onClick={() => handleCSVShow(true)}
            cn="px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition"
          >
            Upload CSV
          </Button>
        </Div>
      </Div>

      {/* ===== SEARCH + MONTH TOGGLING ===== */}
      <Div cn="flex gap-4 mb-6">
        <Div cn="flex-1 relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for student..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-amber-200/40 shadow-sm focus:ring-2 focus:ring-amber-300 outline-none"
          />
        </Div>

        <Div cn="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-amber-200/40 shadow-sm text-amber-700">
          <button
            className={`px-3 py-1 rounded-lg border border-amber-200/60 ${
              canGoPrev ? "hover:bg-amber-50" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={goPrevMonth}
            disabled={!canGoPrev}
            title="Previous month"
          >
            ◀
          </button>

          <input
            type="month"
            value={yearMonth}
            onChange={(e) => setYearMonth(e.target.value)}
            className="bg-transparent outline-none text-amber-800 font-medium"
            style={{ width: 120 }}
          />

          <button
            className={`px-3 py-1 rounded-lg border border-amber-200/60 ${
              canGoNext ? "hover:bg-amber-50" : "opacity-50 cursor-not-allowed"
            }`}
            onClick={goNextMonth}
            disabled={!canGoNext}
            title="Next month"
          >
            ▶
          </button>
        </Div>
      </Div>

      <Div cn="mb-3 text-xs text-amber-700">
        {teacherClassId ? `Class ${teacherClassId}` : "No class assigned"}
      </Div>

      {/* ===== TABLE ===== */}
      <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
        <Div cn="grid grid-cols-8 px-4 py-3 bg-amber-100/70 text-sm font-semibold text-amber-900">
          <Span cn="">Student</Span>
          <Span cn="">Student ID</Span>
          <Span cn="text-center">Total</Span>
          <Span cn="text-center">Present</Span>
          <Span cn="text-center">Absent</Span>
          <Span cn="text-center">Late</Span>
          <Span cn="text-center">Month</Span>
          <Span cn="text-center">Edit</Span>
        </Div>

        {loading ? (
          <Div cn="p-10 text-center text-amber-700">Loading attendance...</Div>
        ) : error ? (
          <Div cn="p-10 text-center text-red-700">{error}</Div>
        ) : uploaded === false ? (
          <Div cn="p-10 text-center text-amber-600 opacity-70">
            {notUploadedMsg || "Attendance not uploaded for this month"}
          </Div>
        ) : filteredRows.length === 0 ? (
          <Div cn="p-10 text-center text-amber-600 opacity-70">
            No attendance records found
          </Div>
        ) : (
          <Div cn="divide-y divide-amber-200/40">
            {filteredRows.map((r) => (
              <Div
                key={`${r.studentId}-${r.yearMonth}`}
                cn="grid grid-cols-8 px-4 py-3 text-sm text-amber-900 hover:bg-amber-100/30 transition"
              >
                <Span cn="font-medium">{r.name}</Span>
                <Span cn="">{r.studentId}</Span>
                <Span cn="text-center">{r.totalDays ?? "-"}</Span>
                <Span cn="text-center">{r.present ?? "-"}</Span>
                <Span cn="text-center">{r.absent ?? "-"}</Span>
                <Span cn="text-center">{r.late ?? "-"}</Span>
                <Span cn="text-center">{r.yearMonth}</Span>

                <Div cn="flex justify-center">
                  <button
                    className={`px-3 py-1 rounded-lg border border-amber-200/60 ${
                      r.uploaded === false
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-amber-50"
                    }`}
                    disabled={r.uploaded === false}
                    title={
                      r.uploaded === false
                        ? "Attendance not uploaded for this month"
                        : "Edit"
                    }
                    onClick={() => openEdit(r)}
                  >
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                </Div>
              </Div>
            ))}
          </Div>
        )}
      </Div>

      {/* ================= EDIT MODAL ================= */}
      {showEdit && editRow && (
        <Div
          cn="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn"
          onClick={closeEdit}
        >
          <Div
            onClick={(e) => e.stopPropagation()}
            cn="bg-white rounded-2xl p-8 w-[560px] shadow-xl animate-scaleIn"
          >
            <Div cn="flex justify-between items-center mb-4">
              <Div>
                <Span cn="text-xl font-bold text-amber-900">Edit Attendance</Span>
                <Div cn="text-xs text-amber-700 mt-1">
                  {editRow.name} • {editRow.studentId} • {editRow.yearMonth}
                </Div>
              </Div>

              <FontAwesomeIcon
                icon={faXmark}
                className="cursor-pointer text-amber-700"
                onClick={closeEdit}
              />
            </Div>

            {/* Total Days (read-only) */}
            <Div cn="mb-4 text-sm text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Total Days:{" "}
              <Span cn="font-semibold">{editRow.totalDays}</Span>
              {/* <Span cn="text-amber-700"> • You can only edit Present/Absent/Late</Span> */}
            </Div>

            {editErr && (
              <Div cn="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {editErr}
              </Div>
            )}

            <Div cn="grid grid-cols-3 gap-4">
              <Div cn="flex flex-col gap-1">
                <Span cn="text-xs font-semibold text-amber-900">Present</Span>
                <input
                  value={editPresent}
                  onChange={(e) => setEditPresent(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-amber-200/40 outline-none focus:ring-2 focus:ring-amber-300"
                  inputMode="numeric"
                />
              </Div>

              <Div cn="flex flex-col gap-1">
                <Span cn="text-xs font-semibold text-amber-900">Absent</Span>
                <input
                  value={editAbsent}
                  onChange={(e) => setEditAbsent(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-amber-200/40 outline-none focus:ring-2 focus:ring-amber-300"
                  inputMode="numeric"
                />
              </Div>

              <Div cn="flex flex-col gap-1">
                <Span cn="text-xs font-semibold text-amber-900">Late</Span>
                <input
                  value={editLate}
                  onChange={(e) => setEditLate(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-amber-200/40 outline-none focus:ring-2 focus:ring-amber-300"
                  inputMode="numeric"
                />
              </Div>

              <Button
                disabled={saving}
                onClick={saveEdit}
                cn={`col-span-3 rounded-lg py-3 transition text-white ${
                  saving
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600"
                }`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </Div>
          </Div>
        </Div>
      )}

      {/* ================= CSV MODAL ================= */}
      {showCSV && (
        <Div
          cn="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn"
          onClick={() => handleCSVShow(false)}
        >
          <Div
            onClick={(e) => e.stopPropagation()}
            cn="bg-white rounded-2xl p-8 w-[480px] shadow-xl text-center animate-scaleIn"
          >
            <Div cn="flex justify-between items-center mb-6">
              <Span cn="text-xl font-bold text-amber-900">
                Upload Attendance CSV
              </Span>
              <FontAwesomeIcon
                icon={faXmark}
                className="cursor-pointer text-amber-700"
                onClick={() => handleCSVShow(false)}
              />
            </Div>

            <input
              type="month"
              value={yearMonth}
              onChange={(e) => setYearMonth(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-amber-200/40 mb-4 outline-none focus:ring-2 focus:ring-amber-300"
            />

            <label
              htmlFor="csv-upload"
              className="
                w-full border-2 border-dashed border-amber-300 rounded-xl p-6
                text-amber-700 flex flex-col items-center justify-center
                cursor-pointer hover:bg-amber-50 transition
              "
            >
              <FontAwesomeIcon icon={faFileCsv} className="text-3xl mb-3" />
              <Span cn="font-medium">
                {csvFile ? csvFile.name : "Choose CSV file"}
              </Span>

              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setCsvFile(file);
                }}
              />
            </label>

            <Button
              disabled={!csvFile}
              cn={`px-6 py-3 mt-8 rounded-lg text-lg text-white transition ${
                csvFile
                  ? "bg-teal-500 hover:bg-teal-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              onClick={uploadCsv}
            >
              Upload CSV
            </Button>
          </Div>
        </Div>
      )}
    </Section>
  );
}
