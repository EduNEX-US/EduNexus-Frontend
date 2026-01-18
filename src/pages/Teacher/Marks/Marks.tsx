// ========================= ManageMarks.tsx (COPY-PASTE WHOLE) =========================
import { useEffect } from "react";
import { Section, Div, Span, Button, Input } from "../../../Components/Assembler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileCsv, faXmark } from "@fortawesome/free-solid-svg-icons";
import useFuncs from "./Functionality";

export default function ManageMarks() {
  const {
    profile,

    handleManualUpload,

    examSession,
    examSessionOptions,
    handleExamSession,

    resultDate,
    handleResultDate,

    state,
    dispatch,

    uploadMarksCsv,
    setCsvFile,
    csvFile,

    showCSV,
    showManual,
    handleCSVShow,
    handleManualShow,
    handleESC,

    // view
    teacherRows,
    loadingRows,
    fetchMarksForTeacher,
    usesGK,
    getStudentName,
    getStudentId,

    // edit/delete
    editingId,
    startEdit,
    cancelEdit,
    deleteMarksRow,
  } = useFuncs();

  useEffect(() => {
    window.addEventListener("keydown", handleESC);
    return () => window.removeEventListener("keydown", handleESC);
  }, []);

  useEffect(() => {
    if (profile?.tClass) fetchMarksForTeacher();
  }, [examSession, profile?.tClass]);

  return (
    <Section cn="w-full min-h-screen bg-[#FFF8EE] p-6 overflow-y-auto">
      {/* ===== HEADER ===== */}
      <Div cn="flex justify-between items-center mb-8">
        <Span cn="text-2xl font-bold text-[#7A4A00]">Manage Marks</Span>

        <Div cn="flex gap-3 items-center">
          <Button
            onClick={() => fetchMarksForTeacher()}
            cn="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition cursor-pointer"
          >
            {loadingRows ? "Loading..." : "Refresh"}
          </Button>

          <Button
            onClick={() => {
              handleManualShow(true);
              handleCSVShow(false);
            }}
            cn="px-4 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-100 transition cursor-pointer"
          >
            Upload Manually
          </Button>

          <Button
            onClick={() => {
              handleCSVShow(true);
              handleManualShow(false);
            }}
            cn="px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition cursor-pointer"
          >
            Upload CSV
          </Button>
        </Div>
      </Div>

      {/* ===== SEARCH + SESSION ===== */}
      <Div cn="flex gap-4 mb-6">
        <Div cn="flex-1 relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400"
          />
          <Input
            labelCN="hidden"
            labelTxt="Search"
            forName="search"
            onChange={() => {}}
            type="text"
            inpTxt="Search for student..."
            inpCN="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-amber-200/40 shadow-sm focus:ring-2 focus:ring-amber-300 outline-none"
          />
        </Div>

        <select
          value={examSession}
          onChange={(e) => handleExamSession(e.target.value as any)}
          className="bg-orange-400 px-3 py-2 font-semibold text-orange-50 rounded outline-none"
        >
          {examSessionOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Div>

      {/* ===== TABLE ===== */}
      <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
        {/* ✅ removed Class column, added Actions */}
        <Div cn="grid grid-cols-9 px-4 py-3 bg-amber-100/70 text-sm font-semibold text-[#7A4A00]">
          <Span cn="">Student ID</Span>
          <Span cn="">Name</Span>
          <Span cn="">English</Span>
          <Span cn="">Hindi</Span>
          <Span cn="">Math</Span>
          <Span cn="">Science</Span>
          <Span cn="">{usesGK ? "GK" : "S. Science"}</Span>
          <Span cn="">Computer</Span>
          <Span cn="text-right pr-2">Actions</Span>
        </Div>

        {loadingRows ? (
          <Div cn="p-10 text-center text-amber-700">Loading...</Div>
        ) : teacherRows.length === 0 ? (
          <Div cn="p-10 text-center text-amber-600 opacity-70">No records found</Div>
        ) : (
          <Div cn="divide-y divide-amber-200/40">
            {teacherRows.map((row) => (
              <Div
                key={row.id}
                cn="grid grid-cols-9 px-4 py-3 text-sm text-[#5a3a00] bg-white/60 items-center"
              >
                <Span cn="truncate">{getStudentId(row)}</Span>
                <Span cn="truncate">{getStudentName(row)}</Span>

                <Span cn="">{row.english ?? "-"}</Span>
                <Span cn="">{row.hindi ?? "-"}</Span>
                <Span cn="">{row.math ?? "-"}</Span>
                <Span cn="">{row.science ?? "-"}</Span>
                <Span cn="">{usesGK ? (row.generalKnowledge ?? "-") : (row.socialScience ?? "-")}</Span>
                <Span cn="">{row.computer ?? "-"}</Span>

                <Div cn="flex justify-end gap-2">
                  <Button
                    cn="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition cursor-pointer"
                    onClick={() => startEdit(row)}
                  >
                    Edit
                  </Button>
                  <Button
                    cn="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
                    onClick={() => deleteMarksRow(row.id)}
                  >
                    Delete
                  </Button>
                </Div>
              </Div>
            ))}
          </Div>
        )}
      </Div>

      {/* ================= MANUAL MODAL ================= */}
      {showManual && (
        <Div
          cn="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn"
          onClick={() => (editingId ? cancelEdit() : handleManualShow(false))}
        >
          <Div
            onClick={(e) => e.stopPropagation()}
            cn="bg-white rounded-2xl p-8 w-[620px] shadow-xl animate-scaleIn"
          >
            <Div cn="flex justify-between items-center mb-6">
              <Div cn="flex items-center gap-3">
                <Span cn="text-xl font-bold text-[#7A4A00]">
                  {editingId ? "Edit Marks" : "Upload Marks Manually" }
                </Span>

                {/* ✅ Exam Session Select (Manual) */}
                {!editingId && <select
                  value={examSession}
                  onChange={(e) => handleExamSession(e.target.value as any)}
                  className="bg-orange-400 px-2 py-1 font-semibold text-orange-50 rounded outline-none"
                >
                  {examSessionOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>}
              </Div>
              

              <FontAwesomeIcon
                icon={faXmark}
                className="cursor-pointer text-amber-700"
                onClick={() => (editingId ? cancelEdit() : handleManualShow(false))}
              />
            </Div>

            <Div cn="grid grid-cols-2 gap-4">
              <Input
                labelCN="hidden"
                labelTxt="ID"
                forName="Id"
                type="text"
                inpTxt="Student ID"
                inpCN={`px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none ${
                  editingId ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                value={state.studentId}
                onChange={(e) => dispatch({ type: "studentId", payload: e.target.value })}
              />

              <Input
                labelCN="hidden"
                labelTxt="English"
                forName="English"
                type="number"
                inpTxt="English"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={`${state.english}`}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") return dispatch({ type: "english", payload: "" });
                  const val = Math.min(100, Math.max(0, Number(raw)));
                  dispatch({ type: "english", payload: `${val}` });
                }}
              />

              <Input
                labelCN="hidden"
                labelTxt="Hindi"
                forName="Hindi"
                type="number"
                inpTxt="Hindi"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={`${state.hindi}`}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") return dispatch({ type: "hindi", payload: "" });
                  const val = Math.min(100, Math.max(0, Number(raw)));
                  dispatch({ type: "hindi", payload: `${val}` });
                }}
              />

              <Input
                labelCN="hidden"
                labelTxt="Math"
                forName="Math"
                type="number"
                inpTxt="Math"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={`${state.math}`}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") return dispatch({ type: "math", payload: "" });
                  const val = Math.min(100, Math.max(0, Number(raw)));
                  dispatch({ type: "math", payload: `${val}` });
                }}
              />

              <Input
                labelCN="hidden"
                labelTxt="Science"
                forName="Science"
                type="number"
                inpTxt="Science"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={`${state.science}`}
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") return dispatch({ type: "science", payload: "" });
                  const val = Math.min(100, Math.max(0, Number(raw)));
                  dispatch({ type: "science", payload: `${val}` });
                }}
              />

              {Number(profile?.tClass) >= 6 ? (
                <Input
                  labelCN="hidden"
                  labelTxt="Social Science"
                  forName="Social Science"
                  type="number"
                  inpTxt="Social Science"
                  inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                  value={`${state.socialScience}`}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") return dispatch({ type: "socialScience", payload: "" });
                    const val = Math.min(100, Math.max(0, Number(raw)));
                    dispatch({ type: "socialScience", payload: `${val}` });
                  }}
                />
              ) : (
                <Input
                  labelCN="hidden"
                  labelTxt="General Knowledge"
                  forName="General Knowledge"
                  type="number"
                  inpTxt="General Knowledge"
                  inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                  value={`${state.generalKnowledge}`}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "") return dispatch({ type: "generalKnowledge", payload: "" });
                    const val = Math.min(100, Math.max(0, Number(raw)));
                    dispatch({ type: "generalKnowledge", payload: `${val}` });
                  }}
                />
              )}

              <Input
                labelCN="hidden"
                labelTxt="Computer"
                forName="Computer"
                inpTxt="Computer"
                value={`${state.computer}`}
                type="number"
                onChange={(e) => {
                  const raw = e.target.value;
                  if (raw === "") return dispatch({ type: "computer", payload: "" });
                  const val = Math.min(100, Math.max(0, Number(raw)));
                  dispatch({ type: "computer", payload: `${val}` });
                }}
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
              />

              <input
                type="date"
                value={resultDate}
                onChange={(e) => handleResultDate(e.target.value.split("T")[0])}
                className="px-4 py-3 rounded-lg border border-amber-200/40"
              />

              <Div cn="col-span-2 flex justify-center gap-3 mt-4">
                {editingId && (
                  <Button
                    cn="bg-gray-500 text-white rounded-lg py-3 cursor-pointer px-10 hover:bg-gray-600 transition"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  cn="bg-teal-500 text-white rounded-lg py-3 cursor-pointer px-10 hover:bg-teal-600 transition"
                  onClick={handleManualUpload}
                >
                  {editingId ? "Update" : "Upload"}
                </Button>
              </Div>
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
              <Span cn="text-2xl font-bold text-[#7A4A00]">Upload CSV</Span>
              <Div cn="flex items-center gap-2">
                <input
                  type="date"
                  value={resultDate}
                  onChange={(e) => handleResultDate(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
                <FontAwesomeIcon
                  icon={faXmark}
                  className="cursor-pointer text-amber-700"
                  onClick={() => handleCSVShow(false)}
                />
              </Div>
            </Div>

            <label
              htmlFor="csv-upload"
              className="
                w-full border-2 border-dashed border-amber-300 rounded-xl p-6
                text-amber-700 flex flex-col items-center justify-center
                cursor-pointer hover:bg-amber-50 transition
              "
            >
              <FontAwesomeIcon icon={faFileCsv} className="text-3xl mb-3" />
              <Span cn="font-medium">{csvFile ? csvFile.name : "Choose CSV file"}</Span>

              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.type !== "text/csv" && !file.name.toLowerCase().endsWith(".csv")) {
                    alert("Only CSV files are allowed");
                    return;
                  }

                  setCsvFile(file);
                }}
              />
            </label>

            <Button
              disabled={!csvFile}
              cn={`
                px-6 py-3 mt-8 rounded-lg text-lg text-white transition
                ${
                  csvFile
                    ? "bg-teal-500 hover:bg-teal-600 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
              onClick={uploadMarksCsv}
            >
              Upload CSV
            </Button>
          </Div>
        </Div>
      )}
    </Section>
  );
}
