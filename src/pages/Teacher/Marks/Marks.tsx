import { useState, useEffect } from "react";
import { Section, Div, Span, Button, Input } from "../../../Components/Assembler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFileCsv, faXmark } from "@fortawesome/free-solid-svg-icons";
import useFuncs from "./Functionality";

export default function ManageMarks() {
  const {markForm, handleMarkForm, state, dispatch, primary, setPrimary, handleSearch, dummyData, filteredStudents, uploadCsv, uploadType, setUploadType, setCsvFile, csvFile, showCSV, showManual, handleCSVShow, handleManualShow, handleESC, selectedSubject, handleSelectedSubject} = useFuncs();

  // ESC key close
  useEffect(() => {
    window.addEventListener("keydown", handleESC);
    return () => window.removeEventListener("keydown", handleESC);
  }, []);

  return (
    <Section cn="w-full min-h-screen bg-[#FFF8EE] p-6 overflow-y-auto">

      {/* ===== HEADER ===== */}
      <Div cn="flex justify-between items-center mb-8">
        <Span cn="text-2xl font-bold text-[#7A4A00]">
          Manage Marks
        </Span>

        <Div cn="flex gap-4">
          <Button onClick={() => {
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
          <option>Secondary</option>
        </select>
      </Div>

      {/* ===== TABLE ===== */}
      <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm overflow-hidden">
        <Div cn="grid grid-cols-9 px-4 py-3 bg-amber-100/70 text-sm font-semibold text-[#7A4A00]">
          <Span cn="">Id</Span>
          <Span cn="">Class</Span>
          <Span cn="">Name</Span>
          <Span cn="">English</Span>
          <Span cn="">Hindi</Span>
          <Span cn="">Math</Span>
          <Span cn="">Science</Span>
          <Span cn="">S. Science</Span>
          <Span cn="">Computer</Span>
        </Div>

        <Div cn="p-10 text-center text-amber-600 opacity-70">
          No records found
        </Div>
      </Div>

      {/* ================= MANUAL MODAL ================= */}
      {showManual && (
        <Div cn="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn"
             onClick={() => handleManualShow(false)}>

          <Div
            onClick={(e) => e.stopPropagation()}
            cn="bg-white rounded-2xl p-8 w-[620px] shadow-xl
                       animate-scaleIn"
          >
            <Div cn="flex justify-between items-center mb-6">
              <Span cn="text-xl font-bold text-[#7A4A00]">
                Upload Marks Manually
              </Span>
              <FontAwesomeIcon
                icon={faXmark}
                className="cursor-pointer text-amber-700"
                onClick={() => handleManualShow(false)}
              />
            </Div>

            <Div cn="grid grid-cols-2 gap-4">

  {/* Fixed Fields */}
  <Input
    labelCN="hidden"
    labelTxt="Class"
    forName="Class"
    type="number"
    inpTxt="Class"
    inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
    onChange={(e) => {
      let val = parseInt(e.target.value);
      if (val > 10) val = 10;
      if (val < 1) val = 1;
      setPrimary(val < 6);
    }}
  />

  <Input
    labelCN="hidden"
    labelTxt="ID"
    forName="Id"
    type="number"
    inpTxt="Student ID"
    inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
    onChange={(e) =>
      dispatch({ type: "id", payload: e.target.value })
    }
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
      let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
      dispatch({ type: "eng", payload: val });
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
      let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
      dispatch({ type: "hin", payload: val });
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
      let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
      dispatch({ type: "math", payload: val });
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
      let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
      dispatch({ type: "sci", payload: val });
    }}
  />

  <Input
    labelCN="hidden"
    labelTxt="Social Science"
    forName="Social Science"
    type="number"
    inpTxt="Social Science"
    inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
    value={`${state.socialScience}`}
    onChange={(e) => {
      let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
      dispatch({ type: "ss", payload: val });
    }}
  />

  {/* 🔁 Interchangeable Subject */}
  <Div cn="flex gap-2">
    <select
      value={selectedSubject}
  onChange={(e) => handleSelectedSubject(e.target.value as "computer" | "gk")}
      className="w-1/2 px-3 py-3 rounded-lg border border-amber-200/40 bg-white text-amber-700 focus:ring-2 focus:ring-amber-300 outline-none"
    >
      <option value={`${state.computer}`}>Computer</option>
      <option value={`${state.generalKnowledge}`}>GK</option>
    </select>

    <Input
    labelCN="hidden"
    labelTxt="Marks"
    forName="Marks"
      inpTxt="Marks"
      value={
    selectedSubject === "computer"
      ? `${state.computer}`
      : `${state.generalKnowledge}`
  }
  type="number"
  onChange={(e) => {
    const val = Math.min(100, Math.max(0, Number(e.target.value)));

    dispatch({
        type: selectedSubject === "computer" ? "comp" : "gk",
        payload: val,
      });
    }}
      inpCN="w-1/2 px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
    />
  </Div>

  {/* Date */}
  <input
    type="date"
    className="px-4 py-3 rounded-lg border border-amber-200/40"
  />

  {/* Upload Button */}
  <button className="bg-teal-500 text-white rounded-lg py-3 hover:bg-teal-600 transition">
    Upload
  </button>

</Div>

          </Div>
        </Div>
      )}

      {/* ================= CSV MODAL ================= */}
      {showCSV && (
        <Div cn="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn"
             onClick={() => handleCSVShow(false)}>

          <Div
            onClick={(e) => e.stopPropagation()}
            cn="bg-white rounded-2xl p-8 w-[480px] shadow-xl text-center
                       animate-scaleIn"
          >
            <Div cn="flex justify-between items-center mb-6">
              <Span cn="text-xl font-bold text-[#7A4A00]">
                Upload CSV
              </Span>
              <FontAwesomeIcon
                icon={faXmark}
                className="cursor-pointer text-amber-700"
                onClick={() => handleCSVShow(false)}
              />
            </Div>

            <label
  htmlFor="csv-upload"
  className="border-2 border-dashed border-amber-300 rounded-xl p-6 mb-6
             text-amber-700 flex flex-col items-center justify-center
             cursor-pointer hover:bg-amber-50 transition"
>
  <FontAwesomeIcon icon={faFileCsv} className="text-3xl mb-3" />
  <Span cn="block font-medium">Choose CSV file</Span>

  <input
    id="csv-upload"
    type="file"
    accept=".csv"
    className="hidden"
  />
</label>


            <button className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition">
              Upload CSV
            </button>
          </Div>
        </Div>
      )}

      {/* ===== ANIMATIONS ===== */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>

    </Section>
  );
}
