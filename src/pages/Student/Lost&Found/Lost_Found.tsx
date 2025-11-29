import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Section, Div, Button, Span } from "../../../Components/Assembler";
import { lostFoundItems } from "./Functionality";
import { faLocation, faSearch } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
export default function Lost_Found(){
    return <Section cn='md:overflow-y-none overflow-y-auto md:w-5/6 w-full md:h-lvh h-5/6 flex flex-col md:flex-row justify-between'> {/* Lost & Found Section */}
        {/* <Div cn="space-y-6 w-full h-lvh"> */}
      <Div cn=" overflow-y-auto h-full p-6 shadow-sm w-full">
        <h2 className="text-2xl font-semibold text-black mb-6">Lost & Found Items</h2>
        {lostFoundItems.length === 0 ? (
          <Div cn="text-center py-12">
            <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
            <p className="text-lime-400">No items in lost & found</p>
          </Div>
        ) : (
          <Div cn="space-y-4 h-full overflow-y-auto">
            {lostFoundItems.map(item => (
              <Div key={item.id} cn="bg-white w-[99%] border-1 border-black rounded-xl p-5 hover:shadow-xs hover:shadow-black transition-shadow">
                <Div cn="flex items-start justify-between">
                  <Div cn="flex-1">
                    <Div cn="flex items-center gap-3">
                      <h3 className="font-semibold text-black">{item.item}</h3>
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
                  {/* Claim Button */}
                  {item.status === 'Found' && <Button cn="cursor-pointer px-4 py-2 bg-purple-400 text-white text-sm font-medium rounded-lg hover:bg-white hover:text-purple-400 hover:border-purple-400 border transition-colors" onClick={()=> {}}>Claim</Button>}
                </Div>
              </Div>
            ))}
          </Div>
        )}
      </Div>
    {/* </Div> */}
    </Section>
}