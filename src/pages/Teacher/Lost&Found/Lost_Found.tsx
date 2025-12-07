import { Section, Div, Span, Button, Input } from "../../../Components/Assembler";
import useFuncs from "./Functionality";

export default function Lost_Found(){
    const {itemName, itemDescription, records, handleAddItem, handleItemName, handleItemDescription} = useFuncs();
    return <Section cn="flex-1 p-10 overflow-auto bg-white">
        <Span cn="text-3xl font-semibold ">Lost & Found (Teacher)</Span>

        {/* Add Lost Item Block */}
        <Div cn="rounded-2xl shadow-md border p-6 mb-10 bg-white mt-4">
          <Span cn="text-xl font-semibold">Add Lost Item</Span>

          <Div cn="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4">
            <Input
              inpTxt="Item Name"
              inpCN="p-3 border rounded"
              labelCN="hidden"
              labelTxt="Item Name"
              forName="Item Name"
              type="text"
              value={itemName}
              onChange={(e) => handleItemName(e.target.value)}
            />

            <textarea
              placeholder="Item Description (optional)"
              className="p-3 border rounded col-span-1 md:col-span-2"
              value={itemDescription}
              onChange={(e) => handleItemDescription(e.target.value)}
            />
          </Div>

          <Button
            cn={`mt-6 px-6 py-2 rounded text-white ${!itemName ? "bg-gray-400" : "bg-purple-400"}`}
            onClick={handleAddItem}
            disabled={!itemName}
          >
            Add Item
          </Button>
        </Div>

        {/* Previous Lost Items Table */}
        <Div cn="rounded-2xl shadow-md border p-6 bg-white">
          <Span cn="text-xl font-semibold mb-4">Lost & Found Records</Span>

          <Div cn="overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="p-3">Item</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="p-3">{record.name}</td>
                    <td className="p-3">{record.description || "—"}</td>
                    <td className="p-3">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Div>
        </Div>
      </Section>
}