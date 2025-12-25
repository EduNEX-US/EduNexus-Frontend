import { Section, Div, Span } from "../../../Components/Assembler";
import { allMarks } from "./Functionality";
import type { ChartDataItem, ExamName, MarkEntry } from "./Functionality";
import useFuncs from "./Functionality";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function Marks() {
  const {
    selectedExam,
    handleSelectedExam,
    calculatePercentage,
    getGradeColor,
  } = useFuncs();

  const chartData: ChartDataItem[] = allMarks[selectedExam].map(
    (m: MarkEntry) => ({
      name: m.subject.substring(0, 4),
      score: Number(calculatePercentage(m.score, m.total)),
      fullName: m.subject,
    })
  );

  const totalScore = allMarks[selectedExam].reduce(
    (a: number, m: MarkEntry) => a + m.score,
    0
  );
  const totalPossible = allMarks[selectedExam].reduce(
    (a: number, m: MarkEntry) => a + m.total,
    0
  );

  return (
    <Section
      cn="
        w-full h-screen bg-orange-50 flex flex-col p-6
        overflow-y-auto md:overflow-hidden
      "
    >

      {/* ================= HEADER ================= */}
      <Div cn="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Span cn="text-xl lg:text-2xl font-semibold text-amber-900">
          Academic Performance
        </Span>

        <select
          value={selectedExam}
          onChange={(e) =>
            handleSelectedExam(e.target.value as ExamName)
          }
          className="px-4 py-2 rounded-lg bg-white border border-amber-200/40
                     text-amber-700 focus:ring-2 focus:ring-amber-300 outline-none"
        >
          {(Object.keys(allMarks) as ExamName[]).map((exam) => (
            <option key={exam} value={exam}>
              {exam}
            </option>
          ))}
        </select>
      </Div>

      {/* ================= STATS (FIXED) ================= */}
      <Div cn="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        <Div cn="relative overflow-hidden rounded-2xl bg-white/80 border border-amber-200/40 shadow-sm p-6">
          <Div cn="absolute inset-x-0 top-0 h-5 bg-teal-400">{""}</Div>
          <Span cn="text-sm text-amber-700">Overall Percentage</Span>
          <Span cn="text-4xl font-extrabold text-amber-900 mt-3 block">
            {calculatePercentage(totalScore, totalPossible)}%
          </Span>
        </Div>

        <Div cn="relative rounded-2xl overflow-hidden bg-white/80 border border-amber-200/40 shadow-sm p-6">
          <Div cn="absolute inset-x-0 top-0 h-5 bg-amber-400 ">{""}</Div>
          <Span cn="text-sm text-amber-700">Total Marks</Span>
          <Span cn="text-4xl font-extrabold text-amber-900 mt-3 block">
            {totalScore}
            <Span cn="text-lg text-amber-500"> / {totalPossible}</Span>
          </Span>
        </Div>

        <Div cn="relative rounded-2xl bg-white/80 overflow-hidden border border-amber-200/40 shadow-sm p-6">
          <Div cn="absolute inset-x-0 top-0 h-5 bg-orange-400">{""}</Div>
          <Span cn="text-sm text-amber-700">Class Rank</Span>
          <Span cn="text-4xl font-extrabold text-amber-900 mt-3 block">
            5<Span cn="text-lg text-amber-500">th</Span>
          </Span>
        </Div>

      </Div>

      {/* ================= SCROLL AREA (CHART + TABLE) ================= */}
      <Div
        cn="
          flex-1
          overflow-visible md:overflow-y-auto
          space-y-6
          pr-1
        "
      >

        {/* BAR CHART */}
        <Div
          cn="bg-white/70 rounded-2xl border border-amber-200/40
    shadow-sm p-4
    h-[320px] md:h-[40vh]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="20%">
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v, _, p) => [`${v}%`, p.payload.fullName]}
              />
              <Bar
                dataKey="score"
                fill="#2dd4bf"
                barSize={48}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Div>

        {/* TABLE */}
        <Div
          cn="
            bg-white/70 rounded-2xl border border-amber-200/40
            shadow-sm overflow-x-auto
          "
        >
          <table className="w-full min-w-[700px] text-sm">
            <thead className="bg-amber-100/70 text-amber-900 sticky top-0">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Subject</th>
                <th className="text-center px-4 py-3 font-semibold">Marks</th>
                <th className="text-center px-4 py-3 font-semibold">Percentage</th>
                <th className="text-center px-4 py-3 font-semibold">Grade</th>
              </tr>
            </thead>

            <tbody>
              {allMarks[selectedExam].map((m: MarkEntry, i: number) => (
                <tr
                  key={i}
                  className="border-b border-amber-200/40
                             hover:bg-amber-100/40 transition"
                >
                  <td className="px-4 py-3 font-medium text-amber-900 whitespace-nowrap">
                    {m.subject}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {m.score} / {m.total}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {calculatePercentage(m.score, m.total)}%
                  </td>

                  <td className="px-4 py-3 text-center">
                    <Span
                      cn={`px-3 py-1 rounded-full text-xs font-semibold ${getGradeColor(
                        m.grade
                      )}`}
                    >
                      {m.grade}
                    </Span>
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
