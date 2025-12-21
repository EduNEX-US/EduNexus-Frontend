import {Div, Section, Span, Input, Button} from '../../../Components/Assembler';
import useFuncs from './Functionality';
export default function Lost_Found(){
    const {teachers, itemName, records, itemDescription, assignedTo, handleAddItem, handleAssignedTo, handleItemDescription, handleItemName, handleRecords} = useFuncs();
    return <Section cn="h-screen flex flex-col p-4 md:p-0 md:w-[95%] gap-y-8 bg-orange-100">
        <h2 className="text-xl md:text-3xl font-semibold mb-2 h-[7%] mt-8 text-amber-900">Lost & Found Management</h2>

        <Div cn='overflow-y-auto flex-1 mt-0 border-3 border-orange-300/50 gap-y-4 p-0'>
          {/* Add Lost Item Block */}
        <Div cn=" shadow-md p-6 mb-10 bg-orange-50 mx-4 mt-4">
          <Span cn="text-lg md:text-xl font-semibold mb-4 text-amber-900">Add Lost Item</Span>

          <Div cn="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mt-4 text-amber-600">
            <Input
              inpTxt="Item Name"
              inpCN="p-3 border rounded"
              value={itemName}
              onChange={(e) => handleItemName(e.target.value)}
              labelCN='hidden'
              labelTxt='Item Name'
              forName='itemName'
              type='text'
            />

            <select
              className="p-3 border rounded"
              value={assignedTo}
              onChange={(e) => {
                console.log(e.target.value)
                handleAssignedTo(e.target.value)
              }}
            >
              <option value="">Assign Item Under</option>
              {teachers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            
            <textarea
              placeholder="Item Description (optional)"
              className="p-3 border rounded col-span-1 md:col-span-2"
              value={itemDescription}
              onChange={(e) => handleItemDescription(e.target.value)}
            />
          </Div>

          <Button
            cn={`mt-6 px-6 py-2 rounded text-white ${(!itemName || !assignedTo ) ? "bg-gray-400" : "bg-teal-400 hover:bg-teal-500"}`}
            onClick={handleAddItem}
            disabled={!itemName || !assignedTo}
          >
            Add Item
          </Button>
        </Div>

        {/* Previous Lost Items Table */}
        <Div cn="shadow-md p-6 bg-orange-50 mx-4 mb-8">
          <Span cn="text-xl font-semibold mb-4 text-amber-900">Previous Lost & Found Records</Span>

          <Div cn="overflow-auto text-amber-600">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="p-3">Item</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Assigned Under</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record => (
                  <tr key={record.id} className="border-b">
                    <td className="p-3">{record.name}</td>
                    <td className="p-3">{record.description || "—"}</td>
                    <td className="p-3 text-teal-700">{teachers.find(t => t.id === record.assignedTo)?.name}</td>
                    <td className="p-3">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Div>
        </Div>
        </Div>
      </Section>
}