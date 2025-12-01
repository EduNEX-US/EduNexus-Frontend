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

    return <Section cn=' overflow-y-auto md:w-5/6 w-full md:h-lvh h-5/6 flex flex-col md:flex-row justify-between'> {/* Marks Section */}
        <Div cn="bg-white p-6 w-full shadow-sm"> {/* Parent Div for categorizing child elements */}
          {/* Div Holding Selection Feature of Term Marks */}
          <Div cn="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"> 
            <h2 className="text-xl font-extrabold text-black">Academic Performance</h2>
            <select
                value={selectedExam}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectedExam(e.target.value as ExamName)}
                className="px-4 bg-purple-400 text-shadow-xs text-shadow-black text-white  py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                {(Object.keys(allMarks) as ExamName[]).map(exam => (
                    <option key={exam} value={exam}>{exam}</option>
                ))}
            </select>
          </Div>
          
          {/* Div for Holding Data Tabs */}
          <Div cn="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Overall Percentage */}
            <Div cn="rounded-xl p-5 text-white bg-purple-400 flex flex-col">
              <Span cn="text-indigo-100 text-sm text-white">Overall Percentage</Span>
              <Span cn="text-3xl font-bold mt-1 text-shadow-sm text-shadow-black">{calculatePercentage(totalScore, totalPossible)}%</Span>
            </Div>
            {/* Overall Marks */}
            <Div cn="bg-white border-1 border-black rounded-xl p-5 flex flex-col">
              <Span cn="text-black text-sm">Total Marks</Span>
              <Span cn="text-3xl font-bold text-purple-400 mt-1">{totalScore} <Span cn="text-lg text-slate-400">/ {totalPossible}</Span></Span>
            </Div>
            {/* Class Rank */}
            <Div cn="border-1 border-black rounded-xl p-5 flex flex-col">
              <Span cn="text-black text-sm ">Class Rank</Span>
              <Span cn="text-3xl font-bold text-purple-400 mt-1">5<Span cn="text-lg text-gray-400">th</Span></Span>
              <Span cn="text-xs text-slate-400 mt-1">Out of 42 students</Span>
            </Div>
          </Div>

          {/* Marks Graph */}
          <Div cn="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v, n, p) => [`${v}%`, p.payload.fullName]} />
                <Bar dataKey="score" fill="oklch(71.4% 0.203 305.504)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Div>

          {/* Marks Table */}
          <Div cn="">
            <table className="w-full">
              <thead className='w-full text-sm'><tr className="border-b border-gray-100 bg-slate-900 w-full">
                <th className="text-left pl-2 md:py-3 md:px-4 text-sm font-semibold text-white">Subject</th>
                <th className="text-center md:py-3 py-1 pr-2 md:px-4 text-sm font-semibold text-white">Marks</th>
                <th className="text-center md:py-3 pr-q py-1 md:px-4 text-sm font-semibold text-white">Percentage</th>
                <th className="text-center px-1 md:py-3 py-1 md:px-4 text-sm font-semibold text-white">Grade</th>
              </tr></thead>
              <tbody>
                {allMarks[selectedExam].map((m : MarkEntry, i : number) => (
                  <tr key={i} className="text-xs border-b border-gray-50 hover:bg-gray-50">
                    <td className="md:py-3 py-2 pl-2 md:px-4 font-medium">{m.subject}</td>
                    <td className="md:py-3 py-2 md:px-4 text-center whitespace-nowrap">{m.score} / {m.total}</td>
                    <td className="md:py-3 py-2 md:px-4 text-center"><div className="flex items-center justify-center gap-2"><div className="w-20 bg-gray-400 rounded-full h-2 hidden md:block"><div className="bg-indigo-500 h-2 rounded-full hidden md:block" style={{ width: `${calculatePercentage(m.score, m.total)}%` }} /></div><span className="text-sm text-gray-600">{calculatePercentage(m.score, m.total)}%</span></div></td>
                    <td className="md:py-3 py-2 md:px-4 text-center"><span className={`md:px-3 px-1 py-1 rounded-full text-xs font-semibold ${getGradeColor(m.grade)}`}>{m.grade}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Div>
        </Div>
    </Section>
}