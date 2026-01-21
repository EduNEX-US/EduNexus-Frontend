import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Section, Div, Span } from "../../../Components/Assembler";
import useFuncs from "./Functionality";
import {
  faArrowUpRightFromSquare,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { faBell, faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";

export default function Ptm() {
  const { ptmData, loading } = useFuncs(); // ✅ IMPORTANT (fetch runs here)

  console.log(ptmData);
  return (
    <Section
      cn="
        w-full h-screen bg-orange-50
        flex flex-col overflow-y-auto
        p-6
      "
    >
      {/* PAGE TITLE */}
      <Span cn="text-xl lg:text-2xl font-semibold text-amber-900 mb-6">
        Parent-Teacher Meetings
      </Span>

      {/* CONTENT WRAPPER */}
      <Div cn="flex flex-col gap-8 max-w-5xl w-full mx-auto">
        {/* ================= UPCOMING PTM ================= */}
        {ptmData.upcoming && (
          <Div
            cn="
              relative overflow-hidden
              bg-teal-400 text-white
              rounded-2xl p-6 shadow-sm
            "
          >
            <Div cn="absolute inset-x-0 top-0 h-1 bg-yellow-300">{""}</Div>

            <Div cn="flex items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faBell} className="text-yellow-300" />
              <Span cn="text-sm font-medium text-yellow-100">
                Upcoming Meeting
              </Span>
            </Div>

            <h2 className="text-lg md:text-xl font-bold mb-2">
              Parent-Teacher Meeting
            </h2>

            <p className="text-white/90 mb-4 max-w-2xl">
              {ptmData.upcoming.agenda}
            </p>

            <Div cn="flex flex-wrap gap-4 text-sm mb-5">
              <Span cn="flex items-center gap-1">
                <FontAwesomeIcon icon={faCalendar} />
                {ptmData.upcoming.date}
              </Span>
              <Span cn="flex items-center gap-1">
                <FontAwesomeIcon icon={faClock} />
                {ptmData.upcoming.time}
              </Span>
              <Span cn="flex items-center gap-1">
                <FontAwesomeIcon icon={faLocationDot} />
                {ptmData.upcoming.venue}
              </Span>
            </Div>

            {/* ✅ show Join only when link is available (Live Now) */}
            {ptmData.upcoming.meetLink ? (
              <a
                href={ptmData.upcoming.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2
                  px-5 py-2 rounded-lg
                  bg-white text-teal-500
                  font-medium
                  hover:bg-amber-50 transition
                "
              >
                <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                Join Online Meeting
              </a>
            ) : (
              <Span cn="text-sm text-white/90">
                Join link will appear when the meeting becomes Live.
              </Span>
            )}
          </Div>
        )}

        {loading && (
          <Div cn="text-sm text-amber-700">Loading PTMs...</Div>
        )}

        {/* ================= PAST MEETINGS ================= */}
        <Div
          cn="
            bg-white/70 rounded-2xl
            border border-amber-200/40
            shadow-sm p-6
          "
        >
          <Span cn="text-lg font-semibold text-amber-900 mb-5 block">
            Past Meetings
          </Span>

          <Div cn="space-y-4">
            {ptmData.past.map((meeting) => (
              <Div
                key={meeting.id}
                cn="
                  rounded-xl p-5
                  border-2 border-amber-200/40
                  hover:bg-amber-100/40 transition
                "
              >
                <Div cn="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-3">
                  <Div cn="">
                    <h3 className="font-semibold text-amber-900">
                      {meeting.teacher}
                    </h3>
                    <p className="text-sm text-amber-700">
                      {meeting.subject}
                    </p>
                  </Div>

                  <Div cn="text-sm text-amber-600 md:text-right">
                    <p>{meeting.date}</p>
                    <p>{meeting.time}</p>
                  </Div>
                </Div>

                <Div cn="bg-amber-100/60 rounded-lg p-3 text-sm text-amber-900">
                  <Span cn="font-medium">Summary: </Span>
                  {meeting.summary}
                </Div>
              </Div>
            ))}

            {!loading && ptmData.past.length === 0 && (
              <Div cn="text-sm text-gray-600">No past meetings.</Div>
            )}
          </Div>
        </Div>
      </Div>
    </Section>
  );
}
