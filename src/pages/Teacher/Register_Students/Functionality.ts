import { useState, useEffect } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";

interface StudentForm {
  sid: string;
  sName: string;
  email: string;
  mob: number;
  address: string;
  altMob: number;
  guardian: string;
  sClass: number;
  imageUrl?: string;
}

interface Students{
  id : string,
  name : string,
  email : string,
  address : string,
  mobile : number,
  guardian : string
}
export default function useFuncs() {
  const token = useAppSelector((s) => s.auth.token);
  const profile = useAppSelector((s: any) => s.auth.profile);

  const teacherClass = profile.tClass;

  const [showCsvModal, setShowCsvModal] = useState(false);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentMobile, setStudentMobile] = useState<number>(0);
  const [studentAddress, setStudentAddress] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [studentGuardian, setStudentGuardian] = useState("");
  const [studentAltMobile, setStudentAltMobile] = useState<number>(0);

  const [students, setStudents] = useState<Students[]>([]);

  useEffect(() => {
  if(profile?.tClass) fetchMyStudents();
}, [profile]);

  const isEmpty = (v: string | number) =>
    typeof v === "number" ? v === 0 : v.trim() === "";

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone10 = (phone: number) => /^\d{10}$/.test(String(phone));

  const validateStudentForm = () => {
    if (!token) return "NO_TOKEN";

    if (isEmpty(studentName)) return "Student name is required";
    if (studentName.trim().length < 3) return "Name must be at least 3 characters";

    if (isEmpty(studentEmail)) return "Email is required";
    if (!isValidEmail(studentEmail)) return "Invalid email format";

    if (isEmpty(studentMobile)) return "Mobile is required";
    if (!isValidPhone10(studentMobile)) return "Mobile must be 10 digits";

    if (isEmpty(studentAltMobile)) return "Alternate mobile is required";
    if (!isValidPhone10(studentAltMobile)) return "Alternate mobile must be 10 digits";
    if (studentAltMobile === studentMobile) return "Alt mobile must be different from mobile";

    if (isEmpty(studentGuardian)) return "Guardian name is required";
    if (studentGuardian.trim().length < 3) return "Guardian name must be at least 3 characters";

    if (isEmpty(studentAddress)) return "Address is required";
    if (studentAddress.trim().length < 5) return "Address is too short";

    // optional: validate image size/type
    if (imageFile) {
      const maxMb = 2;
      if (imageFile.size > maxMb * 1024 * 1024) return `Image must be <= ${maxMb}MB`;
      if (!imageFile.type.startsWith("image/")) return "Invalid image file";
    }

    return null;
  };

  async function postStudentMultipart(payload: {
    sName: string;
    email: string;
    mob: number;
    address: string;
    altMob: number;
    guardian: string;
    sClass: string;
    imageFile: File | null;
  }) {
    const fd = new FormData();
    fd.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (payload.imageFile) fd.append("image", payload.imageFile);

    const res = await fetch("http://localhost:8080/teacher/student/register-with-image", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error ?? "CREATE_FAILED");
    return data;
  }

  async function deleteStudent(id: string) {
  const res = await fetch(`http://localhost:8080/teacher/students/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if(res.ok){
    setStudents(prev => prev.filter(s => s.id !== id));
  } else {
    console.log("Failed to delete student");
  }
}

  async function handleCreateStudent() {
    const err = validateStudentForm();
    if (err) {
      alert(err);
      return;
    }

    try {
      const payload = {
        sName: studentName.trim(),
        email: studentEmail.trim(),
        mob: Number(studentMobile),
        address: studentAddress.trim(),
        altMob: Number(studentAltMobile),
        guardian: studentGuardian.trim(),
        sClass : teacherClass,
        imageFile,
      };

      const out = await postStudentMultipart(payload);

      // If backend returns created student object/id, use it.
      const newStudent: Students = {
        id: String(out?.id ?? Date.now()),
        name: payload.sName,
        email: payload.email,
        mobile: payload.mob,
        address: payload.address,
        guardian: payload.guardian,
      };

      setStudents((prev) => [newStudent, ...prev]);

      // reset
      setStudentName("");
      setStudentEmail("");
      setStudentMobile(0);
      setStudentAddress("");
      setStudentGuardian("");
      setStudentAltMobile(0);
      setImageFile(null);
    } catch (e: any) {
      alert(e?.message ?? "Student create failed");
    }
  };

  async function fetchMyStudents() {
  const classId = Number(profile.tClass);

  const res = await fetch(
    `http://localhost:8080/teacher/students/class/${classId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!res.ok) {
    console.log("Failed to fetch students");
    return;
  }

  const data = await res.json();
  setStudents(data);
  console.log(data, students);
}

  async function downloadStudentsCsv() {
  if (!token) throw new Error("NO_TOKEN");

  const res = await fetch("http://localhost:8080/teacher/student/export-csv", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("EXPORT_FAILED");

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "students_export.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);
}

  async function uploadMyStudentsCsv(file: File) {
  if (!token) throw new Error("NO_TOKEN");

  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch("http://localhost:8080/teacher/students/import-csv", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? "IMPORT_FAILED");

  // data is ImportResult: { total, success, failed, rows: [...] }
  return data;
}


  function handleStudentName(val : string){
      setStudentName(val);
    }
    function handleStudentEmail(val : string) {
      setStudentEmail(val);
    }

    function handleStudentMobile(v : number){
      setStudentMobile(isNaN(v) ? 0 : v)
    }

    function handleStudentAltMobile(val : number){
      setStudentAltMobile(isNaN(val) ? 0 : val);
    }

    function handleStudentAddress(val : string){
      setStudentAddress(val);
    }

    function handleStudentGuardian(val : string){
      setStudentGuardian(val);
    }

    function handleImageFile(val : File | null){
      setImageFile(val);
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

  return {
    teacherClass,
    studentName,
    studentEmail,
    studentMobile,
    studentAddress,
    studentGuardian,
    studentAltMobile,
    students,
    imageFile,
    showCsvModal, csvFile, uploading,
    uploadMyStudentsCsv,
    handleCsvFile,
    handleShowCsvModal,
    handleUploading,
    handleCreateStudent,
    handleStudentName,
    handleStudentEmail,
    handleStudentMobile,
    handleStudentAltMobile,
    handleStudentAddress,
    handleStudentGuardian,
    handleImageFile,
    downloadStudentsCsv,
    deleteStudent
  };
}
