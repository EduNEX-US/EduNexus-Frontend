import {Section, Div, Button, Input, Span} from '../../../Components/Assembler';
import useFuncs from './Functionality';
import type { RoleType } from './Functionality';
export default function Register_Users(){
    const {users, tDispatch, teacherForm, search, handleSearch, role, handleRole, handleUserCreation, isFormInvalid, uploadTeachersCsv, downloadTeachersCsv, fetchTeachers, showCsvModal, csvFile, uploading, handleShowCsvModal, handleCsvFile, handleUploading, deleteTeacher, imageFile, handleImageFile} = useFuncs();

    const filteredUsers = users![role].filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    // const formFilled : boolean = teacherForm.tAddress === "" || teacherForm.email === "" || teacherForm.exp === 0 || teacherForm.qualification === "" || teacherForm.tClass === "" || teacherForm.tMob === 0 || teacherForm.tName === "";
    return <Section cn="h-screen flex flex-col p-4 md:p-0 md:w-[95%] gap-y-8 bg-orange-100">
        <h2 className="text-xl lg:text-3xl font-semibold flex items-center mb-2 mt-8 text-amber-900">Register Users</h2>
        <Div cn='overflow-y-auto flex-1 mt-0 border-3 border-orange-300/50 gap-y-4 p-0'>
          {/* User Creation Box */}
          <Div cn="shadow-md p-3 md:p-6 mb-10 bg-orange-50 mx-4 mt-4">
            <h3 className="text-lg md:text-xl font-semibold mb-4 text-amber-900">Create User</h3>

            <Div cn="grid grid-cols-2 md:grid-cols-3 gap-4 text-amber-600">
              {/* Common Fields */}
              <Input inpTxt="Name" inpCN="text-sm lg:text-lg p-1 md:p-3 border rounded" labelCN='hidden' value={teacherForm.tName} onChange={(e) => tDispatch({type : "tName", payload : e.target.value})} labelTxt='name' type='text' forName='tName'/>
              <Input inpTxt="Email" inpCN="text-sm lg:text-lg p-1 md:p-3 border rounded" labelCN='hidden' value={teacherForm.email} onChange={(e) => tDispatch({type : "email", payload : e.target.value})} labelTxt='email' type='text' forName='email'/>
                  <Input inpTxt="Mobile" labelCN='hidden' value={`${teacherForm.tMob === 0 ? "" : teacherForm.tMob}`} labelTxt='Mobile' type='phone' onChange={
                    (e) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    tDispatch({ type: "tMob", payload: digits === "" ? 0 : Number(digits) });
  }
                    } forName='tMobile' inpCN="p-1 text-sm lg:text-lg md:p-3 border rounded" />
                  <Input inpTxt="Classes (comma separated)" labelCN='hidden' value={`${teacherForm.tClass}`} labelTxt='Class' type='number' onChange={
                    (e) => {
                      const val = parseInt(e.target.value) > 12 ? 12 : parseInt(e.target.value) < 0 ? 1 : parseInt(e.target.value);
                      tDispatch({type : "tClass", payload : val})}} forName='tClass' inpCN="p-1 text-sm lg:text-lg md:p-3 border rounded" />
                  <Input inpTxt="Experience (years)" labelCN='hidden' value={`${teacherForm.exp}`} labelTxt='Class' type='number' onChange={
                    (e) => {
                      const val = parseInt(e.target.value) > 50 ? 50 : parseInt(e.target.value) < 0 ? 0 : parseInt(e.target.value);
                      tDispatch({type : "exp", payload : val})}} forName='experience' inpCN="p-1 text-sm lg:text-lg md:p-3 border rounded" />
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
                  <Input inpTxt="Address" inpCN={`p-1 text-sm lg:text-lg md:p-3 border rounded col-span-1 md:col-span-2`} labelCN='hidden' value={`${teacherForm.tAddress}`} labelTxt='Address' type='text' forName='address' onChange={(e) => tDispatch({type : "tAddress", payload : e.target.value})}/>
                  <Input inpTxt="Qualification" inpCN="p-1 text-sm lg:text-lg md:p-3 border rounded col-span-1" labelCN='hidden' value={`${teacherForm.qualification}`} labelTxt='qualification' type='text' forName='qualification'  onChange={(e) => tDispatch({type : "qualification", payload : e.target.value})}/>
            </Div>

            <Button 
            disabled = {isFormInvalid}
            cn={`mt-3 md:mt-6 text-white px-4 md:px-6 text-sm lg:text-lg py-2 rounded cursor-pointer ${isFormInvalid ? " bg-gray-400" : "bg-teal-400 hover:bg-teal-500"}`} 
            onClick={handleUserCreation}>
              Create User
            </Button>
              <Button cn="mt-3 md:mt-6 bg-teal-500 text-white px-4 md:px-6 lg:text-lg text-sm md:ml-8 cursor-pointer py-2 rounded hover:bg-teal-600"
  onClick={() => handleShowCsvModal(true)}
>
  Import Teachers (CSV)
</Button>

          </Div>

          {/* User List */}
          <Div cn='mx-4 mb-8'>
            <Div cn="flex justify-between items-center mb-4">
              <Div cn="flex gap-2">
                <Button
                  onClick={() => handleRole("teacher")}
                  cn={`px-4 py-2 rounded transition ease duration-300 ${role === "teacher" ? "bg-orange-400 text-orange-50" : "bg-gray-200 hover:bg-orange-400 hover:border-b-2 hover:text-orange-50 cursor-pointer"}`}
                >
                  Teachers
                </Button>
                <Button
                  onClick={() => handleRole("admin")}
                  cn={`px-4 py-2 rounded transition ease duration-300 ${role === "admin" ? "bg-orange-400 text-orange-50" : "bg-gray-200 hover:bg-orange-400 hover:border-b-2 hover:text-orange-50 cursor-pointer"}`}
                >
                  Admins
                </Button>
                <Button
      cn="px-3 py-2 rounded bg-teal-500 hover:bg-teal-600 cursor-pointer text-white"
      onClick={async () => {
        try {
          await downloadTeachersCsv();
        } catch (err) {
          alert(String(err));
        }
      }}
    >
      Download CSV
    </Button>
              </Div>

              {/* Search */}
              <Div cn="relative w-64 text-amber-600">
                <Input
                  inpTxt="Search by name"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  inpCN="pl-3 pr-3 py-2 border rounded w-full"
                  labelCN='hidden'
                  labelTxt='Search'
                  forName='search'
                  type='text'
                />
              </Div>
            </Div>

            {/* User Table */}
            <Div cn="shadow-sm p-4 bg-orange-50 text-amber-600">
              <table className="w-full text-left border-collapse role">
                <thead>
                  <tr className="border-b font-semibold">
                    <th className="p-3">Name</th>
                    <th className="p-3">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                      <tr className='bg-orange-50'>
                        <td colSpan={2} className="py-12 bg-orange-50">
                          <Div cn="flex flex-col items-center justify-center text-gray-500">
                            <i className="fa-solid fa-magnifying-glass text-4xl mb-4 text-gray-400"></i>

                            <p className="text-lg font-semibold">
                              {role === "admin" ? "No Admins Found" : "No Teachers Found"}
                            </p>

                            <p className="text-sm mt-1">
                              Try changing filters or check back later
                            </p>
                          </Div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                                    <tr key={u.id} className="border-b hover:bg-gray-100">
                                      <td className="p-3">{u.name}</td>
                                      <td className="p-3 capitalize text-teal-700">{role}</td>
                                      {role==="teacher" && <td className='p-3' onClick={()=> deleteTeacher(u.id)}>X</td>}
                                    </tr>
                                  ))
                    )
                  }
                </tbody>
              </table>
            </Div>
          </Div>
        </Div>

        {showCsvModal && (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
    <div className="bg-white w-[90%] md:w-[450px] rounded-xl p-6 shadow-lg">

      <h3 className="text-xl font-semibold text-amber-900 mb-2">
        Import Teachers
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Upload a CSV file to bulk-register teachers
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
              await uploadTeachersCsv(csvFile);
              await fetchTeachers();
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
}