import { Section, Div, Span, Button, Input } from "../../../Components/Assembler";
import useFuncs from "./Functionality";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
export default function Lost_Found() {
  const {
    itemName,
    itemDescription,
    records,
    imageFile,
    startEdit,
    handleDeleteItem,
    handleImageFile,
    handleSaveItem,
    handleItemName,
    handleItemDescription,
  } = useFuncs();

  return (
    <Section cn="w-full h-screen bg-orange-50 flex flex-col p-6">
      
      {/* PAGE TITLE */}
      <h2 className="text-xl lg:text-2xl font-semibold mb-8 text-amber-900">
        Lost & Found
      </h2>

      {/* SCROLLABLE CONTENT */}
      <Div cn="flex-1 overflow-y-auto space-y-10">

        {/* ================= ADD LOST ITEM ================= */}
        <Div cn="p-4 md:p-6 bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm">
          <Span cn="text-lg md:text-xl font-semibold mb-4 block text-amber-900">
            Add Lost Item
          </Span>

          <Div cn="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-600">

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
              className="p-3 border rounded col-span-1 md:col-span-2 text-amber-700"
              value={itemDescription}
              onChange={(e) => handleItemDescription(e.target.value)}
            />
          </Div>

          <Button
            cn={`mt-6 px-6 py-2 rounded text-white ${
              !itemName
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-400 hover:bg-teal-500"
            }`}
            onClick={handleSaveItem}
            disabled={!itemName}
          >
            Add Item
          </Button>
        </Div>

        {/* ================= LOST & FOUND TABLE ================= */}
        <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4 text-amber-700 mb-6">

          <Span cn="text-lg md:text-xl font-semibold mb-4 block text-amber-900">
            Lost & Found Records
          </Span>

          <Div cn="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="p-3">Item</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Image</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr
                    key={record.id}
                    className="border-b hover:bg-amber-100/40 transition"
                  >
                    <td className="p-3">{record.name}</td>
                    <td className="p-3">
                      {record.description || "—"}
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
