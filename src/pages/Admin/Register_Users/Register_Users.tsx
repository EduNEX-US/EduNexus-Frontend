import {Section, Div, Button, Input} from '../../../Components/Assembler';
import useFuncs from './Functionality';
import type { RoleType } from './Functionality';
export default function Register_Users(){
    const {sDispatch, studentForm, tDispatch, teacherForm, search, handleSearch, role, handleRole, handleUserCreation} = useFuncs();
    const users = {
        student: ["Aman Kumar", "Riya Sharma", "Vivek Singh"],
        teacher: ["Mr. Verma", "Ms. Kapoor"],
        admin: ["Super Admin", "Coordinator Admin"],
    };

    const filteredUsers = users[role].filter((u) =>
        u.toLowerCase().includes(search.toLowerCase())
    );
    return <Section cn="flex-1 p-10 overflow-auto bg-white">
        <h2 className="text-3xl font-semibold mb-8">Register Users</h2>

        {/* User Creation Box */}
        <Div cn="rounded-2xl shadow-md border p-6 mb-10 bg-white">
          <h3 className="text-xl font-semibold mb-4">Create User</h3>

          <Div cn="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Common Fields */}
            { role === "student" ? (<>
                <Input inpTxt="Name" inpCN="p-3 border rounded" labelCN='hidden' value={studentForm.sName} onChange={(e) => sDispatch({type : "sName", payload : e.target.value})} labelTxt='name' type='text' forName='sName'/>
            <Input inpTxt="Email" inpCN="p-3 border rounded" labelCN='hidden' value={studentForm.email} onChange={(e) => sDispatch({type : "email", payload : e.target.value})} labelTxt='email' type='text' forName='email'/>
            <Input inpTxt="Password" inpCN="p-3 border rounded" labelCN='hidden' value={studentForm.pass} onChange={(e) => sDispatch({type : "pass", payload : e.target.value})} labelTxt='pass' type='text' forName='pass'/>
            </>) : 
            (<>
            <Input inpTxt="Name" inpCN="p-3 border rounded" labelCN='hidden' value={teacherForm.tName} onChange={(e) => tDispatch({type : "tName", payload : e.target.value})} labelTxt='name' type='text' forName='tName'/>
            <Input inpTxt="Email" inpCN="p-3 border rounded" labelCN='hidden' value={teacherForm.email} onChange={(e) => tDispatch({type : "email", payload : e.target.value})} labelTxt='email' type='text' forName='email'/>
            <Input inpTxt="Password" inpCN="p-3 border rounded" labelCN='hidden' value={teacherForm.pass} onChange={(e) => tDispatch({type : "pass", payload : e.target.value})} labelTxt='pass' type='text' forName='pass'/>
            </>)
            }

            <select
              onChange={(e) => handleRole(e.target.value as RoleType)}
              value={role}
              className="p-3 border rounded"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>

            {/* Student Fields */}
            {role === "student" && (
              <>
                <Input inpTxt="Mobile" labelCN='hidden' value={`${studentForm.sMob === 0 ? "" : studentForm.sMob}`} labelTxt='Mobile' type='phone' onChange={(e) => sDispatch({type : "sMob", payload : parseInt(e.target.value)})} forName='sMobile' inpCN="p-3 border rounded" />
                <Input inpTxt="Class" labelCN='hidden' value={`${studentForm.sClass === 0 ? "" : studentForm.sClass}`} labelTxt='Class' type='phone' onChange={(e) => sDispatch({type : "sClass", payload : parseInt(e.target.value)})} forName='sClass' inpCN="p-3 border rounded" />
                <Input inpTxt="Address" labelCN='hidden' value={studentForm.address} labelTxt='Address' type='phone' onChange={(e) => sDispatch({type : "sAddress", payload : e.target.value})} forName='sAddress' inpCN="p-3 border rounded col-span-1 md:col-span-3" />
                <Input inpTxt="Alternate Mobile" labelCN='hidden' value={`${studentForm.altMob === 0 ? "" : studentForm.altMob}`} labelTxt='Mobile' type='text' onChange={(e) => sDispatch({type : "altMob", payload : parseInt(e.target.value)})} forName='altMobile' inpCN="p-3 border rounded" />
                <Input inpTxt="Guardian" labelCN='hidden' value={studentForm.guardian} labelTxt='Guardian' type='text' onChange={(e) => sDispatch({type : "guardian", payload : e.target.value})} forName='guardian' inpCN="p-3 border rounded" />
                <Input inpTxt="Basic Fee" labelCN='hidden' value={`${studentForm.basicFee === 0 ? "" : studentForm.basicFee}`} labelTxt='Basic Fee' type='number' onChange={(e) => sDispatch({type : "basicFee", payload : parseInt(e.target.value)})} forName='basicFee' inpCN="p-3 border rounded" />
              </>
            )}

            {/* Teacher/Admin Fields */}
            {(role === "teacher" || role === "admin") && (
              <>
                <Input inpTxt="Mobile" labelCN='hidden' value={`${teacherForm.tMob === 0 ? "" : teacherForm.tMob}`} labelTxt='Mobile' type='phone' onChange={(e) => tDispatch({type : "tMob", payload : parseInt(e.target.value)})} forName='tMobile' inpCN="p-3 border rounded" />
                <Input inpTxt="Classes (comma separated)" labelCN='hidden' value={`${teacherForm.tClass}`} labelTxt='Class' type='text' onChange={(e) => tDispatch({type : "tClass", payload : e.target.value})} forName='tClass' inpCN="p-3 border rounded" />
                <Input inpTxt="Address" inpCN="p-3 border rounded col-span-1 md:col-span-3" labelCN='hidden' value={`${teacherForm.address}`} labelTxt='Address' type='text' forName='address' onChange={(e) => tDispatch({type : "tAddress", payload : e.target.value})}/>
                <Input inpTxt="Experience (years)" labelCN='hidden' value={`${teacherForm.exp}`} labelTxt='Class' type='number' onChange={(e) => tDispatch({type : "exp", payload : parseInt(e.target.value)})} forName='experience' inpCN="p-3 border rounded" />
                <Input inpTxt="Qualification" inpCN="p-3 border rounded col-span-1 md:col-span-2" labelCN='hidden' value={`${teacherForm.qualification}`} labelTxt='qualification' type='text' forName='qualification'  onChange={(e) => tDispatch({type : "exp", payload : parseInt(e.target.value)})}/>
              </>
            )}
          </Div>

          <Button cn="mt-6 text-white px-6 py-2 rounded bg-purple-400 hover:bg-purple-700/25 cursor-pointer" onClick={handleUserCreation}>
            Create User
          </Button>
        </Div>

        {/* User List */}
        <Div cn=''>
          <Div cn="flex justify-between items-center mb-4">
            <Div cn="flex gap-2">
              <Button
                onClick={() => handleRole("student")}
                cn={`px-4 py-2 rounded ${role === "student" ? "bg-gray-300" : "bg-gray-100 cursor-pointer"}`}
              >
                Students
              </Button>
              <Button
                onClick={() => handleRole("teacher")}
                cn={`px-4 py-2 rounded ${role === "teacher" ? "bg-gray-300" : "bg-gray-100 cursor-pointer"}`}
              >
                Teachers
              </Button>
              <Button
                onClick={() => handleRole("admin")}
                cn={`px-4 py-2 rounded ${role === "admin" ? "bg-gray-300" : "bg-gray-100 cursor-pointer"}`}
              >
                Admins
              </Button>
            </Div>

            {/* Search */}
            <Div cn="relative w-64">
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
          <Div cn="rounded-2xl shadow-sm border p-4 bg-white">
            <table className="w-full text-left border-collapse role">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="p-3">Name</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u} className="border-b hover:bg-gray-100">
                    <td className="p-3">{u}</td>
                    <td className="p-3 capitalize">{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Div>
        </Div>
      </Section>
}