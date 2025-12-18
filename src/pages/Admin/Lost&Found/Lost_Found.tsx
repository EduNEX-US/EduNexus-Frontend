import {Div, Section, Span, Input, Button} from '../../../Components/Assembler';
import useFuncs from './Functionality';
export default function Lost_Found(){
    const {teachers, itemName, records, itemDescription, assignedTo, handleAddItem, handleAssignedTo, handleItemDescription, handleItemName, handleRecords} = useFuncs();
    return <Section cn="flex-1 p-10 overflow-auto bg-white">
        <h2 className="text-3xl font-semibold mb-8">Lost & Found Management</h2>

        {/* Add Lost Item Block */}
        <Div cn="rounded-2xl shadow-md border p-6 mb-10 bg-white">
          <Span cn="text-xl font-semibold mb-4">Add Lost Item</Span>

          <Div cn="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
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
            cn={`mt-6 px-6 py-2 rounded text-white ${(!itemName || !assignedTo ) ? "bg-gray-400" : "bg-purple-400"}`}
            onClick={handleAddItem}
            disabled={!itemName || !assignedTo}
          >
            Add Item
          </Button>
        </Div>

        {/* Previous Lost Items Table */}
        <Div cn="rounded-2xl shadow-md border p-6 bg-white">
          <Span cn="text-xl font-semibold mb-4">Previous Lost & Found Records</Span>

          <Div cn="overflow-auto">
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
                    <td className="p-3">{teachers.find(t => t.id === record.assignedTo)?.name}</td>
                    <td className="p-3">{record.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Div>
        </Div>
      </Section>
}