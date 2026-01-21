import { Section, Div, Button, Span, Input } from "../../../Components/Assembler";
import useFuncs from "./Functionality";
import { useEffect, useMemo, useState } from "react";

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

// PTM Join State
const PTM_JOIN_EARLY_MS = 30 * 1000;
const PTM_JOIN_LATE_MS = 30 * 1000;

function toYYYYMMDD(d: any) {
  if (!d) return "";
  const s = String(d).trim();
  return s.length >= 10 ? s.slice(0, 10) : s;
}

function toHHmm(t: any) {
  if (!t) return "";
  const s = String(t).trim();
  const parts = s.split(":");
  return parts.length >= 2 ? `${parts[0]}:${parts[1]}` : s;
}

// robust local parsing (no timezone surprises)
function parseLocalDateTime(dateStr: string, timeStr: string) {
  const ds = toYYYYMMDD(dateStr);
  const ts = toHHmm(timeStr);

  const [y, m, d] = ds.split("-").map((x) => Number(x));
  const [hh, mm] = ts.split(":").map((x) => Number(x));

  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
}

function computePtmState(ptm: { ptmDate: string; startTime: string; endTime: string }) {
  const start = parseLocalDateTime(ptm.ptmDate, ptm.startTime);
  const end = parseLocalDateTime(ptm.ptmDate, ptm.endTime);

  // expiry = ptmDate + 1 day 23:59:59 (local)
  const expiryBase = parseLocalDateTime(ptm.ptmDate, "23:59");
  const expiry = new Date(expiryBase.getTime());
  expiry.setHours(23, 59, 59, 999);
  expiry.setDate(expiry.getDate() + 1);

  const now = new Date();

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { label: "Scheduled", joinAllowed: false, expired: false };
  }

  const nowMs = now.getTime();
  const startMs = start.getTime();
  const endMs = end.getTime();
  const expiryMs = expiry.getTime();

  if (nowMs < startMs - PTM_JOIN_EARLY_MS) return { label: "Scheduled", joinAllowed: false, expired: false };

  if (nowMs >= startMs - PTM_JOIN_EARLY_MS && nowMs <= endMs + PTM_JOIN_LATE_MS) {
    return { label: "Live Now", joinAllowed: true, expired: false };
  }

  if (nowMs > expiryMs) return { label: "Expired", joinAllowed: false, expired: true };

  return { label: "Completed", joinAllowed: false, expired: false };
}

export default function PTM() {
  const {
    adminId,

    teachers,
    loadingTeachers,

    scheduledPTMs,
    loadingPTMs,

    scheduleMode,
    selectedTeacherId,
    meetLink,
    purpose,
    selectedDate,
    startTime,
    endTime,

    filterTeacherId,

    handleScheduleMode,
    handleSelectedTeacher,
    handleMeetLink,
    handlePurpose,
    handleSelectedDate,
    handleStartTime,
    handleEndTime,

    handleFilterTeacher,
    handleSchedule,
  } = useFuncs();

  // ✅ NEW: admin view toggle like teacher
  const [viewMode, setViewMode] = useState<"upcoming" | "completed">("upcoming");

  // ✅ today min date
  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }, []);

  // ✅ time constraints
  const nowRounded = useMemo(() => roundUpMinutes(new Date(), 5), []);
  const minStartTime = useMemo(() => {
    if (selectedDate && selectedDate === todayStr) return toHHmmFromDate(nowRounded);
    return "";
  }, [selectedDate, todayStr, nowRounded]);

  const minEndTime = useMemo(() => {
    if (startTime) return addMinutesToHHmm(startTime, 5);
    if (selectedDate && selectedDate === todayStr) return addMinutesToHHmm(toHHmmFromDate(nowRounded), 5);
    return "";
  }, [startTime, selectedDate, todayStr, nowRounded]);

  // ✅ Auto-correct invalid selections
  useEffect(() => {
    if (selectedDate && selectedDate < todayStr) {
      handleSelectedDate(todayStr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, todayStr]);

  useEffect(() => {
    if (selectedDate === todayStr && minStartTime && startTime && startTime < minStartTime) {
      handleStartTime(minStartTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, todayStr, minStartTime, startTime]);

  useEffect(() => {
    if (minEndTime && endTime && endTime < minEndTime) {
      handleEndTime(minEndTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minEndTime, endTime]);

  // ✅ Normalize + classify PTMs by time (NOT backend status)
  const rowsWithState = useMemo(() => {
    const list = Array.isArray(scheduledPTMs) ? scheduledPTMs : [];
    return list.map((p: any) => {
      const safe = {
        ...p,
        ptmDate: toYYYYMMDD(p.ptmDate),
        startTime: toHHmm(p.startTime),
        endTime: toHHmm(p.endTime),
      };
      const st = computePtmState(safe);
      return { ...safe, _state: st };
    });
  }, [scheduledPTMs]);

  const upcomingRows = useMemo(() => {
    return rowsWithState.filter((p: any) => !p._state.expired && p._state.label !== "Completed");
  }, [rowsWithState]);

  const completedRows = useMemo(() => {
    return rowsWithState.filter((p: any) => p._state.label === "Completed" || p._state.expired);
  }, [rowsWithState]);

  const visibleRows = viewMode === "upcoming" ? upcomingRows : completedRows;

  const canSchedule =
    !!adminId &&
    !!purpose.trim() &&
    !!selectedDate &&
    !!startTime &&
    !!endTime &&
    !!meetLink &&
    (scheduleMode === "ALL" || (scheduleMode === "SINGLE" && !!selectedTeacherId));

  return (
    <Section cn="h-screen flex flex-col p-4 md:p-0 md:w-[95%] gap-y-8 bg-orange-100">
      <h2 className="text-3xl font-semibold mb-2 mt-8 h-[7%] text-amber-900">
        PTM Management (Admin)
      </h2>

      <Div cn="overflow-y-auto flex-1 mt-0 border-3 border-orange-300/50 gap-y-4 p-0">
        {/* PTM Scheduling Block */}
        <Div cn="shadow-md p-6 mb-10 bg-orange-50 mx-4 mt-4">
          <Span cn="text-xl font-semibold mb-4 text-amber-900">
            Schedule PTM for Teachers
          </Span>

          {/* Schedule Mode */}
          <Div cn="mb-6 text-amber-600">
            <label className="font-semibold block mb-2 text-amber-900">Schedule For</label>
            <Div cn="flex gap-3 flex-wrap">
              <Button
                cn={`px-4 py-2 rounded text-white ${
                  scheduleMode === "SINGLE" ? "bg-teal-500" : "bg-gray-400 hover:bg-gray-500"
                }`}
                onClick={() => handleScheduleMode("SINGLE")}
              >
                Single Teacher (1:1)
              </Button>

              <Button
                cn={`px-4 py-2 rounded text-white ${
                  scheduleMode === "ALL" ? "bg-teal-500" : "bg-gray-400 hover:bg-gray-500"
                }`}
                onClick={() => handleScheduleMode("ALL")}
              >
                All Teachers
              </Button>
            </Div>
          </Div>

          {/* Teacher selection (only when SINGLE) */}
          {scheduleMode === "SINGLE" && (
            <Div cn="mb-6 text-amber-600">
              <label className="font-semibold block mb-2 text-amber-900">Select Teacher</label>
              <select
                disabled={loadingTeachers}
                className="p-3 border rounded w-80 bg-orange-100"
                value={selectedTeacherId}
                onChange={(e) => handleSelectedTeacher(e.target.value)}
              >
                <option value="">
                  {loadingTeachers ? "Loading teachers..." : "Choose Teacher"}
                </option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.id})
                  </option>
                ))}
              </select>
            </Div>
          )}

          {/* PTM Details */}
          <Span cn="text-lg font-semibold mb-4 text-amber-900">PTM Details</Span>

          {/* Purpose field */}
          <Div cn="mb-4 text-amber-600">
            <label className="font-semibold block mb-2 text-amber-900">Purpose / Motto</label>
            <Input
              labelCN="hidden"
              labelTxt="Purpose"
              type="text"
              inpCN="p-3 border rounded bg-orange-100 w-full"
              value={purpose}
              forName="purpose"
              inpTxt="Eg: Discuss attendance, academics, behavior"
              onChange={(e) => handlePurpose(e.target.value)}
            />
          </Div>

          <Div cn="grid grid-cols-1 md:grid-cols-4 text-amber-600 gap-4 items-center">
            <Input
              labelCN="hidden"
              labelTxt="Meet Link"
              type="text"
              inpCN="p-3 border rounded bg-orange-100"
              value={meetLink}
              forName="meetLink"
              inpTxt="https://meet.google.com/xxx-xxxx-xxx"
              onChange={(e) => handleMeetLink(e.target.value)}
            />

            <Input
              labelCN="hidden"
              labelTxt="Date"
              type="date"
              inpCN="p-3 border rounded bg-orange-100"
              value={selectedDate}
              forName="ptmDate"
              inpTxt="2026-01-25"
              min={todayStr as any}
              onChange={(e) => handleSelectedDate(e.target.value)}
            />

            <Input
              type="time"
              inpCN="p-3 border rounded bg-orange-100"
              inpTxt="10:00"
              forName="startTime"
              labelCN="hidden"
              labelTxt="Start Time"
              value={startTime}
              min={minStartTime as any}
              onChange={(e) => handleStartTime(e.target.value)}
            />

            <Input
              type="time"
              inpCN="p-3 border rounded bg-orange-100"
              inpTxt="10:20"
              forName="endTime"
              labelCN="hidden"
              labelTxt="End Time"
              value={endTime}
              min={minEndTime as any}
              onChange={(e) => handleEndTime(e.target.value)}
            />
          </Div>

          <Div cn="flex gap-3 mt-6">
            <Button
              disabled={!canSchedule}
              cn={`px-6 py-2 rounded text-white ${
                !canSchedule ? "bg-gray-400 cursor-not-allowed" : "bg-teal-400 hover:bg-teal-500 cursor-pointer"
              }`}
              onClick={handleSchedule}
            >
              {scheduleMode === "ALL" ? "Schedule For All Teachers" : "Schedule Meeting"}
            </Button>
          </Div>

        </Div>

        {/* SCHEDULED PTMs TABLE (Admin) */}
        <Div cn="shadow-md p-6 mb-8 bg-orange-50 mx-4 text-amber-600">
          <h3 className="text-xl font-semibold mb-4 text-amber-900">
            Scheduled PTMs (Admin ↔ Teachers)
          </h3>

          {/* Filter by teacher + ✅ Upcoming/Completed toggle */}
          {/* <Div cn="mb-4 flex items-center gap-4 flex-wrap">
            <label className="font-semibold mr-3">Filter by Teacher:</label>
            <select
              value={filterTeacherId}
              onChange={(e) => handleFilterTeacher(e.target.value)}
              className="p-2 border rounded bg-white"
              disabled={loadingTeachers}
            >
              <option value="">All Teachers</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.id})
                </option>
              ))}
            </select>

            {/* ✅ view toggle */}
            <Div cn="ml-auto flex items-center gap-3">
              <Div cn="relative w-56 bg-amber-200/60 rounded-full h-10 flex items-center overflow-hidden">
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

              <Div cn="text-sm text-gray-600">
                {loadingPTMs ? "Loading..." : `Showing ${visibleRows.length} record(s)`}
              </Div>
            </Div>
          {/* </Div> */}

          <Div cn="overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="p-3">Teacher</th>
                  <th className="p-3">Purpose</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Start</th>
                  <th className="p-3">End</th>
                  <th className="p-3">Meet Link</th>
                  <th className="p-3">State</th>
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((ptm: any) => {
                  const teacher = teachers.find((t) => t.id === ptm.teacherId);
                  const st = ptm._state;

                  // ✅ Admin should not open completed/expired links (same rule as others)
                  const canOpen = st?.joinAllowed;

                  return (
                    <tr key={ptm.id} className="border-b">
                      <td className="p-3 text-teal-700">
                        {teacher ? teacher.name : "Teachers"}
                      </td>
                      <td className="p-3">{ptm.purpose || "-"}</td>
                      <td className="p-3">{ptm.ptmDate}</td>
                      <td className="p-3">{ptm.startTime}</td>
                      <td className="p-3">{ptm.endTime}</td>
                      <td className="p-3">
                        {canOpen ? (
                          <a
                            href={ptm.meetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-white px-3 py-2 rounded bg-teal-400"
                          >
                            Open
                          </a>
                        ) : (
                          <Span cn="text-gray-500">N/A</Span>
                        )}
                      </td>
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
                    </tr>
                  );
                })}

                {!loadingPTMs && visibleRows.length === 0 && (
                  <tr>
                    <td className="p-3 text-gray-600" colSpan={7}>
                      No PTMs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Div>

          <Div cn="mt-3 text-xs text-gray-600">
            * “Upcoming” shows Scheduled + Live. “Completed” shows Completed + Expired. “Open” is enabled only while Live.
          </Div>
        </Div>
      </Div>
    </Section>
  );
}
