import React, { useEffect } from "react";
import useFuncs from "./Functionality"; // <-- adjust path
// If your file name is different, import accordingly

export default function AttendanceView() {
  const {
    attendanceForm,
    dispatch,

    // modal state (keep same)
    showManual,
    showCSV,
    handleManualShow,
    handleCSVShow,

    // NEW view data
    selectedDate,
    handleSelectedDate,
    marked,
    rows,
    loading,
    fetchAttendanceForDate,
  } = useFuncs();

  // optional: press escape to close modals (if you wired handleESC to window elsewhere ignore this)
  useEffect(() => {
    // no-op: keep if needed
  }, []);

  const classId = attendanceForm.className;

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* शीर्ष controls */}
      <div className="flex flex-col md:flex-row gap-3 md:items-end md:justify-between">
        {/* Class select/input */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-amber-900">Class</label>
          <input
            className="px-3 py-2 rounded-lg border border-amber-300 bg-yellow-50 outline-none focus:ring-2 focus:ring-amber-300"
            placeholder="Enter class id (e.g., 1)"
            value={attendanceForm.className}
            onChange={(e) =>
              dispatch({ type: "class", payload: e.target.value })
            }
          />
          <p className="text-xs text-amber-700">
            Select a class to view attendance for the date.
          </p>
        </div>

        {/* Date filter */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-amber-900">Date</label>
          <input
            type="date"
            className="px-3 py-2 rounded-lg border border-amber-300 bg-yellow-50 outline-none focus:ring-2 focus:ring-amber-300"
            value={selectedDate}
            onChange={(e) => handleSelectedDate(e.target.value)}
            disabled={!classId}
          />
          <p className="text-xs text-amber-700">
            Change date to fetch attendance for that day.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-2 md:justify-end">
          <button
            className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50"
            onClick={() => handleManualShow(true)}
            disabled={!classId}
          >
            Mark Manually
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-cyan-700 text-white hover:bg-cyan-800 disabled:opacity-50"
            onClick={() => handleCSVShow(true)}
            disabled={!classId}
          >
            Upload CSV
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-50"
            onClick={() => fetchAttendanceForDate(selectedDate)}
            disabled={!classId}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Result summary */}
      <div className="rounded-xl border border-amber-300 bg-yellow-100/50 p-3 flex items-center justify-between">
        <div className="text-sm text-amber-900">
          <span className="font-semibold">Class:</span>{" "}
          <span className="text-amber-800">{classId || "-"}</span>{" "}
          <span className="mx-2">•</span>
          <span className="font-semibold">Date:</span>{" "}
          <span className="text-amber-800">{selectedDate}</span>
        </div>

        <div className="text-sm">
          {loading ? (
            <span className="text-purple-700 font-semibold">Loading...</span>
          ) : marked ? (
            <span className="text-green-700 font-semibold">
              Marked ({rows.length} students)
            </span>
          ) : (
            <span className="text-red-700 font-semibold">No data present</span>
          )}
        </div>
      </div>

      {/* Table / No data */}
      <div className="rounded-xl border border-amber-300 bg-white overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-amber-800">
            Fetching attendance...
          </div>
        ) : !marked ? (
          <div className="p-6 text-center text-amber-800">
            No data present for <b>{selectedDate}</b>. Upload CSV or mark
            manually.
          </div>
        ) : rows.length === 0 ? (
          <div className="p-6 text-center text-amber-800">
            Marked, but no rows returned.
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-yellow-200/70 text-amber-900">
                <tr>
                  <th className="text-left px-3 py-2">ID</th>
                  <th className="text-left px-3 py-2">Name</th>
                  <th className="text-left px-3 py-2">Email</th>
                  <th className="text-left px-3 py-2">Address</th>
                  <th className="text-left px-3 py-2">Guardian</th>
                  <th className="text-center px-3 py-2">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-amber-200/60">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-yellow-50">
                    <td className="px-3 py-2 text-amber-900 font-medium">
                      {r.id}
                    </td>
                    <td className="px-3 py-2 text-amber-900">{r.name}</td>
                    <td className="px-3 py-2 text-amber-800 break-words">
                      {r.email}
                    </td>
                    <td className="px-3 py-2 text-amber-800">{r.address}</td>
                    <td className="px-3 py-2 text-amber-800">{r.guardian}</td>

                    <td className="px-3 py-2 text-center">
                      <StatusPill status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Your modals already exist in your UI
          Just keep using showManual/showCSV to render them.
          Example placeholders (REMOVE if you already have modals): */}
      {showManual && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[92%] md:w-[520px] rounded-xl p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-amber-900">Manual Attendance</h3>
              <button
                className="text-amber-900 hover:text-red-600"
                onClick={() => handleManualShow(false)}
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-amber-800 mt-2">
              (Keep your existing manual form here.)
            </p>
          </div>
        </div>
      )}

      {showCSV && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[92%] md:w-[520px] rounded-xl p-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-amber-900">Upload Attendance CSV</h3>
              <button
                className="text-amber-900 hover:text-red-600"
                onClick={() => handleCSVShow(false)}
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-amber-800 mt-2">
              (Keep your existing CSV upload UI here.)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: "PRESENT" | "ABSENT" | "LATE" }) {
  const base =
    "inline-flex px-3 py-1 rounded-full text-xs font-bold border";

  if (status === "PRESENT")
    return (
      <span className={`${base} text-green-800 border-green-300 bg-green-100`}>
        PRESENT
      </span>
    );

  if (status === "LATE")
    return (
      <span className={`${base} text-purple-800 border-purple-300 bg-purple-100`}>
        LATE
      </span>
    );

  return (
    <span className={`${base} text-red-800 border-red-300 bg-red-100`}>
      ABSENT
    </span>
  );
}
