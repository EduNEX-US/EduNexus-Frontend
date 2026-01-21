import { Section, Div, Span, Button, Input } from "../../../Components/Assembler";
import useFuncs from "./Functionality";

export default function Register_Students() {
  const {
    students,
    teacherClass,
    studentName,
    studentEmail,
    studentMobile,
    studentAltMobile,
    studentAddress,
    studentGuardian,
    imageFile,
    deleteStudent,
    uploadMyStudentsCsv,
    downloadStudentsCsv,
    handleShowCsvModal, handleCsvFile,showCsvModal, csvFile, uploading, handleUploading,
    handleImageFile,
    handleStudentName,
    handleStudentEmail,
    handleStudentMobile,
    handleStudentAltMobile,
    handleStudentAddress,
    handleStudentGuardian,
    handleCreateStudent,
  } = useFuncs();

  const isFormInvalid =
    !studentName ||
    !studentEmail ||
    !studentMobile ||
    !studentGuardian;

  return (
    <Section cn="w-full h-screen bg-orange-50 flex flex-col p-6">
      
      {/* PAGE TITLE */}
      <h2 className="text-xl lg:text-2xl font-semibold mb-8 text-amber-900">
        Register Students
      </h2>

      <Div cn="flex-1 overflow-y-auto">
        <Div cn="p-4 md:p-6 mb-10 bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-amber-900">
            Create Student
          </h3>

          <Div cn="grid grid-cols-1 md:grid-cols-3 gap-4 text-amber-600">

            {/* Class */}
            <Input
              disabled={true}
              inpCN="p-3 border rounded"
              labelCN="hidden"
              value={teacherClass}
              labelTxt="Class"
              type="number"
              forName="class"
              onChange={()=>{}}
              inpTxt="Class"
            ></Input>

            <Input
              inpTxt="Student Name"
              inpCN="p-3 border rounded"
              labelCN="hidden"
              value={studentName}
              onChange={(e) => handleStudentName(e.target.value)}
              labelTxt="name"
              type="text"
              forName="name"
            />

            <Input
              inpTxt="Student Email"
              inpCN="p-3 border rounded"
              labelCN="hidden"
              value={studentEmail}
              onChange={(e) => handleStudentEmail(e.target.value)}
              labelTxt="email"
              type="email"
              forName="email"
            />

            <Input
              inpTxt="Address"
              inpCN="p-3 border rounded md:col-span-2"
              labelCN="hidden"
              value={studentAddress}
              onChange={(e) => handleStudentAddress(e.target.value)}
              labelTxt="address"
              type="text"
              forName="address"
            />

            <Input
              inpTxt="Guardian Name"
              inpCN="p-3 border rounded"
              labelCN="hidden"
              value={studentGuardian}
              onChange={(e) => handleStudentGuardian(e.target.value)}
              labelTxt="guardian"
              type="text"
              forName="guardian"
            />

            <Input
              inpTxt="Mobile"
              inpCN="p-3 border rounded"
              labelCN="hidden"
              value={`${studentMobile === 0 ? "" : studentMobile}`}
              onChange={(e) =>{
              const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                handleStudentMobile(parseInt(digits))
              }}
              labelTxt="mobile"
              type="tel"
              forName="mobile"
            />

            <Input
              inpTxt="Alternate Mobile"
              inpCN="p-3 border rounded"
              labelCN="hidden"
              value={`${studentAltMobile === 0 ? "" : studentAltMobile}`}
              onChange={(e) =>{
                const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                handleStudentAltMobile(parseInt(digits))
              }}
              labelTxt="altMobile"
              type="tel"
              forName="altMobile"
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
          </Div>

          <Button
            disabled={isFormInvalid}
            cn={`mt-6 px-6 py-2 rounded text-white ${
              isFormInvalid
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-400 hover:bg-teal-500"
            }`}
            onClick={handleCreateStudent}
          >
            Create Student
          </Button>
                        <Button cn="mt-3 md:mt-6 bg-teal-500 text-white px-4 md:px-6 lg:text-lg text-sm md:ml-8 cursor-pointer py-2 rounded hover:bg-teal-600"
  onClick={() => handleShowCsvModal(true)}
>
  Upload Students (CSV)
</Button>
        </Div>

        {/* ================= STUDENT LIST ================= */}
        <Div cn="mb-8">

          {/* FILTER */}
          <Div cn="flex items-center gap-4 mb-4">
            <Span cn="font-semibold text-lg bg-orange-400 text-orange-50 px-4 py-2 rounded">
              Students
            </Span>
            <Button
      cn="px-3 py-2 rounded bg-teal-500 hover:bg-teal-600 cursor-pointer text-white"
      onClick={async () => {
        try {
          await downloadStudentsCsv();
        } catch (err) {
          alert(String(err));
        }
      }}
    >
      Download CSV
    </Button>
            
          </Div>

          {/* TABLE */}
          <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4 text-amber-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Guardian</th>
                  <th className="p-3">Fee</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b hover:bg-amber-100/40 transition"
                  >
                    <td className="p-3">{s.name}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">{s.mobile}</td>
                    <td className="p-3">{s.guardian}</td>
                    <td className='p-3' onClick={()=> deleteStudent(s.id)}>X</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Div>

        </Div>
      </Div>
              {showCsvModal && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white w-[90%] md:w-[450px] rounded-xl p-6 shadow-lg">

      <h3 className="text-xl font-semibold text-amber-900 mb-2">
        Upload Students
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Upload a CSV file to bulk-register students
      </p>

      {/* Upload box */}
      <label className="border-2 border-dashed border-amber-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-50">
        <i className="fa-solid fa-file-csv text-4xl text-amber-400 mb-3"></i>

        {csvFile ? (
          <span className="text-amber-800 font-medium">
            {csvFile.name}
          </span>
        ) : (
          <span className="text-gray-500">
            Click or drop CSV file here
          </span>
        )}

        <input
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleCsvFile(file);
          }}
        />
      </label>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          cn="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => {
            handleCsvFile(null);
            handleShowCsvModal(false);
          }}
        >
          Cancel
        </Button>

        <Button
          disabled={!csvFile || uploading}
          cn={`px-5 py-2 rounded text-white ${
            csvFile ? "bg-teal-500 hover:bg-teal-600" : "bg-gray-400"
          }`}
          onClick={async () => {
            if (!csvFile) return;
            try {
              handleUploading(true);
              await uploadMyStudentsCsv(csvFile);
              handleShowCsvModal(false);
              handleCsvFile(null);
            } catch (err) {
              alert(String(err));
            } finally {
              handleUploading(false);
            }
          }}
        >
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  </div>
)}
    </Section>
  );
}
