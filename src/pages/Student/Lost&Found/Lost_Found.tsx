import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Section, Div, Button, Span } from "../../../Components/Assembler";
import { lostFoundItems } from "./Functionality";
import {
  faLocationDot,
  faSearch,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

export default function Lost_Found() {
  return (
    <Section
      cn="
        w-full h-screen bg-orange-50 flex flex-col
        overflow-y-auto p-6
      "
    >
      {/* PAGE TITLE */}
      <h2 className="text-xl lg:text-2xl font-semibold text-amber-900 mb-6">
        Lost & Found Items
      </h2>

      {lostFoundItems.length === 0 ? (
        <Div cn="flex flex-col items-center justify-center py-20 text-amber-700">
          <FontAwesomeIcon icon={faSearch} className="text-4xl mb-3" />
          <Span cn="">No items in Lost & Found</Span>
        </Div>
      ) : (
        <Div cn="space-y-5 overflow-y-auto">
          {lostFoundItems.map((item) => (
            <Div
              key={item.id}
              cn="
                bg-white/70 border border-amber-200/40 rounded-2xl
                shadow-sm hover:shadow-md transition
                p-4 flex gap-4
              "
            >
              {/* IMAGE SLOT */}
              <Div
                cn="
                  w-28 h-28 rounded-xl border border-amber-200/40
                  bg-amber-100/50 flex items-center justify-center
                  text-amber-500 flex-shrink-0
                "
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.item}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <Div cn="flex flex-col items-center text-xs text-center">
                    <FontAwesomeIcon icon={faImage} className="text-xl mb-1" />
                    <Span cn="">Image not available</Span>
                  </Div>
                )}
              </Div>

              {/* CONTENT */}
              <Div cn="flex-1 flex flex-col justify-between">

                {/* TOP */}
                <Div cn="">
                  <Div cn="flex items-center gap-3">
                    <h3 className="font-semibold text-amber-900">
                      {item.item}
                    </h3>

                    <Span
                      cn={`
                        px-2 py-0.5 rounded-full text-xs font-medium
                        ${
                          item.status === "Found"
                            ? "bg-teal-100 text-teal-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      `}
                    >
                      {item.status}
                    </Span>
                  </Div>

                  {item.description && (
                    <p className="text-sm text-amber-700 mt-1">
                      {item.description}
                    </p>
                  )}

                  <Div cn="flex flex-wrap gap-4 mt-3 text-xs text-amber-600">
                    <Span cn="flex items-center gap-1">
                      <FontAwesomeIcon icon={faLocationDot} />
                      {item.location}
                    </Span>

                    <Span cn="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCalendar} />
                      {item.date}
                    </Span>
                  </Div>
                </Div>

                {/* ACTION */}
                {item.status === "Found" && (
                  <Div cn="mt-4">
                    <Button
                      cn="
                        px-4 py-2 text-sm rounded-lg
                        bg-teal-400 text-white
                        hover:bg-teal-500 transition
                        cursor-pointer
                      "
                      onClick={() => {}}
                    >
                      Claim Item
                    </Button>
                  </Div>
                )}
              </Div>
            </Div>
          ))}
        </Div>
      )}
    </Section>
  );
}
