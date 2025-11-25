import type { HandleTab } from "../../../Components/Sidebar/Functionality"
import {Section, Button, Div , Span} from "../../../Components/Assembler"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot, faPhone, faGraduationCap, faEnvelope, faUsers, faCalendar, faAward, faBookOpen, faClock } from "@fortawesome/free-solid-svg-icons"
import useFuncs from "./Functionality"
export default function Dashboard(props : HandleTab){
    const {teacherProfile, ptmMeetings} = useFuncs();
    return <Section cn="bg-gradient-to-br from-white to-cyan-300 md:w-5/6 flex flex-col items-center space-y-6 p-4"> {/* Parent Section */}
        <Div  cn="flex justify-between items-center w-[95%] h-1/4 mt-4"> {/* Greetings Header */}
            {/* Greetings & Qualification */}
            <Div  cn="h-full w-3/6 flex justify-around items-center bg-cyan-400 rounded-xl">
                <Div  cn="h-full flex flex-col py-2 items-start justify-center">
                    <Span cn="rounded-xl w-full flex items-center text-xl font-extrabold">Welcome Back Mr. Aman Kaushik</Span>
                    <Div  cn="flex justify-start items-center text-sm text-white w-full">
                        <Span cn="text-center mr-2"><FontAwesomeIcon icon={faGraduationCap}></FontAwesomeIcon></Span>
                        <Span cn="flex justify-start items-center w-4/5">Phd. Computer Science</Span>
                    </Div >
                </Div >
                <Span cn="bg-white rounded-[50%] size-20 flex items-center justify-center text-4xl">AK</Span>
            </Div >
            {/* Personal Details */}
            <Div  cn="h-full flex items-center justify-around w-2/5">
                <Div  cn="grid grid-cols-1 w-full h-full bg-white">
                    <Span cn="px-4">Personal Details</Span>
                    <Div  cn="flex justify-start px-2 items-center">
                        <Span cn="w-[10%] text-sm text-center"><FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon></Span>
                        <Span cn="flex justify-start items-center w-[90%] text-sm">abcd@gmail.com</Span>
                    </Div >
                    <Div  cn="flex justify-start px-2 items-center">
                        <Span cn="w-[10%] text-center text-sm"><FontAwesomeIcon icon={faPhone}></FontAwesomeIcon></Span>
                        <Span cn="flex justify-start items-center w-[90%] text-sm">1234567890</Span>
                    </Div >
                    <Div  cn="flex justify-start px-2 items-center">
                        <Span cn="w-[10%] text-center"><FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon></Span>
                        <Span cn="flex justify-start font-bold items-center w-[90%] text-xs">123, Park ST., MarksTown, Austria</Span>
                    </Div >
                </Div >
            </Div >
        </Div >
        <Div cn="w-[95%]">
            <Div cn="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-around items-center content-center">
                <Div cn="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <Div cn="flex items-center justify-between">
                    <Div cn="grid grid-cols-1">
                    <Span cn="text-gray-600 text-sm">Total Students</Span>
                    <Span cn="text-3xl font-bold text-gray-900">{teacherProfile.totalStudents}</Span>
                    </Div >
                    <FontAwesomeIcon className="w-12 h-12 text-blue-500 opacity-20" icon={faUsers}/>
                </Div >
                </Div >

                <Div  cn="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <Div  cn="flex items-center justify-between">
                    <Div cn="grid grid-cols-1">
                    <Span cn="text-gray-600 text-sm">Classes</Span>
                    <Span cn="text-3xl font-bold text-gray-900">{teacherProfile.classes.length}</Span>
                    </Div >
                    <FontAwesomeIcon className="w-12 h-12 text-green-500 opacity-20" icon={faBookOpen}/>
                </Div >
                </Div >

                <Div  cn="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <Div  cn="flex items-center justify-between">
                    <Div cn="grid grid-cols-1">
                    <Span cn="text-gray-600 text-sm">Upcoming PTMs</Span>
                    <Span cn="text-3xl font-bold text-gray-900">{ptmMeetings.filter(m => m.status === 'scheduled').length}</Span>
                    </Div >
                    <FontAwesomeIcon className="w-12 h-12 text-yellow-500 opacity-20" icon={faCalendar}/>
                </Div >
                </Div >

                <Div  cn="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
                <Div  cn="flex items-center justify-between">
                    <Div cn="grid grid-cols-1">
                    <Span cn="text-gray-600 text-sm">Experience</Span>
                    <Span cn="text-3xl font-bold text-gray-900">{teacherProfile.experience}</Span>
                    </Div >
                    <FontAwesomeIcon className="w-12 h-12 text-purple-500 opacity-20" icon={faAward}/>
                </Div >
                </Div >
            </Div >
        </Div >
        <Div cn="h-2/4 w-[95%] border-1 overflow-y-auto">
            <Div cn="grid grid-cols-1 gap-6">
                {/* Today's Schedule */}
                <Div cn="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
                    <Div cn="space-y-4">
                        {teacherProfile.classes.map((cls, idx) => (
                        <Div key={idx} cn="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                            <Div cn="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                            {idx + 1}
                            </Div>
                            <Div cn="flex-1 flex flex-col">
                            <Span cn="font-semibold text-gray-900">{cls}</Span>
                            <Span cn="text-sm text-gray-600">Period {idx + 1} • {9 + idx}:00 - {10 + idx}:00 AM</Span>
                            </Div>
                            <FontAwesomeIcon icon={faClock} className="w-5 h-5 text-gray-400" />
                        </Div>
                        ))}
                    </Div>
                </Div>
            </Div>
        </Div>
        
    </Section>
}