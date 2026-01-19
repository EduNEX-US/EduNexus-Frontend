import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Section, Div, Button, Span } from "../../../Components/Assembler";
import useFuncs from "./Functionality";
import {
  faLocationDot,
  faSearch,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";

export default function Lost_Found() {
  const {items,
    itemsLoading,
    itemsError,
    fetchItems,
    // claim
    claimItem,
    claimingItemId,
    claimError,
    claimSuccess} = useFuncs();

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

      {items.length === 0 ? (
        <Div cn="flex flex-col items-center justify-center py-20 text-amber-700">
          <FontAwesomeIcon icon={faSearch} className="text-4xl mb-3" />
          <Span cn="">No items in Lost & Found</Span>
        </Div>
      ) : (
        <Div cn="space-y-5 overflow-y-auto">
          {items.map((item) => (
            <Div
              key={item.itemId}
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
    overflow-hidden
  "
>
  {item.imageUrl ? (
    <img
      className="w-full h-full object-cover"
      src={
        item.imageUrl?.startsWith("http")
          ? item.imageUrl
          : `http://localhost:8080${item.imageUrl}`
      }
      alt={item.itemName}
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
                      {item.itemName}
                    </h3>

                    <Span
                      cn={`
                        px-2 py-0.5 rounded-full text-xs font-medium
                        ${
                          item.delivered
                            ? "bg-teal-100 text-teal-700"
                            : "bg-amber-100 text-amber-700"
                        }
                      `}
                    >
                      {item.delivered}
                    </Span>
                  </Div>

                  {item.itemDescription && (
                    <p className="text-sm text-amber-700 mt-1">
                      {item.itemDescription}
                    </p>
                  )}

                  <Div cn="flex flex-wrap gap-4 mt-3 text-xs text-amber-600">

                    <Span cn="flex items-center gap-1">
                      <FontAwesomeIcon icon={faCalendar} />
                      {item.date}
                    </Span>
                  </Div>
                </Div>

                {/* ACTION */}
                {!item.delivered && (
                  <Div cn="mt-4">
                    <Button
                      cn="
                        px-4 py-2 text-sm rounded-lg
                        bg-teal-400 text-white
                        hover:bg-teal-500 transition
                        cursor-pointer
                      "
                      onClick={() => claimItem(item.itemId)}
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
