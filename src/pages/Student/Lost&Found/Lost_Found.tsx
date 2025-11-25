import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Section, Div, Button, Span } from "../../../Components/Assembler";
import { lostFoundItems } from "./Functionality";
import { faLocation, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
export default function Lost_Found(){
    return <Section cn='md:overflow-y-none overflow-y-auto md:w-5/6 w-full md:h-lvh h-5/6 flex flex-col md:flex-row justify-between'> {/* Lost & Found Section */}
        {/* <Div cn="space-y-6 w-full h-lvh"> */}
      <Div cn="bg-gradient-to-br from-cyan-300 to-white overflow-y-auto h-full p-6 shadow-sm w-full">
        <h2 className="text-3xl font-semibold text-slate-950 text-shadow-sm text-shadow-black mb-6">Lost & Found Items</h2>
        {lostFoundItems.length === 0 ? (
          <Div cn="text-center py-12">
            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            <p className="text-lime-400">No items in lost & found</p>
          </Div>
        ) : (
          <Div cn="space-y-4 h-full overflow-y-auto">
            {lostFoundItems.map(item => (
              <Div key={item.id} cn="bg-white w-[99%] shadow-sm shadow-gray-400 rounded-xl p-5 hover:shadow-md transition-shadow">
                <Div cn="flex items-start justify-between">
                  <Div cn="flex-1">
                    <Div cn="flex items-center gap-3">
                      <h3 className="font-semibold text-cyan-400">{item.item}</h3>
                      <Span cn={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'Found' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-600'}`}>{item.status}</Span>
                    </Div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    <Div cn="flex items-center gap-4 mt-3 text-xs text-gray-500">
                      <Span cn="flex items-center gap-1">
                        <FontAwesomeIcon icon={faLocation}></FontAwesomeIcon> {item.location}
                      </Span>
                      <Span cn="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendar}></FontAwesomeIcon>
                        {item.date}
                        </Span>
                    </Div>
                  </Div>
                  {item.status === 'Found' && <Button cn="cursor-pointer px-4 py-2 bg-cyan-400 text-white text-sm font-medium rounded-lg hover:bg-white hover:text-cyan-400 hover:text-shadow-sm hover:text-shadow-black hover:border-lime-400 border transition-colors" onClick={()=> {}}>Claim</Button>}
                </Div>
              </Div>
            ))}
          </Div>
        )}
      </Div>
    {/* </Div> */}
    </Section>
}