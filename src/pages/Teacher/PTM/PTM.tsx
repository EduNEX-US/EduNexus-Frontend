import { Div, Section, Span, Button, Input } from "../../../Components/Assembler";
import useFuncs from "./Functionality";

export default function PTM() {
  const {
    selectedStudent,
    selectedClass,
    selectedDate,
    selectedTime,
    viewMode,
    students,
    teacherClasses,
    scheduledPTMs,
    completedPTMs,
    handleSelectedStudent,
    handleSelectedClass,
    handleSelectedDate,
    handleSelectedTime,
    handleViewMode,
    handleJoinPTM,
    fetchStudents,
    handleSchedule,
  } = useFuncs();

  return (
    <Section cn="w-full h-screen bg-orange-50 flex flex-col p-6">

      {/* PAGE TITLE */}
      <h2 className="text-xl lg:text-2xl font-semibold mb-8 text-amber-900">
        PTM Management
      </h2>

      {/* SCROLLABLE CONTENT */}
      <Div cn="flex-1 overflow-y-auto space-y-10">

        {/* ================= SCHEDULE PTM ================= */}
        <Div cn="p-4 md:p-6 bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm">
          <Span cn="text-lg md:text-xl font-semibold mb-4 block text-amber-900">
            Schedule PTM
          </Span>

          {/* Class Selection */}
          <label className="block font-semibold mb-2 text-amber-900">
            Select Class
          </label>
          <select
            className="p-3 border rounded w-64 mb-6"
            value={selectedClass}
            onChange={(e) => {
              handleSelectedClass(e.target.value);
              fetchStudents(e.target.value);
            }}
          >
            <option value="">Choose Class</option>
            {teacherClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          {/* PTM Details */}
          <Div cn="grid grid-cols-1 md:grid-cols-3 gap-4 text-amber-600">

            {/* Student */}
            <select
              disabled={!selectedClass}
              className="p-3 border rounded"
              value={selectedStudent}
              onChange={(e) => handleSelectedStudent(e.target.value)}
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>

            {/* Date */}
            <Input
              labelCN="hidden"
              labelTxt="Date"
              type="date"
              disabled={!selectedClass}
              inpCN="p-3 border rounded"
              forName="Date"
              inpTxt="Date"
              value={selectedDate}
              onChange={(e) => handleSelectedDate(e.target.value)}
            />

            {/* Time */}
            <Input
              labelCN="hidden"
              labelTxt="Time"
              forName="Time"
              inpTxt="Time"
              type="time"
              disabled={!selectedClass}
              inpCN="p-3 border rounded"
              value={selectedTime}
              onChange={(e) => handleSelectedTime(e.target.value)}
            />
          </Div>

          <Button
            cn={`mt-6 px-6 py-2 rounded text-white ${
              !selectedClass || !selectedStudent || !selectedDate || !selectedTime
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-400 hover:bg-teal-500"
            }`}
            disabled={
              !selectedClass ||
              !selectedStudent ||
              !selectedDate ||
              !selectedTime
            }
            onClick={handleSchedule}
          >
            Schedule PTM
          </Button>
        </Div>

        {/* ================= YOUR PTMs ================= */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4 text-amber-700 mb-6">

          <Span cn="text-lg md:text-xl font-semibold mb-4 block text-amber-900">
            Your PTMs
          </Span>

          {/* Toggle */}
          <Div cn="relative w-64 bg-amber-200/60 rounded-full h-10 flex items-center mt-4 mb-6 overflow-hidden">
            <div
              className="absolute inset-y-0 w-1/2 rounded-full transition-all duration-300 bg-teal-400"
              style={{
                left: viewMode === "upcoming" ? "0%" : "50%",
              }}
            />

            <Button
              onClick={() => handleViewMode("upcoming")}
              cn={`z-10 w-1/2 h-full font-semibold transition-colors ${
                viewMode === "upcoming"
                  ? "text-white"
                  : "text-amber-900 cursor-pointer"
              }`}
            >
              Upcoming
            </Button>

            <Button
              onClick={() => handleViewMode("completed")}
              cn={`z-10 w-1/2 h-full font-semibold transition-colors ${
                viewMode === "completed"
                  ? "text-white"
                  : "text-amber-900 cursor-pointer"
              }`}
            >
              Completed
            </Button>
          </Div>

          {/* TABLE */}
          <table className="w-full table-fixed text-left border-collapse">
            <thead>
              <tr className="border-b font-semibold">
                <th className="p-3">Class</th>
                <th className="p-3">Student</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {(viewMode === "upcoming"
                ? scheduledPTMs
                : completedPTMs
              ).map((ptm) => (
                <tr
                  key={ptm.id}
                  className="border-b hover:bg-amber-100/40 transition"
                >
                  <td className="p-3">{ptm.class}</td>
                  <td className="p-3">{ptm.student}</td>
                  <td className="p-3">{ptm.date}</td>
                  <td className="p-3">{ptm.time}</td>
                  <td className="p-3 capitalize">{ptm.status}</td>
                  <td className="p-3">
                    {ptm.status === "scheduled" ? (
                      <Button
                        cn="px-4 py-1 rounded text-white bg-teal-400 hover:bg-teal-500"
                        onClick={() => handleJoinPTM(ptm.id)}
                      >
                        Join
                      </Button>
                    ) : (
                      <Span cn="text-gray-500">Completed</Span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Div>
      </Div>
    </Section>
  );
}
