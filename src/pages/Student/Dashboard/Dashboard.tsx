import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Div, Span, Section, Button } from "../../../Components/Assembler";
import type { HandleTab } from "../../../Components/Sidebar/Functionality";
import { faGreaterThan, faUser } from "@fortawesome/free-solid-svg-icons";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  studentData,
  attendanceData,
  recentTests,
  getGradeColor,
} from "./Functionality";

export default function Dashboard(props: HandleTab) {
  const { handleFunc } = props;

  return (
    <Section cn="w-full h-screen bg-orange-50 flex flex-col md:flex-row p-6 gap-6 overflow-hidden">

      {/* ================= LEFT SECTION ================= */}
      <Div cn="md:w-4/6 w-full flex flex-col gap-6">

        {/* ===== ATTENDANCE ===== */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4 relative">
          <Span cn="text-lg md:text-xl font-semibold text-amber-900 mb-2 block">
            Attendance
          </Span>

          <Div cn="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  label={({ value }) => `${value}%`}
                  labelLine={false}
                >
                  {attendanceData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Div>

          {/* Legend */}
          <Div cn="flex gap-4 mt-2 justify-center">
            {attendanceData.map((item, i) => (
              <Div key={i} cn="flex items-center gap-2 text-sm text-amber-700">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <Span cn="">{item.name}</Span>
              </Div>
            ))}
          </Div>
        </Div>

        {/* ===== RECENT TESTS ===== */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4">

          <Div cn="flex justify-between items-center mb-4">
            <Span cn="text-lg md:text-xl font-semibold text-amber-900">
              Recent Tests
            </Span>

            <Button
              onClick={() => handleFunc("marks")}
              cn="text-sm font-medium flex items-center gap-1 text-teal-600 hover:text-teal-700 transition"
            >
              View All
              <FontAwesomeIcon icon={faGreaterThan} className="text-xs" />
            </Button>
          </Div>

          <Div cn="space-y-3 max-h-[260px] overflow-y-auto pr-1">
            {recentTests.map((test) => (
              <Div
                key={test.id}
                cn="bg-white rounded-xl border border-amber-200/40 p-4 hover:shadow-sm transition"
              >
                <Div cn="flex justify-between items-start">
                  <Div cn="">
                    <Span cn="font-semibold text-amber-900">
                      {test.subject}
                    </Span>
                    <Span cn="block text-xs text-amber-600">
                      {test.date}
                    </Span>
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
                    <Span cn="text-2xl font-bold text-teal-500">
                      {test.score}
                    </Span>
                    <Span cn="text-sm text-amber-600 mb-1">
                      / {test.total}
                    </Span>
                  </Div>

                  <Div cn="w-full bg-amber-100/60 rounded-full h-2 mt-2">
                    <div
                      className="bg-teal-400 h-2 rounded-full"
                      style={{ width: `${test.score}%` }}
                    />
                  </Div>
                </Div>
              </Div>
            ))}
          </Div>
        </Div>
      </Div>

      {/* ================= RIGHT SECTION ================= */}
      <Div cn="md:w-2/6 w-full flex flex-col gap-6">

        {/* PROFILE */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-6 flex flex-col items-center">
          <Div cn="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-4xl mb-3">
            <FontAwesomeIcon icon={faUser} />
          </Div>

          <Span cn="text-xl font-semibold text-amber-900">
            Aman Kaushik
          </Span>
        </Div>

        {/* PERSONAL DETAILS */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4 flex-1 overflow-y-auto">
          <Span cn="text-lg font-semibold text-amber-900 mb-3 block">
            Personal Details
          </Span>

          <Div cn="divide-y divide-amber-200/40 overflow-y-auto">
            {Object.entries(studentData).map(([key, value], i) => (
              <Div
                key={i}
                cn="grid grid-cols-2 py-2 text-sm items-center"
              >
                <Span cn="text-amber-600 capitalize break-words">
                  {key}
                </Span>
                <Span cn="text-amber-900 text-right break-words">
                  {value}
                </Span>
              </Div>
            ))}
          </Div>
        </Div>
      </Div>
    </Section>
  );
}
