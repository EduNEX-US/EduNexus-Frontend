import {Section, Div, Button, Span} from '../../../Components/Assembler';
import { allMarks } from './Functionality';
import type { AllMarks, ChartDataItem, ExamName, MarkEntry } from './Functionality';
import useFuncs from './Functionality';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function Marks(){
    const {selectedExam, handleSelectedExam, calculatePercentage, getGradeColor} = useFuncs();
    const chartData: ChartDataItem[] = allMarks[selectedExam].map((m: MarkEntry) => ({
        name: m.subject.substring(0, 4),
        score: Number(calculatePercentage(m.score, m.total)),
        fullName: m.subject
    }));
const totalScore = allMarks[selectedExam].reduce((a : number, m : MarkEntry) => a + m.score, 0);
const totalPossible = allMarks[selectedExam].reduce((a :  number, m : MarkEntry) => a + m.total, 0);

    return <Section cn=' overflow-y-auto md:w-5/6 w-full md:h-lvh h-5/6 flex flex-col md:flex-row justify-between'>
      <Div cn="space-y-6 w-full">
        <Div cn="bg-white p-6 w-full shadow-sm">
          <Div cn="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-semibold text-lime-400 text-shadow-sm text-shadow-black">Academic Performance</h2>
            <select
                value={selectedExam}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectedExam(e.target.value as ExamName)}
                className="px-4 bg-lime-400 text-shadow-xs text-shadow-black text-white  py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {(Object.keys(allMarks) as ExamName[]).map(exam => (
                    <option key={exam} value={exam}>{exam}</option>
                ))}
            </select>
          </Div>
          
          <Div cn="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Div cn="bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600 rounded-xl p-5 text-white flex flex-col">
              <Span cn="text-indigo-100 text-sm text-shadow-sm text-shadow-black">Overall Percentage</Span>
              <Span cn="text-3xl font-bold mt-1 text-shadow-sm text-shadow-black">{calculatePercentage(totalScore, totalPossible)}%</Span>
              {/* <div className="flex items-center gap-1 mt-2 text-emerald-300 text-sm"><TrendingUp size={14} /> +2.3% from last exam</div> */}
            </Div>
            <Div cn="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
              <Span cn="text-gray-500 text-sm">Total Marks</Span>
              <Span cn="text-3xl font-bold text-lime-400 text-shadow-sm text-shadow-black mt-1">{totalScore} <Span cn="text-lg text-gray-400">/ {totalPossible}</Span></Span>
            </Div>
            <Div cn="bg-white border border-gray-200 rounded-xl p-5 flex flex-col">
              <Span cn="text-gray-500 text-sm ">Class Rank</Span>
              <Span cn="text-3xl font-bold text-lime-400 text-shadow-sm text-shadow-black mt-1">5<Span cn="text-lg text-gray-400">th</Span></Span>
              <Span cn="text-xs text-gray-500 mt-1">Out of 42 students</Span>
            </Div>
          </Div>

          <Div cn="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v, n, p) => [`${v}%`, p.payload.fullName]} />
                <Bar dataKey="score" fill="oklch(84.1% 0.238 128.85)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Div>

          <Div cn="">
            <table className="w-full">
              <thead className='w-full text-sm'><tr className="border-b border-gray-100 bg-slate-900 w-full">
                <th className="text-left pl-2 md:py-3 md:px-4 text-sm font-semibold text-gray-600">Subject</th>
                <th className="text-center md:py-3 py-1 pr-2 md:px-4 text-sm font-semibold text-gray-600">Marks</th>
                <th className="text-center md:py-3 pr-q py-1 md:px-4 text-sm font-semibold text-gray-600">Percentage</th>
                <th className="text-center px-1 md:py-3 py-1 md:px-4 text-sm font-semibold text-gray-600">Grade</th>
              </tr></thead>
              <tbody>
                {allMarks[selectedExam].map((m : MarkEntry, i : number) => (
                  <tr key={i} className="text-xs border-b border-gray-50 hover:bg-gray-50">
                    <td className="md:py-3 py-2 pl-2 md:px-4 font-medium text-gray-800">{m.subject}</td>
                    <td className="md:py-3 py-2 md:px-4 text-center text-gray-600 whitespace-nowrap">{m.score} / {m.total}</td>
                    <td className="md:py-3 py-2 md:px-4 text-center"><div className="flex items-center justify-center gap-2"><div className="w-20 bg-gray-100 rounded-full h-2 hidden md:block"><div className="bg-indigo-500 h-2 rounded-full hidden md:block" style={{ width: `${calculatePercentage(m.score, m.total)}%` }} /></div><span className="text-sm text-gray-600">{calculatePercentage(m.score, m.total)}%</span></div></td>
                    <td className="md:py-3 py-2 md:px-4 text-center"><span className={`md:px-3 px-1 py-1 rounded-full text-xs font-semibold ${getGradeColor(m.grade)}`}>{m.grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Div>
        
        </Div>
        </Div>
    </Section>
}