import { useEffect } from "react";
import { Section, Div, Span, Button, Input } from "../../../Components/Assembler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFileCsv,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import useFuncs from "./Functionality.ts";

export default function Attendance() {
  const {
    attendanceForm,
    dispatch,
    uploadCsv,
    csvFile,
    setCsvFile,
    showManual,
    showCSV,
    handleManualShow,
    handleCSVShow,
    handleESC,
  } = useFuncs();

  // ESC to close modal
  useEffect(() => {
    window.addEventListener("keydown", handleESC);
    return () => window.removeEventListener("keydown", handleESC);
  }, []);

  return (
    <Section cn="w-full min-h-screen bg-orange-50 p-6 overflow-y-auto">

      {/* ===== HEADER ===== */}
      <Div cn="flex justify-between items-center mb-8">
        <Span cn="text-2xl font-bold text-amber-900">
          Manage Attendance
        </Span>

        <Div cn="flex gap-4">
          <Button
            onClick={() => {
              handleManualShow(true);
              handleCSVShow(false);
            }}
            cn="px-4 py-2 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-100 transition"
          >
            Upload Manually
          </Button>

          <Button
            onClick={() => {
              handleCSVShow(true);
              handleManualShow(false);
            }}
            cn="px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition"
          >
            Upload CSV
          </Button>
        </Div>
      </Div>

      {/* ===== SEARCH ===== */}
      <Div cn="flex gap-4 mb-6">
        <Div cn="flex-1 relative">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400"
          />
          <input
            placeholder="Search for student..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-amber-200/40 shadow-sm focus:ring-2 focus:ring-amber-300 outline-none"
          />
        </Div>

        <select className="px-4 py-3 rounded-xl bg-white border border-amber-200/40 shadow-sm text-amber-700">
          <option>Class</option>
        </select>
      </Div>

      {/* ===== TABLE PLACEHOLDER ===== */}
      <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
        <Div cn="grid grid-cols-5 px-4 py-3 bg-amber-100/70 text-sm font-semibold text-amber-900">
          <Span cn="">Id</Span>
          <Span cn="">Class</Span>
          <Span cn="">Name</Span>
          <Span cn="">Status</Span>
          <Span cn="">Date</Span>
        </Div>

        <Div cn="p-10 text-center text-amber-600 opacity-70">
          No attendance records found
        </Div>
      </Div>

      {/* ================= MANUAL MODAL ================= */}
      {showManual && (
        <Div
          cn="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn"
          onClick={() => handleManualShow(false)}
        >
          <Div
            onClick={(e) => e.stopPropagation()}
            cn="bg-white rounded-2xl p-8 w-[560px] shadow-xl animate-scaleIn"
          >
            <Div cn="flex justify-between items-center mb-6">
              <Span cn="text-xl font-bold text-amber-900">
                Upload Attendance Manually
              </Span>
              <FontAwesomeIcon
                icon={faXmark}
                className="cursor-pointer text-amber-700"
                onClick={() => handleManualShow(false)}
              />
            </Div>

            <Div cn="grid grid-cols-2 gap-4">
              <Input
                labelCN="hidden"
                labelTxt="Class"
                forName="Class"
                inpTxt="Class"
                type="text"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40"
              />

              <Input
                labelCN="hidden"
                labelTxt="ID"
                forName="ID"
                inpTxt="Student ID"
                type="number"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40"
              />

              <select className="px-4 py-3 rounded-lg border border-amber-200/40">
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
              </select>

              <input
                type="date"
                className="px-4 py-3 rounded-lg border border-amber-200/40"
              />

              <Button
              onClick={()=>{}}
                cn="col-span-2 bg-teal-500 text-white rounded-lg py-3 hover:bg-teal-600 transition"
              >
                Upload Attendance
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
