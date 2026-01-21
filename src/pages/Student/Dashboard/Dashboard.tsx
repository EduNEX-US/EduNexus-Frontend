import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Div, Span, Section, Button, Input } from "../../../Components/Assembler";
import type { HandleTab } from "../../../Components/Sidebar/Functionality";
import { faGreaterThan, faPenToSquare, faImage, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useState } from "react";
import useFuncs from "./Functionality";

// ✅ recharts
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// ✅ helper: YYYY-MM
function currentMonthValue() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}
function toMonthIndex(yyyyMm: string) {
  const [y, m] = yyyyMm.split("-").map(Number);
  return y * 12 + (m - 1);
}

// ✅ center label for Pie (percentage + caption)
function CenterLabel(props: any) {
  const { cx, cy, percentText, caption } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: 18, fontWeight: 800, fill: "#111827" }} // gray-900
      >
        {percentText}
      </text>
      <text
        x={cx}
        y={cy}
        dy={18}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontSize: 11, fontWeight: 600, fill: "#92400e" }} // amber-800
      >
        {caption}
      </text>
    </g>
  );
}

export default function Dashboard(props: HandleTab) {
  const { handleFunc } = props;

  const {
    studentData,
    recentTests,
    getGradeColor,

    // notices
    notices,
    noticesLoading,
    noticesError,
    fetchNotices,

    // student fetch state
    studentLoading,
    studentError,

    // ✅ update api + states
    updateStudentMe,
    updating,
    updateError,
    updateSuccess,

    // ✅ attendance
    attendanceSummary,   // { totalDays, present, absent, late }
    attendanceMonthly,   // [{ yearMonth, totalDays, present, absent, late }, ...]
    attendanceLoading,
    attendanceError,
  } = useFuncs();

  // ---------- Edit modal state ----------
  const [showEdit, setShowEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const requiredEmpty =
  !form.name.trim() ||
  !form.mobile.trim() ||
  !form.email.trim() ||
  !form.address.trim();

const canSave = !requiredEmpty && !updating;

  useEffect(() => {
    setForm({
      name: String(studentData?.name ?? ""),
      email: String(studentData?.email ?? ""),
      mobile: String(studentData?.parentPhone ?? ""),
      address: String(studentData?.address ?? ""),
    });

    setImageFile(null);
    setImagePreview("");
  }, [studentData?.name, studentData?.email, studentData?.parentPhone, studentData?.address]);

  const initials = useMemo(() => {
    const n = String(studentData?.name ?? "S").trim();
    return (n?.[0]?.toUpperCase?.() ?? "S") as string;
  }, [studentData?.name]);

  function openEdit() {
    setShowEdit(true);
  }

  function closeEdit() {
    if (updating) return;
    setShowEdit(false);
  }

  function onPickImage(file?: File) {
    if (!file) return;

    const ok = file.type.startsWith("image/") && file.size <= 3 * 1024 * 1024; // 3MB
    if (!ok) {
      alert("Please select an image file (max 3MB).");
      return;
    }

    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  }

  async function handleSave() {
    try {
      const name = form.name.trim();
  const mobile = form.mobile.trim();
  const email = form.email.trim();
  const address = form.address.trim();

  if (!name || !mobile || !email || !address) {
    alert("Values Missing");
    return;
  }
  if(form.mobile.trim().length < 10){
        alert("Mobile Number is Invalid");
        return;
      }
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        address: form.address.trim(),
      };

      await updateStudentMe(payload, imageFile);
      setShowEdit(false);
    } catch (e: any) {
      alert(e?.message ?? "Failed to update profile");
    }
  }

  // ===================== Attendance: Overall (main UI) =====================
  const overallTotal = Number(attendanceSummary?.totalDays ?? 0);
  const overallPresent = Number(attendanceSummary?.present ?? 0);
  const overallAbsent = Number(attendanceSummary?.absent ?? 0);
  const overallLate = Number(attendanceSummary?.late ?? 0);

  const overallPercent = useMemo(() => {
    if (!overallTotal || overallTotal <= 0) return 0;
    return (overallPresent / overallTotal) * 100;
  }, [overallTotal, overallPresent]);

  // ===================== Attendance: Month modal (read-only) =====================
  const [showMonthModal, setShowMonthModal] = useState(false);

  function openMonthModal() {
    setShowMonthModal(true);
  }
  function closeMonthModal() {
    setShowMonthModal(false);
  }

  const availableMonths = useMemo(() => {
    const list = Array.isArray(attendanceMonthly) ? attendanceMonthly : [];
    const months = list
      .map((x: any) => String(x.yearMonth ?? ""))
      .filter((m: string) => /^\d{4}-\d{2}$/.test(m));

    const uniq = Array.from(new Set(months));
    uniq.sort((a, b) => toMonthIndex(b) - toMonthIndex(a));
    return uniq;
  }, [attendanceMonthly]);

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthValue());

  useEffect(() => {
    if (availableMonths.length > 0) setSelectedMonth(availableMonths[0]);
    else setSelectedMonth(currentMonthValue());
  }, [availableMonths]);

  const selectedIdx = useMemo(() => {
    return availableMonths.indexOf(selectedMonth);
  }, [availableMonths, selectedMonth]);

  const canGoPrev = selectedIdx >= 0 && selectedIdx < availableMonths.length - 1; // older
  const canGoNext = selectedIdx > 0; // newer

  function goPrevMonth() {
    if (!canGoPrev) return;
    setSelectedMonth(availableMonths[selectedIdx + 1]);
  }
  function goNextMonth() {
    if (!canGoNext) return;
    setSelectedMonth(availableMonths[selectedIdx - 1]);
  }

  const selectedMonthRow = useMemo(() => {
    const list = Array.isArray(attendanceMonthly) ? attendanceMonthly : [];
    return list.find((x: any) => String(x.yearMonth) === selectedMonth) ?? null;
  }, [attendanceMonthly, selectedMonth]);

  const monthTotal = Number(selectedMonthRow?.totalDays ?? 0);
  const monthPresent = Number(selectedMonthRow?.present ?? 0);
  const monthAbsent = Number(selectedMonthRow?.absent ?? 0);
  const monthLate = Number(selectedMonthRow?.late ?? 0);

  const monthPresentPercent = useMemo(() => {
    if (!monthTotal || monthTotal <= 0) return 0;
    return (monthPresent / monthTotal) * 100;
  }, [monthTotal, monthPresent]);

  return (
    <Section cn="w-full h-screen bg-orange-50 flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
      {/* ================= LEFT SECTION ================= */}
      <Div cn="md:w-4/6 w-full flex flex-col gap-6 overflow-y-auto">
        {/* ✅ ATTENDANCE ON TOP (COMPACT + OVERALL PIE) */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4">
          <Div cn="flex items-center justify-between mb-2">
            <Span cn="text-lg font-semibold text-amber-900">Attendance</Span>

            <Div cn="flex items-center gap-2">
              <Span cn="text-xs text-amber-700">Overall</Span>
              <Button
                onClick={openMonthModal}
                cn="px-3 py-1.5 rounded-lg border border-amber-200/60 text-amber-800 hover:bg-amber-50 transition text-xs"
              >
                Month View
              </Button>
            </Div>
          </Div>

          {attendanceLoading ? (
            <Div cn="p-4 text-center text-amber-700">Loading attendance...</Div>
          ) : attendanceError ? (
            <Div cn="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {attendanceError}
            </Div>
          ) : !attendanceSummary || overallTotal <= 0 ? (
            <Div cn="p-6 text-center text-amber-600 opacity-70">
              No attendance uploaded yet
            </Div>
          ) : (
            <Div cn="grid grid-cols-2 gap-4 items-center">
              {/* Overall PIE: Present vs Not Present + center text */}
              <Div cn="h-[150px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Present", value: overallPresent },
                        { name: "Not Present", value: Math.max(0, overallTotal - overallPresent) },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={48}
                      outerRadius={70}
                      paddingAngle={2}
                      isAnimationActive={false}
                      labelLine={false}
                      label={(p: any) => (
                        <CenterLabel
                          {...p}
                          percentText={`${overallPercent.toFixed(1)}%`}
                          caption="Present"
                        />
                      )}
                    >
                      <Cell fill="#14b8a6" />
                      <Cell fill="#f59e0b" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </Div>

              {/* Overall numbers */}
              <Div cn="flex flex-col gap-2">
                <Span cn="text-2xl font-bold text-amber-900">
                  {overallPercent.toFixed(1)}%
                </Span>
                <Span cn="text-[11px] text-amber-700 -mt-1">Present overall</Span>

                <Div cn="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <Div cn="p-2 rounded-xl bg-amber-50/70 border border-amber-200/40">
                    <Span cn="text-amber-700">Total</Span>
                    <Span cn="block font-semibold text-amber-900">{overallTotal}</Span>
                  </Div>

                  <Div cn="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/40">
                    <Span cn="text-emerald-700">Present</Span>
                    <Span cn="block font-semibold text-emerald-900">{overallPresent}</Span>
                  </Div>

                  <Div cn="p-2 rounded-xl bg-red-50/70 border border-red-200/40">
                    <Span cn="text-red-700">Absent</Span>
                    <Span cn="block font-semibold text-red-900">{overallAbsent}</Span>
                  </Div>

                  <Div cn="p-2 rounded-xl bg-amber-50/70 border border-amber-200/40">
                    <Span cn="text-amber-700">Late</Span>
                    <Span cn="block font-semibold text-amber-900">{overallLate}</Span>
                  </Div>
                </Div>
              </Div>
            </Div>
          )}
        </Div>

        {/* ===== NOTICES ===== */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4 relative">
          <Div cn="flex items-center justify-between mb-3">
            <Span cn="text-lg md:text-xl font-semibold text-amber-900">Notices</Span>

            <Button
              onClick={fetchNotices}
              cn="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition cursor-pointer text-sm"
            >
              Refresh
            </Button>
          </Div>

          {noticesError && (
            <Div cn="mb-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
              {noticesError}
            </Div>
          )}

          {noticesLoading ? (
            <Div cn="p-6 text-center text-amber-700">Loading notices...</Div>
          ) : !notices || notices.length === 0 ? (
            <Div cn="p-10 text-center text-amber-600 opacity-70">No notices available</Div>
          ) : (
            <Div cn="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {notices.map((n: any) => (
                <Div
                  key={n.id}
                  cn="bg-white rounded-xl border border-amber-200/40 p-4 hover:shadow-sm transition"
                >
                  <Div cn="flex items-start justify-between gap-3">
                    <Div cn="flex-1">
                      <Span cn="font-semibold text-amber-900">{n.title ?? "Notice"}</Span>
                      <Span cn="block text-sm text-amber-700 mt-1">
                        {(n.body ?? n.message ?? n.content ?? "-").slice(0, 80)}
                      </Span>
                    </Div>

                    <Span cn="text-xs text-amber-700 whitespace-nowrap">
                      {n.createdAt ? String(n.createdAt).slice(0, 10) : ""}
                    </Span>
                  </Div>
                </Div>
              ))}
            </Div>
          )}
        </Div>

        {/* ===== RECENT TESTS ===== */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4">
          <Div cn="flex justify-between items-center mb-4">
            <Span cn="text-lg md:text-xl font-semibold text-amber-900">Recent Tests</Span>

            <Button
              onClick={() => handleFunc("marks")}
              cn="text-sm font-medium flex items-center gap-1 text-teal-600 hover:text-teal-700 transition"
            >
              View All
              <FontAwesomeIcon icon={faGreaterThan} className="text-xs" />
            </Button>
          </Div>

          {!recentTests || recentTests.length === 0 ? (
            <Div cn="p-10 text-center text-amber-600 opacity-70">No recent marks available</Div>
          ) : (
            <Div cn="space-y-3 max-h-[260px] overflow-y-auto pr-1">
              {recentTests.map((test) => (
                <Div
                  key={test.id}
                  cn="bg-white rounded-xl border border-amber-200/40 p-4 hover:shadow-sm transition"
                >
                  <Div cn="flex justify-between items-start">
                    <Div cn="">
                      <Span cn="font-semibold text-amber-900">{test.subject}</Span>
                      <Span cn="block text-xs text-amber-600">{test.date}</Span>
                    </Div>

                    <Span
                      cn={`px-2 py-1 rounded-full text-xs font-semibold ${getGradeColor(
                        test.grade
                      )}`}
                    >
                      {test.grade}
                    </Span>
                  </Div>

                  <Div cn="mt-3">
                    <Div cn="flex items-end gap-1">
                      <Span cn="text-2xl font-bold text-teal-500">{test.score}</Span>
                      <Span cn="text-sm text-amber-600 mb-1">/ {test.total}</Span>
                    </Div>

                    <Div cn="w-full bg-amber-100/60 rounded-full h-2 mt-2">
                      <div
                        className="bg-teal-400 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((test.score / test.total) * 100)
                          )}%`,
                        }}
                      />
                    </Div>
                  </Div>
                </Div>
              ))}
            </Div>
          )}
        </Div>
      </Div>

      {/* ================= RIGHT SECTION ================= */}
      <Div cn="md:w-2/6 w-full flex flex-col gap-6">
        {/* PROFILE */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-6 flex flex-col items-center">
          <Div cn="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-4xl mb-3 overflow-hidden">
            {studentData?.imageUrl ? (
              <img
                className="w-full h-full object-cover"
                src={`http://localhost:8080${studentData.imageUrl}`}
                alt="profile"
              />
            ) : (
              <Span cn="font-bold text-amber-800">{initials}</Span>
            )}
          </Div>

          <Span cn="text-xl font-semibold text-amber-900">
            {studentLoading ? "Loading..." : studentData?.name ?? "Student"}
          </Span>

          {studentError && <Span cn="text-xs text-red-600 mt-1">{studentError}</Span>}

          <Button
            onClick={openEdit}
            cn="mt-4 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition cursor-pointer flex items-center gap-2 text-sm"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
            Edit Profile
          </Button>

          {(updateError || updateSuccess) && (
            <Div
              cn={`mt-3 w-full rounded-xl p-3 text-sm border ${
                updateError
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700"
              }`}
            >
              {updateError || updateSuccess}
            </Div>
          )}
        </Div>

        {/* PERSONAL DETAILS */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4 flex-1 overflow-y-auto">
          <Span cn="text-lg font-semibold text-amber-900 mb-3 block">Personal Details</Span>

          <Div cn="divide-y divide-amber-200/40 overflow-y-auto">
            {Object.entries(studentData ?? {}).map(([key, value], i) => (
              <Div key={i} cn="grid grid-cols-2 py-2 text-sm items-center">
                {key !== "imageUrl" && (
                  <>
                    <Span cn="text-amber-600 capitalize break-words">{key}</Span>
                    <Span cn="text-amber-900 text-right break-words">{String(value ?? "-")}</Span>
                  </>
                )}
              </Div>
            ))}
          </Div>
        </Div>
      </Div>

      {/* ================= MONTH MODAL (READ ONLY) ================= */}
      {showMonthModal && (
        <Div
          cn="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn"
          onClick={closeMonthModal}
        >
          <Div
            onClick={(e) => e.stopPropagation()}
            cn="bg-white rounded-2xl p-8 w-[720px] max-w-[95vw] shadow-xl animate-scaleIn"
          >
            <Div cn="flex justify-between items-center mb-4">
              <Div cn="">
                <Span cn="text-xl font-bold text-amber-900">Monthly Attendance</Span>
                <Div cn="text-xs text-amber-700 mt-1">
                  {availableMonths.length === 0 ? "No uploaded months yet" : `Months uploaded: ${availableMonths.length}`}
                </Div>
              </Div>

              <FontAwesomeIcon
                icon={faXmark}
                className="cursor-pointer text-amber-700"
                onClick={closeMonthModal}
              />
            </Div>

            {/* Month controls */}
            <Div cn="flex items-center justify-between gap-3 mb-4">
              <Div cn="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-amber-200/40 shadow-sm text-amber-700 w-full">
                <button
                  className={`px-3 py-1 rounded-lg border border-amber-200/60 ${
                    canGoPrev ? "hover:bg-amber-50" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={goPrevMonth}
                  disabled={!canGoPrev}
                  title="Older month"
                >
                  ◀
                </button>

                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent outline-none text-amber-800 font-medium w-full"
                >
                  {availableMonths.length === 0 ? (
                    <option value={selectedMonth}>{selectedMonth}</option>
                  ) : (
                    availableMonths.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))
                  )}
                </select>

                <button
                  className={`px-3 py-1 rounded-lg border border-amber-200/60 ${
                    canGoNext ? "hover:bg-amber-50" : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={goNextMonth}
                  disabled={!canGoNext}
                  title="Newer month"
                >
                  ▶
                </button>
              </Div>
            </Div>

            {/* Modal content */}
            {attendanceLoading ? (
              <Div cn="p-8 text-center text-amber-700">Loading attendance...</Div>
            ) : attendanceError ? (
              <Div cn="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {attendanceError}
              </Div>
            ) : !selectedMonthRow || monthTotal <= 0 ? (
              <Div cn="p-10 text-center text-amber-600 opacity-70">
                No attendance uploaded for <span className="font-semibold">{selectedMonth}</span>
              </Div>
            ) : (
              <Div cn="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* ✅ MONTH PIE + center % */}
                <Div cn="h-[240px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Present", value: monthPresent },
                          { name: "Absent", value: monthAbsent },
                          { name: "Late", value: monthLate },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={62}
                        outerRadius={92}
                        paddingAngle={2}
                        isAnimationActive={false}
                        labelLine={false}
                        label={(p: any) => (
                          <CenterLabel
                            {...p}
                            percentText={`${monthPresentPercent.toFixed(1)}%`}
                            caption="Present"
                          />
                        )}
                      >
                        <Cell fill="#14b8a6" />
                        <Cell fill="#ef4444" />
                        <Cell fill="#f59e0b" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </Div>

                {/* Month details */}
                <Div cn="flex flex-col gap-3">
                  <Div cn="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <Span cn="text-xs text-amber-700">Month</Span>
                    <Span cn="block font-semibold text-amber-900">{selectedMonth}</Span>
                  </Div>

                  <Div cn="grid grid-cols-2 gap-2 text-sm">
                    <Div cn="p-3 rounded-xl bg-amber-50/70 border border-amber-200/40">
                      <Span cn="text-amber-700 text-xs">Total Days</Span>
                      <Span cn="block font-semibold text-amber-900">{monthTotal}</Span>
                    </Div>

                    <Div cn="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/40">
                      <Span cn="text-emerald-700 text-xs">Present</Span>
                      <Span cn="block font-semibold text-emerald-900">{monthPresent}</Span>
                    </Div>

                    <Div cn="p-3 rounded-xl bg-red-50/70 border border-red-200/40">
                      <Span cn="text-red-700 text-xs">Absent</Span>
                      <Span cn="block font-semibold text-red-900">{monthAbsent}</Span>
                    </Div>

                    <Div cn="p-3 rounded-xl bg-amber-50/70 border border-amber-200/40">
                      <Span cn="text-amber-700 text-xs">Late</Span>
                      <Span cn="block font-semibold text-amber-900">{monthLate}</Span>
                    </Div>
                  </Div>

                  <Div cn="text-xs text-amber-700">
                    * Month view is read-only. If anything looks wrong, contact your teacher.
                  </Div>
                </Div>
              </Div>
            )}
          </Div>
        </Div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {showEdit && (
        <Div
          cn="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadeIn"
          onClick={closeEdit}
        >
          <Div
            onClick={(e) => e.stopPropagation()}
            cn="bg-white rounded-2xl p-8 w-[720px] max-w-[95vw] shadow-xl animate-scaleIn"
          >
            <Div cn="flex justify-between items-center mb-6">
              <Span cn="text-xl font-bold text-amber-900">Edit Profile</Span>
              <Span
                cn={`cursor-pointer text-amber-700 ${
                  updating ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={closeEdit}
              >
                ✕
              </Span>
            </Div>

            {/* Image */}
            <Div cn="flex items-center gap-5 mb-6">
              <Div cn="w-20 h-20 rounded-2xl overflow-hidden border border-amber-200/60 bg-amber-50 flex items-center justify-center">
                {imagePreview ? (
                  <img className="w-full h-full object-cover" src={imagePreview} alt="preview" />
                ) : studentData?.imageUrl ? (
                  <img
                    className="w-full h-full object-cover"
                    src={`http://localhost:8080${studentData.imageUrl}`}
                    alt="current"
                  />
                ) : (
                  <Span cn="text-amber-800 font-bold text-2xl">{initials}</Span>
                )}
              </Div>

              <Div cn="flex flex-col gap-2">
                <Span cn="text-sm font-semibold text-amber-800">Profile Image</Span>

                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition cursor-pointer w-fit">
                  <FontAwesomeIcon icon={faImage} />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => onPickImage(e.target.files?.[0])}
                  />
                </label>

                <Span cn="text-xs text-amber-700 opacity-80">JPG/PNG/WebP • Max 3MB</Span>
              </Div>
            </Div>

            {/* Fields */}
            <Div cn="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                labelCN="hidden"
                labelTxt="Name"
                forName="name"
                type="text"
                inpTxt="Name"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />

              <Input
                labelCN="hidden"
                labelTxt="Mobile"
                forName="mobile"
                type="text"
                inpTxt="Mobile"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={form.mobile}
                onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setForm((p) => ({ ...p, mobile: digits }))
                }}
              />

              <Input
                labelCN="hidden"
                labelTxt="Email"
                forName="email"
                type="email"
                inpTxt="Email"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />

              <Input
                labelCN="hidden"
                labelTxt="Address"
                forName="address"
                type="text"
                inpTxt="Address"
                inpCN="px-4 py-3 rounded-lg border border-amber-200/40 focus:ring-2 focus:ring-amber-300 outline-none"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
              />

              <Div cn="col-span-1 md:col-span-2 flex justify-end gap-3 mt-2">
                <Button
                  cn={`px-5 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition cursor-pointer ${
                    updating ? "opacity-60 pointer-events-none" : ""
                  }`}
                  onClick={closeEdit}
                >
                  Cancel
                </Button>

                {/* <Button
                  cn={`px-6 py-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition cursor-pointer ${
                    updating ? "opacity-60 pointer-events-none" : ""
                  }`}
                  onClick={handleSave}
                >
                  {updating ? "Saving..." : "Save Changes"}
                </Button> */}
                <Button
  type="button"
  cn={`px-6 py-3 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition cursor-pointer
    ${!canSave ? "opacity-60 pointer-events-none" : ""}
    ${updating ? "opacity-60 pointer-events-none" : ""}
  `}
  onClick={handleSave}
>
  {updating ? "Saving..." : "Save Changes"}
</Button>

              </Div>
            </Div>
          </Div>
        </Div>
      )}
    </Section>
  );
}
