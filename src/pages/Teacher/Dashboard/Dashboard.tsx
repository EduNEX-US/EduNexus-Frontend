import type { HandleTab } from "../../../Components/Sidebar/Functionality";
import { Section, Div, Span } from "../../../Components/Assembler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import teach from "../../../assets/Teaching.json";
import {
  faLocationDot,
  faPhone,
  faGraduationCap,
  faEnvelope,
  faUsers,
  faCalendar,
  faAward,
  faBookOpen,
  faClock,
  faBoxesPacking,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";
import useFuncs from "./Functionality";
import Lottie from "lottie-react";

export default function Dashboard(props: HandleTab) {
  const { teacherProfile,
    profileLoading,
    profileError,
    fetchTeacherProfileById} = useFuncs();

  return (
    <Section cn="bg-orange-50 md:w-[95%] flex flex-col items-center space-y-10 p-6 overflow-y-auto">

      {/* ================= WELCOME + PROFILE ================= */}
      <Div cn="flex justify-between items-center w-[95%] gap-6 h-1/3">
        <Lottie animationData={teach} autoPlay={true} loop={true} className="w-1/5 h-full border border-black"></Lottie>
        {/* Welcome Card */}
        <Div cn="
          h-full
          flex justify-between items-center w-3/5
          bg-orange-100
          px-8 py-8 rounded-2xl
          shadow-sm shadow-amber-200/40
        ">
          <Div cn="flex flex-col gap-1">
            <Span cn="text-2xl font-bold text-amber-900">
              Welcome Back {teacherProfile?.name}
            </Span>
            <Div cn="flex items-center text-sm text-amber-700">
              <FontAwesomeIcon icon={faGraduationCap} className="mr-2 opacity-70" />
              Phd. Computer Science
            </Div>
          </Div>
          <Span cn="bg-white rounded-full size-16 flex items-center justify-center text-3xl text-amber-900 shadow">
            <img src={`http://localhost:8080${teacherProfile?.imageUrl}`}></img>
          </Span>
        </Div>

        {/* Personal Details */}
        {/* <Div cn="
          w-2/5 bg-orange-100/70
          border border-orange-200/40
          rounded-2xl shadow-sm shadow-orange-200/40
          p-5 space-y-3
        ">
          <Span cn="font-bold text-amber-900">Personal Details</Span>

          <Div cn="flex items-center gap-3 text-sm">
            <FontAwesomeIcon icon={faEnvelope} className="text-amber-400" />
            <Span cn="text-teal-600">abcd@gmail.com</Span>
          </Div>

          <Div cn="flex items-center gap-3 text-sm">
            <FontAwesomeIcon icon={faPhone} className="text-amber-400" />
            <Span cn="text-teal-600">1234567890</Span>
          </Div>

          <Div cn="flex items-center gap-3 text-xs">
            <FontAwesomeIcon icon={faLocationDot} className="text-amber-400" />
            <Span cn="text-amber-800">
              123, Park ST., MarksTown, Austria
            </Span>
          </Div>
        </Div> */}
      </Div>

      {/* ================= STATS ================= */}
      <Div cn="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-[95%]">

        {[
          { label: "Total Students", value: teacherProfile?.students, icon: faUsers },
          { label: "Classes", value: teacherProfile?.tClass.length, icon: faBookOpen },
          // { label: "Upcoming PTMs", value: teacherProfile?.ptmMeetings.filter(m => m.status === "scheduled").length, icon: faCalendar },
          { label: "Experience", value: teacherProfile?.exp, icon: faAward },
        ].map((item, idx) => (
          <Div
            key={idx}
            cn="
              bg-white/70 rounded-xl p-6
              border border-orange-200/40
              shadow-sm shadow-orange-200/30
              flex justify-between items-center
            "
          >
            <Div cn="">
              <Span cn="text-sm font-semibold text-amber-800">{item.label}</Span>
              <Span cn="block text-3xl font-bold text-amber-700">{item.value}</Span>
            </Div>
            <FontAwesomeIcon icon={item.icon} className="text-amber-400 opacity-30 text-3xl" />
          </Div>
        ))}
      </Div>

      {/* ================= TODAY'S SCHEDULE ================= */}
      <Div cn="w-[95%] space-y-4">
        <Span cn="text-xl font-bold text-amber-900">Today's Schedule</Span>

        {teacherProfile?.tClass.split(",").map((cls, idx) => (
          <Div
            key={idx}
            cn="
              flex items-center gap-4 p-4
              bg-amber-100/80
              border border-amber-200/40
              rounded-xl shadow-sm
            "
          >
            <Div cn="w-12 h-12 bg-amber-200 rounded-lg flex items-center justify-center font-bold text-amber-900">
              {idx + 1}
            </Div>
            <Div cn="flex-1">
              <Span cn="font-semibold text-amber-900">{cls}</Span>
              <Span cn="block text-sm text-amber-700">
                Period {idx + 1} • {9 + idx}:00 - {10 + idx}:00 AM
              </Span>
            </Div>
            <FontAwesomeIcon icon={faClock} className="text-amber-600" />
          </Div>
        ))}
      </Div>

      {/* ================= PENDING TASKS ================= */}
      <Div cn="w-[95%] bg-white/70 rounded-xl p-6 border border-orange-200/40 shadow-sm">
        <Span cn="text-xl font-bold text-amber-900">Pending Tasks</Span>

        <Div cn="space-y-3 mt-4">
          {[
            { text: "Upload Mid-Term Marks", sub: "Class 10A - 5 students pending", icon: faBookOpen },
            { text: "PTM with Emma's Parents", sub: "Tomorrow at 11:00 AM", icon: faCalendar },
            { text: "Review Lost Item Claims", sub: "3 items have pending claims", icon: faBoxesPacking },
          ].map((task, idx) => (
            <Div key={idx} cn="flex gap-4 items-center p-3 border-l-4 border-amber-300 bg-white/70 rounded-lg shadow-sm">
              <FontAwesomeIcon icon={task.icon} className="text-amber-400 opacity-50" />
              <Div cn="">
                <Span cn="font-semibold text-amber-900">{task.text}</Span>
                <Span cn="block text-sm text-amber-700">{task.sub}</Span>
              </Div>
            </Div>
          ))}
        </Div>
      </Div>

      {/* ================= PERFORMANCE ================= */}
      <Div cn="w-[95%] bg-white/70 rounded-xl p-6 border border-orange-200/40 shadow-sm">
        <Span cn="text-xl font-bold text-amber-900">Class Performance Overview</Span>

        <Div cn="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {[
            { value: "87%", label: "Average Pass Rate", icon: faArrowTrendUp },
            { value: "78.5", label: "Class Average", icon: faAward },
            { value: "12", label: "Top Performers", icon: faUsers },
          ].map((item, idx) => (
            <Div key={idx} cn="text-center p-4 rounded-xl border border-orange-200/40 bg-white/70 shadow-sm">
              <FontAwesomeIcon icon={item.icon} className="text-amber-500 text-xl" />
              <Div cn="">
                <Span cn="text-2xl font-bold text-amber-700">{item.value}</Span>
                <Span cn="text-sm text-amber-700 ml-2">{item.label}</Span>
              </Div>
            </Div>
          ))}
        </Div>
      </Div>

    </Section>
  );
}
