import { useEffect, useReducer, useState } from "react"
import { useAppSelector } from "../../../hooks/useAppSelector";
import Papa from "papaparse";

interface TeacherForm{
    tName : string;
    email : string;
    tMob : number;
    exp : number;
    tAddress : string;
    tClass : number;
    qualification : string;
}

type TeacherAction =
| { type: "tName", payload: string }
| { type: "email", payload: string }
| { type: "tMob", payload: number }
| { type: "exp", payload: number }
| { type: "tAddress", payload: string }
| { type: "tClass", payload: number }
| { type: "qualification", payload: string }
| { type: "reset"};


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

const initialTeachers: TeacherForm = {
  tName: "",
  email: "",
  tMob: 0,
  exp: 0,
  tAddress: "",
  tClass: 1,
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


export default function useFuncs(){
    // const [studentForm, sDispatch] = useReducer(reducer, initialStudents);
    const [importError, setImportError] = useState<string>("");
const [importRows, setImportRows] = useState<TeacherForm[]>([]);
const [importing, setImporting] = useState<boolean>(false);


    const [showCsvModal, setShowCsvModal] = useState(false);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
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

    const res = await fetch("http://localhost:8080/admin/teachers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.log("fetchTeachers failed:", res.status);
      return;
    }

    const data = await res.json();
    console.log(data)
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
    },
    body: fd,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error ?? "IMPORT_FAILED");
  console.log("Request went successfully");
  return data;
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



    async function handleUserCreation() {
  const error = validateForm();
  if (error !== null) {
    alert(error);
    return;
  }

  if (!token) {
    alert("No token found");
    return;
  }

  // backend expects CreateTeacherRequest inside `data`
  const payload = {
    role: "teacher",
    ...teacherForm,
  };

  try {
    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));

    if (imageFile) fd.append("image", imageFile);

    const res = await fetch("http://localhost:8080/admin/teacher/register-with-image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: fd,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.log("Create failed:", data);
      alert(data?.error ?? "Error creating teacher");
      return null;
    }

    console.log("User Created:", data);

    // reset form + image
    tDispatch({ type: "reset" });
    setImageFile(null);

    // refresh list
    fetchTeachers();
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

    function handleImageFile(file : File | null){
        setImageFile(file);
    }
    return {users, tDispatch, teacherForm, search, handleSearch, handleUserCreation, isFormInvalid, role, handleRole, downloadTeachersCsv, uploadTeachersCsv, fetchTeachers,  handleShowCsvModal, handleCsvFile,showCsvModal, csvFile, uploading, handleUploading, deleteTeacher, imageFile, handleImageFile};
}