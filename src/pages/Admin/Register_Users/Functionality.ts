import { useEffect, useReducer, useState } from "react"
import { useAppSelector } from "../../../hooks/useAppSelector";
import Papa from "papaparse";

// interface StudentForm{
//     sName : string;
//     pass : string;
//     email : string;
//     sMob : number;
//     address : string;
//     altMob : number;
//     guardian : string;
//     sClass : number;
//     basicFee : number;
// }

interface TeacherForm{
    tName : string;
    email : string;
    tMob : number;
    exp : number;
    tAddress : string;
    tClass : string;
    qualification : string;
}

// type StudentAction =
// | { type: "sName"; payload: string }
// | { type: "pass"; payload: string }
// | { type: "email"; payload: string }
// | { type: "sMob"; payload: number }
// | { type: "sAddress"; payload: string }
// | { type: "altMob"; payload: number }
// | { type: "guardian"; payload: string }
// | { type: "sClass"; payload: number }
// | { type: "basicFee"; payload: number }
// | { type: "reset"};

type TeacherAction =
| { type: "tName", payload: string }
| { type: "email", payload: string }
| { type: "tMob", payload: number }
| { type: "exp", payload: number }
| { type: "tAddress", payload: string }
| { type: "tClass", payload: string }
| { type: "qualification", payload: string }
| { type: "reset"};

// function reducer(state : StudentForm, action : StudentAction) : StudentForm{
//     switch(action.type){
//         case "sName":
//             return {...state, sName : action.payload};
//         case "pass":
//             return {...state, pass : action.payload};
//         case "email":
//             return {...state, email : action.payload};
//         case "sMob":
//             return {...state, sMob : isNaN(action.payload) ? 0 : action.payload};
//         case "sAddress":
//             return {...state, address : action.payload};
//         case "altMob":
//             return {...state, altMob : isNaN(action.payload) ? 0 : action.payload};
//         case "guardian":
//             return {...state, guardian : action.payload};
//         case "sClass":
//             return {...state, sClass : isNaN(action.payload) ? 0 : action.payload};
//         case "basicFee":
//             return {...state, basicFee : isNaN(action.payload) ? 0 : action.payload};
//         case "reset":
//             return initialStudents;
//         default :
//             return state;
//     }
// }

function tReducer(state : TeacherForm, action : TeacherAction) : TeacherForm {
    switch(action.type){
        case "tName":
            return {...state, tName : action.payload};
        case "email":
            return {...state, email : action.payload};
        case "tMob":
            return {...state, tMob : isNaN(action.payload) ? 0 : action.payload};
        case "tAddress":
            return {...state, tAddress : action.payload};
        case "exp":
            return {...state, exp : isNaN(action.payload) ? 0 : action.payload};
        case "qualification":
            return {...state, qualification : action.payload};
        case "tClass":
            return {...state, tClass : action.payload};
        case "reset":
            return initialTeachers;
        default:
            return state;
    }
}

// const initialStudents : StudentForm = {
//     sName : "",
//     pass : "",
//     email : "",
//     sMob : 0,
//     address : "",
//     altMob : 0,
//     guardian : "",
//     sClass : 0,
//     basicFee : 0
// };

const initialTeachers: TeacherForm = {
  tName: "",
  email: "",
  tMob: 0,
  exp: 0,
  tAddress: "",
  tClass: "",
  qualification: "",
};

export type RoleType = "teacher" | "admin";
export type user = { id : string, name : string};
export interface users{
    teacher : user[],
    admin : user[]
}

const initialUsers : users = {
    teacher : [],
    admin : []
}

type ExportRow = {
  id: string;
  name: string;
  role: "teacher" | "admin";
  password: string; // always default like Welcom@123
};

const DEFAULT_PASSWORD = "Welcom@123";

function downloadCsv(filename: string, csvText: string) {
  const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function useFuncs(){
    // const [studentForm, sDispatch] = useReducer(reducer, initialStudents);
    const [importError, setImportError] = useState<string>("");
const [importRows, setImportRows] = useState<TeacherForm[]>([]);
const [importing, setImporting] = useState<boolean>(false);

    const [showCsvModal, setShowCsvModal] = useState(false);
const [csvFile, setCsvFile] = useState<File | null>(null);
const [uploading, setUploading] = useState(false);

    const [role, setRole] = useState<RoleType>("teacher");
    const token = useAppSelector((state) => state.auth.token);
    const [search, setSearch] = useState<string>("");
    const [teacherForm, tDispatch] = useReducer(tReducer, initialTeachers);
    const [users, setUsers] = useState<users>(initialUsers);

    useEffect(()=>{
        fetchTeachers();
    },[token])

    async function fetchTeachers() {
  try {
    if (!token) {
      console.log("No token found");
      return;
    }

    const res = await fetch("http://localhost:8080/teacherNames", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.log("fetchTeachers failed:", res.status);
      return;
    }

    const data = await res.json();

    setUsers({
      teacher: data.filter((d: { role: number }) => d.role === 0)
                  .map((d: { id: string; name: string }) => ({ id: d.id, name: d.name })),
      admin: data.filter((d: { role: number }) => d.role === 1)
                .map((d: { id: string; name: string }) => ({ id: d.id, name: d.name })),
    });
  } catch (e) {
    console.log("Error occurred while fetching teachers", e);
  }
}

async function uploadTeachersCsv(file: File) {
  if (!token) throw new Error("NO_TOKEN");

  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("http://localhost:8080/admin/teacher/import-csv", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ DO NOT set Content-Type for FormData
    },
    body: fd,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "IMPORT_FAILED");
  console.log("Request went successfully");
  return data; // ImportResult
}

async function downloadTeachersCsv() {
  if (!token) throw new Error("NO_TOKEN");

  const res = await fetch("http://localhost:8080/admin/teacher/export-csv", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("EXPORT_FAILED");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "teachers_export.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}

    function handleRole(val : RoleType){
        setRole(val);
    }

    function handleSearch(val : string){
        setSearch(val);
    }

    const isEmpty = (value: string | number) => {
        if (typeof value === "number") return value === 0;
        return value.trim() === "";
    };

    const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidPhone = (phone: number) => {
    return /^\d{10}$/.test(String(phone));
    };

    const validateForm = () => {
    if (isEmpty(teacherForm.tName)) return "Name is required";
    if (isEmpty(teacherForm.email)) return "Email is required";
    if (!isValidEmail(teacherForm.email)) return "Invalid email format";
    if (isEmpty(teacherForm.tMob)) return "Mobile number is required";
    if (!isValidPhone(teacherForm.tMob)) return "Mobile must be 10 digits";
    if (isEmpty(teacherForm.tClass)) return "Class is required";
    if (isEmpty(teacherForm.tAddress)) return "Address is required";
    if (isEmpty(teacherForm.exp)) return "Experience is required";
    if (isEmpty(teacherForm.qualification)) return "Qualification is required";

    return null;
    };

    const formError = validateForm();
    const isFormInvalid = Boolean(formError);

    async function handleUserCreation(){
        const error = validateForm();
        let payload;
        if(error !== null){
            alert(error);
            return;
        }
            payload = { role : "teacher", ...teacherForm};
            tDispatch({ type : "reset"});
        try {
            const res = await fetch("http://localhost:8080/admin/teacher/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });
            if(res.ok){
                fetchTeachers();
            }
            const data = await res.json();
            console.log("User Created:", data);
            return data;
        } catch (err) {
            console.error("Error creating user:", err);
            return null;
        }
    }

    async function deleteTeacher(id: string) {
        if (!token) throw new Error("NO_TOKEN");

        const res = await fetch(`http://localhost:8080/admin/teacher/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error ?? "DELETE_FAILED")
            else{
                setUsers({
                    teacher : users.teacher.filter(e => e.id != id),
                    admin : users.admin
                })
            };
        return data;
    }


    function handleShowCsvModal(val : boolean){
        setShowCsvModal(val);
    }

    function handleCsvFile(val : File | null){
        setCsvFile(val);
    }

    function handleUploading(val : boolean){
        setUploading(val);
    }
    return {users, tDispatch, teacherForm, search, handleSearch, handleUserCreation, isFormInvalid, role, handleRole, downloadTeachersCsv, uploadTeachersCsv, fetchTeachers, showCsvModal, csvFile, uploading, handleShowCsvModal, handleCsvFile, handleUploading, deleteTeacher};
}