import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Div, Span, Section, Button} from '../../../Components/Assembler';
import type { HandleTab } from '../../../Components/Sidebar/Functionality';
import  {faGreaterThan, faUser} from '@fortawesome/free-solid-svg-icons'
import { PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';
import {studentData, attendanceData, recentTests, getGradeColor} from './Functionality';

export default function Dashboard(props : HandleTab){
    const {handleFunc} = props;
    return <Section cn='md:overflow-y-none overflow-y-auto md:w-5/6 w-full md:h-lvh h-5/6 flex flex-col md:flex-row justify-between'> {/* DashBoard Section */}
        {/* Attendance & Recent Exam Marks Holding Div*/}
        <Div cn='md:w-4/6 w-full md:order-1 mt-3 md:mt-0 order-2 h-lvh flex flex-col justify-around items-center'>
            {/* Attendance */}
            <Div cn='w-[90%] md:w-5/6 bg-white border-black border-1 focus:border-none h-4/9 rounded-xl relative'>
                {/* Title */}
                <Span cn="text-lg md:text-xl text-black font-extrabold absolute md:top-3 top-0 right-3 md:left-3 ">Attendance</Span>
                {/* Pie Chart */}
                <Div cn="h-full w-full [&_*]:outline-none [&_*]:focus:outline-none">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
                        {attendanceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                    </PieChart>
                    </ResponsiveContainer>
                </Div>
                {/* Pie Chart Information */}
                <Div cn="flex justify-start gap-4 mt-2 absolute md:left-5 md:bottom-3 left-2 bottom-2">
                    {attendanceData.map((item, i) => {
                    return <Div key={i} cn="flex items-center gap-1 text-xs">
                                <div className="w-2 h-2 rounded-full border-1 border-purple-400" style={{ backgroundColor: item.color }} />
                                    <Span cn="text-2xs md:text-sm text-black font-semibold">{item.name}</Span>
                            </Div>
                    })}
                </Div>
            </Div>

            {/* Recent Tests */}
            <Div cn='w-[90%] md:w-5/6 bg-white border-1 border-black text-purple-300 h-4/9 rounded-xl'>
                {/* Title */}
                <Div cn="flex items-center justify-between mb-4 h-1/4 px-4">
                    <h2 className="text-lg md:text-xl text-black font-extrabold">Recent Tests</h2>
                    <Button onClick={() => handleFunc('marks')} cn=" text-xs md:text-sm font-medium flex group items-center gap-1 cursor-pointer text-purple-400 hover:text-purple-700/25">
                        View All
                        <Span cn='group-hover:text-purple-700/25 md:block hidden'>
                            <FontAwesomeIcon icon={faGreaterThan}></FontAwesomeIcon>
                        </Span>
                    </Button>
                </Div>

                {/* Recent Tests Grid */}
                <Div cn="flex flex-col justify-around items-center h-2/4 overflow-y-auto">
                    {recentTests.map(test => (
                        <Div key={test.id} cn="border-1 border-black w-[90%] rounded-lg p-4 hover:shadow-sm hover:shadow-black transition-shadow mb-2">
                            <Div cn="flex items-start justify-between">
                                <Div cn=''>
                                    <h3 className="font-semibold text-black">{test.subject}</h3>
                                    <Span cn="text-xs text-gray-500">{test.date}</Span>
                                </Div>
                                {/* Calculating grade Colour based on marks */}
                                <Span cn={`px-2 py-1 rounded-full text-xs font-semibold ${getGradeColor(test.grade)}`}>{test.grade}</Span>
                            </Div>
                            <Div cn="mt-3">
                                <Div cn="flex items-end gap-1">
                                <Span cn="text-2xl font-bold text-purple-400">{test.score}</Span>
                                <Span cn="text-slate-400 text-sm mb-1"> {test.total}</Span>
                                </Div>
                                <Div cn="w-full bg-white shadow-sm shadow-black rounded-full h-2 mt-2">
                                <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${test.score}%` }} />
                                </Div>
                            </Div>
                        </Div>
                    ))}
                </Div>
            </Div>
        </Div>

        {/* Student Personal Information */}
        <Div cn='w-full md:w-2/6 md:order-2 order-1 h-lvh flex flex-col justify-center items-center'>
            <Div cn='h-full w-full flex flex-col justify-between items-center'>
                <Div cn='w-full h-1/3 flex justify-center items-center flex-col'>
                    <Span cn='bg-white h-3/5 block w-1/3 text-purple-400 border-1 border-black outline-1 outline-black m-1 text-[4rem] rounded-full flex justify-center items-center'>
                    <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                </Span>
                <Span cn=' text-2xl font-semibold text-center text-purple-400'>Aman Kaushik</Span>
                </Div>
                <Div cn='h-2/3 w-[90%] border-1 border-black rounded-xl md:rounded-t-xl md:rounded-b-none flex flex-col justify-start items-center bg-white'>
                    <Span cn='font-extrabold text-xl h-1/6 py-1 text-black'>Personal Details</Span>
                    <Div cn='h-5/6 w-full flex flex-col justify-start items-center divide-y-2 divide-purple-400/25 divide-opacity-25 px-3 overflow-y-auto'>
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2'>
                            <Span cn='text-purple-400 text-center'>Class</Span>
                            <Span cn='text-black text-center'>{studentData.class}</Span>
                        </Div>
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2'>
                            <Span cn='text-purple-400 text-center break-words'>Classjjjjjjjjjjjjjjjjjjjjjjjjjj</Span>
                            <Span cn='text-black text-center break-words'>{studentData.class}</Span>
                        </Div>
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2'>
                            <Span cn='text-purple-400 text-center'>Class</Span>
                            <Span cn='text-black text-center'>{studentData.class}</Span>
                        </Div>
                        <Div cn='divide-x-2 divide-purple-400/25 w-full grid grid-cols-2 py-2'>
                            <Span cn='text-purple-400 text-center'>Class</Span>
                            <Span cn='text-black text-center'>{studentData.class}</Span>
                        </Div>
                    </Div>
                </Div>
            </Div>
        </Div>
    </Section>
}