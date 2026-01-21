// ===================== PTM.tsx (Teacher UI) =====================
// ✅ Added validations:
// 1) Date cannot be before today  -> input min={today}
// 2) Time cannot be in the past if date = today
//    - startTime min = now (rounded to next 5 minutes)
//    - endTime min = startTime + 5 minutes
//    - auto-correct if user selects invalid times

import { Div, Section, Span, Button, Input } from "../../../Components/Assembler";
import useFuncs from "./Functionality";
import { useEffect, useMemo } from "react";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

// round up to next N minutes
function roundUpMinutes(date: Date, step = 5) {
  const d = new Date(date);
  const ms = step * 60 * 1000;
  return new Date(Math.ceil(d.getTime() / ms) * ms);
}

function toHHmmFromDate(d: Date) {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function addMinutesToHHmm(hhmm: string, add: number) {
  if (!hhmm) return "";
  const [h, m] = hhmm.split(":").map(Number);
  const base = new Date();
  base.setHours(h || 0, m || 0, 0, 0);
  base.setMinutes(base.getMinutes() + add);
  return toHHmmFromDate(base);
}

export default function PTM() {
  const {
    // VIEW
    viewMode,
    setViewMode,
    viewWith,
    setViewWith,
    loadingPTMs,
    upcomingPTMs,
    completedPTMs,
    computePtmState,
    handleJoinPTM,
    fetchTeacherPTMs,

    // CREATE (STUDENTS ONLY)
    createMode,
    setCreateMode,

    students,
    loadingStudents,
    selectedStudentId,
    setSelectedStudentId,

    purpose,
    setPurpose,

    meetLink,
    setMeetLink,
    selectedDate,
    setSelectedDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,

    handleCreateStudentPTM,
    teacherClassNo,
  } = useFuncs();

  // ✅ today min date
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }, []);

  // ✅ time constraints
  const nowRounded = useMemo(() => roundUpMinutes(new Date(), 5), []);
  const minStartTime = useMemo(() => {
    // if selectedDate is today => min start is now, else no limit
    if (selectedDate && selectedDate === todayStr) return toHHmmFromDate(nowRounded);
    return "";
  }, [selectedDate, todayStr, nowRounded]);

  const minEndTime = useMemo(() => {
    // end must be at least start+5min. If no start, then if today => now+5 else ""
    if (startTime) return addMinutesToHHmm(startTime, 5);
    if (selectedDate && selectedDate === todayStr) return addMinutesToHHmm(toHHmmFromDate(nowRounded), 5);
    return "";
  }, [startTime, selectedDate, todayStr, nowRounded]);

  // ✅ Auto-correct invalid selections
  useEffect(() => {
    // date corrected
    if (selectedDate && selectedDate < todayStr) {
      setSelectedDate(todayStr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, todayStr]);

  useEffect(() => {
    // if today, and startTime is before minStartTime => correct it
    if (selectedDate === todayStr && minStartTime && startTime && startTime < minStartTime) {
      setStartTime(minStartTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, todayStr, minStartTime, startTime]);

  useEffect(() => {
    // endTime must be >= minEndTime
    if (minEndTime && endTime && endTime < minEndTime) {
      setEndTime(minEndTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minEndTime, endTime]);

  const rows = viewMode === "upcoming" ? upcomingPTMs : completedPTMs;

  // ✅ filter only student-ptms vs admin-ptms in VIEW
  const filteredRows = rows.filter((p: any) => {
    if (viewWith === "ADMINS") return p.ptmTarget === "ADMIN";
    return p.ptmTarget === "STUDENT";
  });

  const canCreate =
    !!teacherClassNo &&
    !!purpose.trim() &&
    !!selectedDate &&
    !!startTime &&
    !!endTime &&
    !!meetLink &&
    (createMode === "CLASS" ? true : !!selectedStudentId);

  return (
    <Section cn="w-full h-screen bg-orange-50 flex flex-col p-6">
      {/* TITLE + REFRESH */}
      <Div cn="flex items-center justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-semibold text-amber-900">
          PTM Management (Teacher)
        </h2>
      </Div>

      <Div cn="flex-1 overflow-y-auto space-y-10">
        {/* ================= CREATE PTM (ONLY STUDENTS) ================= */}
        <Div cn="p-4 md:p-6 bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm">
          <Span cn="text-lg md:text-xl font-semibold mb-2 block text-amber-900">
            Create PTM (Students)
          </Span>

          <Div cn="text-sm text-gray-600 mb-5">
            Class:{" "}
            <span className="font-semibold text-amber-900">
              {teacherClassNo ? teacherClassNo : "Not set"}
            </span>
          </Div>

          {/* Mode (CLASS / ONE_TO_ONE) */}
          <Div cn="mb-5">
            <Span cn="font-semibold text-amber-900 block mb-2">Mode</Span>
            <Div cn="flex gap-3 flex-wrap">
              <Button
                cn={`px-4 py-2 rounded text-white ${
                  createMode === "CLASS" ? "bg-teal-500" : "bg-gray-400 hover:bg-gray-500"
                }`}
                onClick={() => setCreateMode("CLASS")}
              >
                All Students (Class)
              </Button>
              <Button
                cn={`px-4 py-2 rounded text-white ${
                  createMode === "ONE_TO_ONE" ? "bg-teal-500" : "bg-gray-400 hover:bg-gray-500"
                }`}
                onClick={() => setCreateMode("ONE_TO_ONE")}
              >
                1 : 1 Student
              </Button>
            </Div>
          </Div>

          {/* Student selection for 1:1 */}
          {createMode === "ONE_TO_ONE" && (
            <Div cn="mb-6 text-amber-700">
              <Span cn="font-semibold text-amber-900 block mb-2">Select Student</Span>
              <select
                disabled={!teacherClassNo || loadingStudents}
                className="p-3 border rounded w-80 bg-orange-100"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                <option value="">
                  {loadingStudents ? "Loading students..." : "Choose Student"}
                </option>
                {students.map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id})
                  </option>
                ))}
              </select>
            </Div>
          )}

          {/* Purpose */}
          <Div cn="mb-6 text-amber-700">
            <Span cn="font-semibold text-amber-900 block mb-2">Purpose / Motto</Span>
            <Input
              labelCN="hidden"
              labelTxt="Purpose"
              type="text"
              inpCN="p-3 border rounded bg-orange-100 w-full"
              forName="purpose"
              inpTxt="Eg: Discuss performance / attendance / behaviour"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </Div>

          {/* Meet link + date + times */}
          <Div cn="grid grid-cols-1 md:grid-cols-4 gap-4 text-amber-700 items-center">
            <Input
              labelCN="hidden"
              labelTxt="Meet Link"
              type="text"
              inpCN="p-3 border rounded bg-orange-100"
              forName="meetLink"
              inpTxt="https://meet.google.com/xxx-xxxx-xxx"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
            />

            {/* ✅ Date validation */}
            <Input
              labelCN="hidden"
              labelTxt="Date"
              type="date"
              inpCN="p-3 border rounded bg-orange-100"
              forName="ptmDate"
              inpTxt="2026-01-25"
              value={selectedDate}
              min={todayStr as any} //``
              onChange={(e) => setSelectedDate(e.target.value)}
            />

            {/* ✅ Start Time validation */}
            <Input
              labelCN="hidden"
              labelTxt="Start Time"
              type="time"
              inpCN="p-3 border rounded bg-orange-100"
              forName="startTime"
              inpTxt="10:00"
              value={startTime}
              min={minStartTime as any}
              onChange={(e) => setStartTime(e.target.value)}
            />

            {/* ✅ End Time validation */}
            <Input
              labelCN="hidden"
              labelTxt="End Time"
              type="time"
              inpCN="p-3 border rounded bg-orange-100"
              forName="endTime"
              inpTxt="10:20"
              value={endTime}
              min={minEndTime as any}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </Div>

          <Div cn="flex gap-3 mt-6">
            <Button
              disabled={!canCreate}
              cn={`px-6 py-2 rounded text-white ${
                !canCreate ? "bg-gray-400 cursor-not-allowed" : "bg-teal-400 hover:bg-teal-500"
              }`}
              onClick={handleCreateStudentPTM}
            >
              Create PTM
            </Button>
          </Div>

          {!teacherClassNo && (
            <Div cn="mt-3 text-sm text-red-600">
              Teacher class not found in Redux profile. Ensure <b>state.auth.profile.tClass</b> is set.
            </Div>
          )}

          <Div cn="mt-3 text-xs text-gray-600">
            * Date cannot be before today. If you pick today, start time can’t be in the past and end time must be at
            least 5 minutes after start.
          </Div>
        </Div>

        {/* ================= VIEW PTMs ================= */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4 text-amber-700 mb-6">
          <Span cn="text-lg md:text-xl font-semibold mb-4 block text-amber-900">
            Meetings
          </Span>

          {/* ✅ Toggle: Students/Admin (VIEW ONLY) + Upcoming/Completed */}
          <Div cn="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Students/Admin toggle */}
            <Div cn="">
              <Span cn="font-semibold text-amber-900 block mb-2">Meetings With</Span>
              <Div cn="relative w-72 bg-amber-200/60 rounded-full h-10 flex items-center overflow-hidden">
                <div
                  className="absolute inset-y-0 w-1/2 rounded-full transition-all duration-300 bg-teal-400"
                  style={{ left: viewWith === "STUDENTS" ? "0%" : "50%" }}
                />
                <Button
                  onClick={() => setViewWith("STUDENTS")}
                  cn={`z-10 w-1/2 h-full font-semibold transition-colors ${
                    viewWith === "STUDENTS" ? "text-white" : "text-amber-900"
                  }`}
                >
                  Students
                </Button>
                <Button
                  onClick={() => setViewWith("ADMINS")}
                  cn={`z-10 w-1/2 h-full font-semibold transition-colors ${
                    viewWith === "ADMINS" ? "text-white" : "text-amber-900"
                  }`}
                >
                  Admins
                </Button>
              </Div>
            </Div>

            {/* Upcoming/Completed toggle */}
            <Div cn="">
              <Span cn="font-semibold text-amber-900 block mb-2">View</Span>
              <Div cn="relative w-64 bg-amber-200/60 rounded-full h-10 flex items-center overflow-hidden">
                <div
                  className="absolute inset-y-0 w-1/2 rounded-full transition-all duration-300 bg-teal-400"
                  style={{ left: viewMode === "upcoming" ? "0%" : "50%" }}
                />
                <Button
                  onClick={() => setViewMode("upcoming")}
                  cn={`z-10 w-1/2 h-full font-semibold transition-colors ${
                    viewMode === "upcoming" ? "text-white" : "text-amber-900"
                  }`}
                >
                  Upcoming
                </Button>
                <Button
                  onClick={() => setViewMode("completed")}
                  cn={`z-10 w-1/2 h-full font-semibold transition-colors ${
                    viewMode === "completed" ? "text-white" : "text-amber-900"
                  }`}
                >
                  Completed
                </Button>
              </Div>
            </Div>
          </Div>

          {loadingPTMs && <Div cn="mt-2 text-sm text-amber-700">Loading PTMs...</Div>}

          <Div cn="overflow-auto">
            <table className="w-full table-fixed text-left border-collapse">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="p-3 w-[18%]">Scope</th>
                  <th className="p-3 w-[22%]">Purpose</th>
                  <th className="p-3 w-[14%]">Date</th>
                  <th className="p-3 w-[10%]">Start</th>
                  <th className="p-3 w-[10%]">End</th>
                  <th className="p-3 w-[13%]">State</th>
                  <th className="p-3 w-[6%]">Join</th>
                </tr>
              </thead>
              <tbody>
                {!loadingPTMs && filteredRows.length === 0 && (
                  <tr className="border-b">
                    <td className="p-3 text-gray-600" colSpan={8}>
                      No meetings found.
                    </td>
                  </tr>
                )}

                {filteredRows.map((ptm: any) => {
                  const st = computePtmState(ptm);

                  const scopeLabel =
                    ptm.ptmTarget === "ADMIN"
                      ? "Teacher ↔ Admin"
                      : ptm.ptmScope === "CLASS"
                      ? "Teacher ↔ Class"
                      : "Teacher ↔ Student (1:1)";

                  return (
                    <tr key={ptm.id} className="border-b hover:bg-amber-100/40 transition">
                      <td className="p-3">{scopeLabel}</td>
                      <td className="p-3">{ptm.purpose || "-"}</td>
                      <td className="p-3">{ptm.ptmDate}</td>
                      <td className="p-3">{ptm.startTime}</td>
                      <td className="p-3">{ptm.endTime}</td>
                      <td className="p-3 font-semibold">
                        <span
                          className={
                            st.label === "Live Now"
                              ? "text-teal-700"
                              : st.label === "Expired"
                              ? "text-red-600"
                              : "text-amber-800"
                          }
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="p-3">
                        <Button
                          cn={`px-3 py-1 rounded text-white ${
                            st.joinAllowed ? "bg-teal-400 hover:bg-teal-500" : "bg-gray-400 cursor-not-allowed"
                          }`}
                          disabled={!st.joinAllowed}
                          onClick={() => handleJoinPTM(ptm)}
                        >
                          Join
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Div>

          <Div cn="mt-3 text-xs text-gray-600">
            * Join is enabled only while the PTM is Live (between start and end time).
          </Div>
        </Div>
      </Div>
    </Section>
  );
}
