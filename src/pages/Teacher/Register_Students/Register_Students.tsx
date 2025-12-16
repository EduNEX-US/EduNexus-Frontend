import { Section, Div, Span, Button, Input } from "../../../Components/Assembler"
import useFuncs from "./Functionality"
export default function Register_Students(){
    const {teacherClasses, studentName, studentPass, studentEmail, studentMobile, studentAddress, studentGuardian, studentAltMobile, basicFee, selectedClassForCreate, students, filterClass, visibleStudents, handleStudentName, handleStudentPass, handleStudentEmail, handleStudentMobile, handleStudentAltMobile, handleStudentAddress, handleStudentGuardian, handleBasicFee, handleSelectedClassForCreate, handleFilterClass, handleCreateStudent} = useFuncs();
    return <Section cn="flex-1 p-10 overflow-auto bg-white">
        <Span cn="text-3xl font-semibold">Register Students (Teacher)</Span>

        {/* STUDENT CREATION */}
        <Div cn="rounded-2xl shadow-md border p-6 mt-4 mb-10 bg-white">
          <Span cn="text-xl font-semibold">Create Student</Span>

          <Div cn="grid grid-cols-1 md:grid-cols-3 mt-4 gap-4">
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
              labelCN="hidden"
              labelTxt="Name"
              forName="Name"
              type="text"
              inpCN="p-3 border rounded"
              inpTxt="Student Name"
              value={studentName}
              onChange={(e) => handleStudentName(e.target.value)}
            />

            <Input
              labelCN="hidden"
              labelTxt="Email"
              forName="Email"
              type="email"
              inpCN="p-3 border rounded"
              inpTxt="Student Email"
              value={studentEmail}
              onChange={(e) => handleStudentEmail(e.target.value)}
            />

            <Input
              labelCN="hidden"
              labelTxt="Address"
              type="text"
              forName="Address"
              inpCN="p-3 border rounded col-span-1 md:col-span-2"
              inpTxt="Address"
              value={studentAddress}
              onChange={(e) => handleStudentAddress(e.target.value)}
            />

            <Input
              labelCN="hidden"
              labelTxt="Guardian"
              forName="Guradian"
              type="text"
              inpCN="p-3 border rounded"
              inpTxt="Guardian Name"
              value={studentGuardian}
              onChange={(e) => handleStudentGuardian(e.target.value)}
            />

            <Input
              labelCN="hidden"
              labelTxt="Mobile"
              inpCN="p-3 border rounded"
              inpTxt="Mobile"
              forName="Mobile"
              value={`${studentMobile === 0 ? "" : studentMobile}`}
              type="phone"
              onChange={(e) => handleStudentMobile(parseInt(e.target.value))}
            />

            <Input
              labelCN="hidden"
              labelTxt="Alt. Mobile"
              inpCN="p-3 border rounded"
              inpTxt="Alternate Mobile"
              type="phone"
              forName="Alt. Mob"
              value={`${studentAltMobile === 0 ? "" : studentAltMobile}`}
              onChange={(e) => handleStudentAltMobile(parseInt(e.target.value))}
            />

            <Input
              labelCN="hidden"
              labelTxt="Guardian"
              forName="Basic Fee"
              type="number"
              inpCN="p-3 border rounded"
              inpTxt="Basic Fee"
              value={`${basicFee === 0 ? "" : basicFee}`}
              onChange={(e) => handleBasicFee(parseInt(e.target.value))}
            />
          </Div>

          <Button
            cn={`mt-6 px-6 py-2 rounded text-white ${
              !studentName ||
              !studentEmail ||
              !studentMobile ||
              !studentGuardian ||
              !basicFee ||
              !selectedClassForCreate
                ? "bg-gray-400"
                : "bg-purple-400"
            }`}
            disabled={
              !studentName ||
              !studentEmail ||
              !studentMobile ||
              !studentGuardian ||
              !basicFee ||
              !selectedClassForCreate
            }
            onClick={handleCreateStudent}
          >
            Create Student
          </Button>
        </Div>

        {/* STUDENT TABLE */}
        <Div cn="rounded-2xl shadow-md border p-6 bg-white">
          <Span cn="text-xl font-semibold mb-4">My Class Students</Span>

          {/* Class Filter */}
          <Div cn="mb-4">
            <label className="font-semibold mr-3">Filter by Class:</label>
            <select
              className="p-2 border rounded"
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

          <Div cn="overflow-auto">
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
                  <tr key={s.sid} className="border-b">
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
      </Section>
}