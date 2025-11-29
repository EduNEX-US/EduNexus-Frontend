import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Section, Div, Button, Span } from "../../../Components/Assembler";
import { ptmData } from "./Functionality";
import { faArrowUpRightFromSquare, faLocation } from "@fortawesome/free-solid-svg-icons";
import { faBell, faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
export default function Ptm(){
    return <Section cn='md:overflow-y-none overflow-y-auto md:w-5/6 w-full md:h-lvh h-5/6 flex flex-col justify-around items-center gap-4'> {/* PTM Section */}
      {/* Upcoming PTM Notifier */}
      {ptmData.upcoming && (
        <Div cn="bg-purple-400 rounded-xl p-6 text-white w-[95%] md:w-3/4 ml-3 mt-4">
          <Div cn="flex items-center gap-2 mb-3"><FontAwesomeIcon className="text-yellow-300" icon={faBell}></FontAwesomeIcon><Span cn="text-sm font-medium text-yellow-300">Upcoming Meeting</Span></Div>
          <h2 className="text-sm md:text-xl font-bold mb-2">Parent-Teacher Meeting</h2>
          <p className="text-indigo-100 mb-4">{ptmData.upcoming.agenda}</p>
          <Div cn="flex flex-wrap gap-4 text-sm mb-4">
            <Span cn="flex items-center gap-1"><FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon> {ptmData.upcoming.date}</Span>
            <Span cn="flex items-center gap-1"><FontAwesomeIcon icon={faClock}></FontAwesomeIcon> {ptmData.upcoming.time}</Span>
            <Span cn="flex items-center gap-1"><FontAwesomeIcon icon={faLocation}></FontAwesomeIcon> {ptmData.upcoming.venue}</Span>
          </Div>
          <a href={ptmData.upcoming.meetLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-purple-400 font-medium rounded-lg hover:bg-indigo-50 transition-colors">
            <FontAwesomeIcon icon={faArrowUpRightFromSquare}></FontAwesomeIcon> Join Online Meeting
          </a>
        </Div>
      )}

      {/* Previously Held Meetings */}
      <Div cn="bg-white rounded-xl p-6 border-1 border-black w-[95%]  ml-3 md:w-3/4">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Past Meetings</h2>
        <Div cn="space-y-4">
          {ptmData.past.map(meeting => (
            <Div key={meeting.id} cn="border-1 border-black rounded-xl text-black p-5">
              <Div cn="flex items-start justify-between mb-3">
                <Div cn=""><h3 className="font-semibold">{meeting.teacher}</h3><p className="text-sm text-gray-500">{meeting.subject}</p></Div>
                <Div cn="text-right text-sm text-gray-500"><p>{meeting.date}</p><p>{meeting.time}</p></Div>
              </Div>
              <Div cn="bg-purple-400 rounded-lg p-3"><p className="text-sm text-white"><Span cn="font-medium text-black">Summary: </Span>{meeting.summary}</p></Div>
            </Div>
          ))}
        </Div>
      </Div>
    </Section>
}