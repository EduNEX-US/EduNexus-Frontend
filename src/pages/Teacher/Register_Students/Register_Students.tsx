import { Section, Div, Span, Button, Input } from "../../../Components/Assembler";
import useFuncs from "./Functionality";

export default function Register_Students() {
  const {
    teacherClasses,
    studentName,
    studentEmail,
    studentMobile,
    studentAltMobile,
    studentAddress,
    studentGuardian,
    basicFee,
    selectedClassForCreate,
    filterClass,
    visibleStudents,
    handleStudentName,
    handleStudentEmail,
    handleStudentMobile,
    handleStudentAltMobile,
    handleStudentAddress,
    handleStudentGuardian,
    handleBasicFee,
    handleSelectedClassForCreate,
    handleFilterClass,
    handleCreateStudent,
  } = useFuncs();

  const isFormInvalid =
    !studentName ||
    !studentEmail ||
    !studentMobile ||
    !studentGuardian ||
    !basicFee ||
    !selectedClassForCreate;

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
            <select
              className="p-3 border rounded"
              value={selectedClassForCreate}
              onChange={(e) => handleSelectedClassForCreate(e.target.value)}
            >
              <option value="">Select Class</option>
              {teacherClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>

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
              onChange={(e) =>
                handleStudentMobile(parseInt(e.target.value))
              }
              labelTxt="mobile"
              type="tel"
              forName="mobile"
            />

            <Input
              inpTxt="Alternate Mobile"
              inpCN="p-3 border rounded"
              labelCN="hidden"
              value={`${studentAltMobile === 0 ? "" : studentAltMobile}`}
              onChange={(e) =>
                handleStudentAltMobile(parseInt(e.target.value))
              }
              labelTxt="altMobile"
              type="tel"
              forName="altMobile"
            />

            <Input
              inpTxt="Basic Fee"
              inpCN="p-3 border rounded"
              labelCN="hidden"
              value={`${basicFee === 0 ? "" : basicFee}`}
              onChange={(e) => handleBasicFee(parseInt(e.target.value))}
              labelTxt="fee"
              type="number"
              forName="fee"
            />
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
        </Div>

        {/* ================= STUDENT LIST ================= */}
        <Div cn="mb-8">

          {/* FILTER */}
          <Div cn="flex items-center gap-4 mb-4">
            <Span cn="font-semibold text-lg text-amber-900">
              Filter by Class:
            </Span>
            <select
              className="p-2 border rounded bg-teal-500 text-white focus:outline-none cursor-pointer"
              value={filterClass}
              onChange={(e) => handleFilterClass(e.target.value)}
            >
              <option value="">All My Classes</option>
              {teacherClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </Div>

          {/* TABLE */}
          <Div cn="bg-white/70 rounded-2xl border border-amber-200/40 shadow-sm p-4 text-amber-700">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Guardian</th>
                  <th className="p-3">Fee</th>
                </tr>
              </thead>
              <tbody>
                {visibleStudents.map((s) => (
                  <tr
                    key={s.sid}
                    className="border-b hover:bg-amber-100/40 transition"
                  >
                    <td className="p-3">{s.sName}</td>
                    <td className="p-3">{s.email}</td>
                    <td className="p-3">{s.mob}</td>
                    <td className="p-3">{s.sClass}</td>
                    <td className="p-3">{s.guardian}</td>
                    <td className="p-3">₹{s.basicFee}</td>
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
