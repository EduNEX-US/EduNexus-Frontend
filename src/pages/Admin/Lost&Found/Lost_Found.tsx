import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Div, Section, Span, Input, Button } from "../../../Components/Assembler";
import useFuncs from "./Functionality";
import { faPen } from "@fortawesome/free-solid-svg-icons";

export default function Lost_Found() {
  const {
  teachers,
  records,
  itemName,
  itemDescription,
  assignedTo,
  imageFile,
  editingId,        // ✅
  handleSaveItem,   // ✅ (replaces handleAddItem)
  startEdit,        // ✅
  cancelEdit,       // ✅
  handleAssignedTo,
  handleItemDescription,
  handleItemName,
  handleImageFile,
  handleDeleteItem, // if you already added delete
} = useFuncs();

  return (
    <Section cn="h-screen flex flex-col p-4 md:p-0 md:w-[95%] gap-y-8 bg-orange-100">
      <h2 className="text-xl md:text-3xl font-semibold mb-2 h-[7%] mt-8 text-amber-900">
        Lost & Found Management
      </h2>

      <Div cn="overflow-y-auto flex-1 mt-0 border-3 border-orange-300/50 gap-y-4 p-0">
        {/* Add Lost Item Block */}
        <Div cn="shadow-md p-6 mb-10 bg-orange-50 mx-4 mt-4">
          <Span cn="text-lg md:text-xl font-semibold mb-4 text-amber-900">
            Add Lost Item
          </Span>

          <Div cn="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mt-4 text-amber-600">
            <Input
              inpTxt="Item Name"
              inpCN="p-3 border rounded"
              value={itemName}
              onChange={(e) => handleItemName(e.target.value)}
              labelCN="hidden"
              labelTxt="Item Name"
              forName="itemName"
              type="text"
            />

            <select
              className="p-3 border rounded"
              value={assignedTo}
              onChange={(e) => handleAssignedTo(e.target.value)}
            >
              <option value="">Assign Item Under</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            {/* Image upload (pretty) */}
<Div cn="p-1 border rounded flex items-center gap-3 bg-white">
  <input
    id="lost-image"
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(e) => handleImageFile(e.target.files?.[0] ?? null)}
  />

  <label
    htmlFor="lost-image"
    className="px-4 py-2 rounded bg-teal-500 text-white cursor-pointer hover:bg-teal-600 whitespace-nowrap"
  >
    Upload Image
  </label>

  <Span cn="text-sm text-gray-700 truncate">
    {imageFile ? imageFile.name : "No file selected"}
  </Span>

  {imageFile && (
    <Button
      cn="ml-auto text-sm text-red-600 hover:underline"
      onClick={() => handleImageFile(null)}
    >
      Remove
    </Button>
  )}
</Div>


            <textarea
              placeholder="Item Description (optional)"
              className="p-3 border rounded col-span-1 md:col-span-3"
              value={itemDescription}
              onChange={(e) => handleItemDescription(e.target.value)}
            />
          </Div>

          <Button
            cn={`mt-6 px-6 py-2 rounded text-white ${
              !itemName || !assignedTo
                ? "bg-gray-400"
                : "bg-teal-400 hover:bg-teal-500"
            }`}
            onClick={handleSaveItem}
            disabled={!itemName || !assignedTo}
          >
            {editingId ? "Update Item" : "Add Item"}
          </Button>
          {editingId && (
  <Button
    cn="ml-4 text-sm text-gray-600 underline"
    onClick={cancelEdit}
  >
    Cancel
  </Button>
)}
        </Div>

        {/* Previous Lost Items Table */}
        <Div cn="shadow-md p-6 bg-orange-50 mx-4 mb-8">
          <Span cn="text-xl font-semibold mb-4 text-amber-900">
            Previous Lost & Found Records
          </Span>

          <Div cn="overflow-auto text-amber-600">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="p-3">Item</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Assigned Under</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b">
                    <td className="p-3">{record.name}</td>
                    <td className="p-3">{record.description.slice(0,20) + "..."}</td>
                    <td className="p-3 text-teal-700">
                      {teachers.find((t) => t.id === record.assignedTo)?.name ??
                        record.assignedTo}
                    </td>
                    <td className="p-3">{record.date}</td>
                    <td className="p-3">
                      {record.imageUrl ? (
                        <img
                          src={`http://localhost:8080${record.imageUrl}`}
                          alt={record.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-3">
                      <Button cn="cursor-pointer mr-4" onClick={()=> startEdit(record)}><FontAwesomeIcon icon={faPen}></FontAwesomeIcon></Button>
                      <Button cn="cursor-pointer text-red-500 hover:text-red-600" onClick={()=> handleDeleteItem(record.id)}>X</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Div>
        </Div>
      </Div>
    </Section>
  );
}
