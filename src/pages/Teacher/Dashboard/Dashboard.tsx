import type { HandleTab } from "../../../Components/Sidebar/Functionality"
import {Section, Button, Div , Span} from "../../../Components/Assembler"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faPhone, faGraduationCap, faEnvelope, faUsers, faCalendar, faAward, faBookOpen, faClock, faBoxesPacking, faArrowTrendUp } from "@fortawesome/free-solid-svg-icons"
import useFuncs from "./Functionality"
export default function Dashboard(props : HandleTab){
    const {teacherProfile, ptmMeetings} = useFuncs();
    return <Section cn="bg-[#7CA982] md:w-5/6 flex flex-col items-center space-y-6 p-4 overflow-y-auto"> {/* Parent Section */}
        <Div  cn="flex justify-between items-center w-[95%] mt-4 h-[40%]"> {/* Greetings Header */}
            {/* Greetings & Qualification */}
            <Div  cn="h-full w-3/6 flex justify-around items-center h-[25%] bg-[#243E36] py-6 rounded-xl">
                <Div  cn="h-full flex flex-col py-2 items-start justify-center">
                    <Span cn="rounded-xl w-full flex items-center text-xl font-extrabold text-[#7CA982]">Welcome Back Mr. Aman Kaushik</Span>
                    <Div  cn="flex justify-start items-center text-sm text-[#E0EEC6] w-full">
                        <Span cn="text-center mr-2 text-[#C2A83E]"><FontAwesomeIcon icon={faGraduationCap}></FontAwesomeIcon></Span>
                        <Span cn="flex justify-start items-center w-4/5">Phd. Computer Science</Span>
                    </Div >
                </Div >
                <Span cn="bg-[#7CA982] text-[#243E36] rounded-[50%] size-20 flex items-center justify-center text-4xl">AK</Span>
            </Div >
            {/* Personal Details */}
            <Div  cn="h-full flex items-center justify-around w-2/5">
                <Div  cn="grid grid-cols-1 w-full h-full rounded-xl bg-[#243E36]">
                    <Span cn="px-4 flex items-center text-[#7CA982] font-extrabold">Personal Details</Span>
                    <Div  cn="flex justify-start px-2 items-center">
                        <Span cn="w-[10%] text-sm text-center text-[#C2A83E] opacity-30"><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon></Span>
                        <Span cn="flex justify-start text-[#E0EEC6] items-center w-[90%] text-sm">abcd@gmail.com</Span>
                    </Div >
                    <Div  cn="flex justify-start px-2 items-center">
                        <Span cn="w-[10%] text-center text-sm text-[#C2A83E] opacity-30"><FontAwesomeIcon icon={faPhone}></FontAwesomeIcon></Span>
                        <Span cn="flex justify-start text-[#E0EEC6] items-center w-[90%] text-sm">1234567890</Span>
                    </Div >
                    <Div  cn="flex justify-start px-2 items-center">
                        <Span cn="w-[10%] text-center text-sm text-[#C2A83E] opacity-30"><FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon></Span>
                        <Span cn="flex justify-start text-[#E0EEC6] font-bold items-center w-[90%] text-xs">123, Park ST., MarksTown, Austria</Span>
                    </Div >
                </Div >
            </Div >
        </Div >
        {/* Detail Tabs */}
        <Div cn="w-[95%] h-1/4">
            <Div cn="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-around items-center content-center">
                {/* Number of Students To Teach */}
                <Div cn="bg-[#243E36] rounded-lg shadow p-6 border-l-4 border-[#E0EEC6]">
                    <Div cn="flex items-center justify-between">
                        <Div cn="grid grid-cols-1">
                        <Span cn="text-sm text-[#E0EEC6]">Total Students</Span>
                        <Span cn="text-3xl font-bold text-[#7CA982]">{teacherProfile.totalStudents}</Span>
                        </Div >
                        <FontAwesomeIcon className="w-12 h-12 text-[#C2A83E] opacity-20" icon={faUsers}/>
                    </Div >
                </Div >
                {/* Number of Classes */}
                <Div  cn="bg-[#243E36] rounded-lg shadow p-6 border-l-4 border-[#E0EEC6]">
                    <Div  cn="flex items-center justify-between">
                        <Div cn="grid grid-cols-1">
                        <Span cn="text-sm text-[#E0EEC6]">Classes</Span>
                        <Span cn="text-3xl font-bold text-[#7CA982]">{teacherProfile.classes.length}</Span>
                        </Div >
                        <FontAwesomeIcon className="w-12 h-12 text-[#C2A83E] opacity-20" icon={faBookOpen}/>
                    </Div >
                </Div >
                {/* Upcoming PTMs */}
                <Div  cn="bg-[#243E36] rounded-lg shadow p-6 border-l-4  border-[#E0EEC6]">
                <Div  cn="flex items-center justify-between">
                    <Div cn="grid grid-cols-1">
                    <Span cn="text-sm text-[#E0EEC6]">Upcoming PTMs</Span>
                    <Span cn="text-3xl font-bold text-[#7CA982]">{ptmMeetings.filter(m => m.status === 'scheduled').length}</Span>
                    </Div >
                    <FontAwesomeIcon className="w-12 h-12 text-[#C2A83E] opacity-20" icon={faCalendar}/>
                </Div >
                </Div >
                {/* Total Experience */}
                <Div  cn="bg-[#243E36] rounded-lg shadow p-6 border-l-4  border-[#E0EEC6]">
                <Div  cn="flex items-center justify-between">
                    <Div cn="grid grid-cols-1">
                    <Span cn="text-sm text-[#E0EEC6]">Experience</Span>
                    <Span cn="text-3xl font-bold text-[#7CA982]">{teacherProfile.experience}</Span>
                    </Div >
                    <FontAwesomeIcon className="w-12 h-12 text-[#C2A83E] opacity-20" icon={faAward}/>
                </Div >
                </Div >
            </Div >
        </Div >
        {/* Schedule Div */}
        <Div cn="w-[95%]">
            {/* Today's Schedule */}
            <Div cn="bg-[#243E36] rounded-lg p-6 w-full">
                <h2 className="text-xl font-bold text-[#7CA982] mb-4">Today's Schedule</h2>
                <Div cn="space-y-4">
                    {teacherProfile.classes.map((cls, idx) => (
                    <Div key={idx} cn="flex items-center gap-4 p-3 bg-[#E0EEC6] rounded-lg">
                        <Div cn="w-12 h-12 bg-[#243E36] rounded-lg flex items-center justify-center text-[#7CA982] font-bold">
                        {idx + 1}
                        </Div>
                        <Div cn="flex-1 flex flex-col">
                        <Span cn="font-semibold text-[#243E36]">{cls}</Span>
                        <Span cn="text-sm text-[#7CA982]">Period {idx + 1} • {9 + idx}:00 - {10 + idx}:00 AM</Span>
                        </Div>
                        <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-[#C2A83E]" />
                    </Div>
                    ))}
                </Div>
            </Div>
        </Div>
        <Div cn="w-[95%]">
            {/* Pending Tasks */}
            <Div cn="bg-[#243E36] rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-[#7CA982] mb-4">Pending Tasks</h2>
            <Div cn="space-y-3">
                <Div cn="flex items-center gap-3 p-3 bg-[#E0EEC6] rounded-lg border-l-4 border-[#7CA982]">
                <FontAwesomeIcon icon={faBookOpen} className="w-5 h-5 text-[#C2A83E]" />
                <Div cn="flex-1">
                    <Span cn="font-semibold text-gray-900">Upload Mid-Term Marks</Span>
                    <Span cn="text-sm text-gray-600">Class 10A - 5 students pending</Span>
                </Div>
                </Div>
                <Div cn="flex items-center gap-3 p-3 bg-[#E0EEC6] rounded-lg border-l-4 border-[#7CA982]">
                <FontAwesomeIcon icon={faCalendar} className="w-5 h-5 text-[#C2A83E]" />
                <Div cn="flex-1">
                    <Span cn="font-semibold text-gray-900">PTM with Emma's Parents</Span>
                    <Span cn="text-sm text-gray-600">Tomorrow at 11:00 AM</Span>
                </Div>
                </Div>
                <Div cn="flex items-center gap-3 p-3 bg-[#E0EEC6] rounded-lg border-l-4 border-[#7CA982]">
                <FontAwesomeIcon icon={faBoxesPacking} className="w-5 h-5 text-[#C2A83E]" />
                <Div cn="flex-1">
                    <Span cn="font-semibold text-gray-900">Review Lost Item Claims</Span>
                    <Span cn="text-sm text-gray-600">3 items have pending claims</Span>
                </Div>
                </Div>
            </Div>
            </Div>
        </Div>

        <Div cn="w-[95%]">
            <Div cn="bg-[#243E36] rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-[#7CA982] mb-4">Class Performance Overview</h2>
                <Div cn="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Div cn="text-center p-4 bg-[#E0EEC6] rounded-lg">
                        <Span cn=""><FontAwesomeIcon icon={faArrowTrendUp} className="text-xl text-[#C2A83E]" /></Span>
                        <Div cn="">
                            <Span cn="text-2xl font-bold text-[#243E36]">87%</Span>
                            <Span cn="text-sm text-[#7CA982] ml-2">Average Pass Rate</Span>
                        </Div>
                    </Div>
                    <Div cn="text-center p-4 bg-[#E0EEC6] rounded-lg">
                        <Span cn=""><FontAwesomeIcon icon={faAward} className="text-xl text-[#C2A83E]" /></Span>
                        <Div cn="">
                            <Span cn="text-2xl font-bold text-[#243E36]">78.5</Span>
                            <Span cn="text-sm text-[#7CA982] ml-2">Class Average</Span>
                        </Div>
                    </Div>
                    <Div cn="text-center p-4 bg-[#E0EEC6] rounded-lg">
                        <Span cn=""><FontAwesomeIcon icon={faUsers} className="text-xl text-[#C2A83E]" /></Span>
                        <Div cn="">
                            <Span cn="text-2xl font-bold text-[#243E36]">12</Span>
                            <Span cn="text-sm text-[#7CA982] ml-2">Top Performers</Span>
                        </Div>
                    </Div>
                </Div>
            </Div>
        </Div>
    </Section>
}