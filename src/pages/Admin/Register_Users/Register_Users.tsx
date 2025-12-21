import {Section, Div, Button, Input} from '../../../Components/Assembler';
import useFuncs from './Functionality';
import type { RoleType } from './Functionality';
export default function Register_Users(){
    const {users, sDispatch, studentForm, tDispatch, teacherForm, search, handleSearch, role, handleRole, handleUserCreation, isFormInvalid} = useFuncs();

    const filteredUsers = users![role].filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase())
    );

    const formFilled : boolean = teacherForm.address === "" || teacherForm.email === "" || teacherForm.exp === 0 || teacherForm.pass === "" || teacherForm.qualification === "" || teacherForm.tClass === "" || teacherForm.tMob === 0 || teacherForm.tName === "";
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
              <Input inpTxt="Password" inpCN="text-sm lg:text-lg p-1 md:p-3 border rounded" labelCN='hidden' value={teacherForm.pass} onChange={(e) => tDispatch({type : "pass", payload : e.target.value})} labelTxt='pass' type='text' forName='pass'/>
              
              <select
                onChange={(e) => handleRole(e.target.value as RoleType)}
                value={role}
                className="text-sm lg:text-lg p-1 md:p-3 border rounded"
              >
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>

              {/* Teacher/Admin Fields */}
              {(role === "teacher" || role === "admin") && (
                <>
                  <Input inpTxt="Mobile" labelCN='hidden' value={`${teacherForm.tMob === 0 ? "" : teacherForm.tMob}`} labelTxt='Mobile' type='phone' onChange={(e) => tDispatch({type : "tMob", payload : parseInt(e.target.value)})} forName='tMobile' inpCN="p-1 text-sm lg:text-lg md:p-3 border rounded" />
                  <Input inpTxt="Classes (comma separated)" labelCN='hidden' value={`${teacherForm.tClass}`} labelTxt='Class' type='text' onChange={(e) => tDispatch({type : "tClass", payload : e.target.value})} forName='tClass' inpCN="p-1 text-sm lg:text-lg md:p-3 border rounded" />
                  <Input inpTxt="Address" inpCN={`p-1 text-sm lg:text-lg md:p-3 border rounded col-span-1 ${role === "admin" ? "md:col-span-2" : "md:col-span-3"}`} labelCN='hidden' value={`${teacherForm.address}`} labelTxt='Address' type='text' forName='address' onChange={(e) => tDispatch({type : "tAddress", payload : e.target.value})}/>
                  { role === "admin" && <Input inpTxt="Secret Key" inpCN="p-1 text-sm lg:text-lg md:p-3 border rounded col-span-1" labelCN='hidden' value={`${teacherForm.secretKey}`} labelTxt='secretKey' type='text' forName='secretKey'  onChange={(e) => tDispatch({type : "secretKey", payload : e.target.value})}/>}
                  <Input inpTxt="Experience (years)" labelCN='hidden' value={`${teacherForm.exp === 0 ? "" : teacherForm.exp}`} labelTxt='Class' type='number' onChange={(e) => tDispatch({type : "exp", payload : parseInt(e.target.value)})} forName='experience' inpCN="p-1 text-sm lg:text-lg md:p-3 border rounded" />
                  <Input inpTxt="Qualification" inpCN="p-1 text-sm lg:text-lg md:p-3 border rounded col-span-1 md:col-span-2" labelCN='hidden' value={`${teacherForm.qualification}`} labelTxt='qualification' type='text' forName='qualification'  onChange={(e) => tDispatch({type : "qualification", payload : e.target.value})}/>
                </>
              )}
            </Div>

            <Button 
            disabled = {isFormInvalid}
            cn={`mt-3 md:mt-6 text-white px-4 md:px-6 text-sm lg:text-lg py-2 rounded cursor-pointer ${isFormInvalid ? " bg-gray-400" : "bg-teal-400 hover:bg-teal-500"}`} 
            onClick={handleUserCreation}>
              Create User
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
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-100">
                      <td className="p-3">{u.name}</td>
                      <td className="p-3 capitalize text-teal-700">{role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Div>
          </Div>
        </Div>
      </Section>
}