import { useState } from "react";

interface StudentForm{
    sid : number,
    sName : string;
    pass : string;
    email : string;
    mob : number;
    address : string;
    altMob : number;
    guardian : string;
    sClass : string;
    basicFee : number;
}

export default function useFuncs(){
    // Classes this teacher controls (dummy data)
  const teacherClasses = ["1A", "2B"];

  // Student creation form state
  const [studentId, setStudentId] = useState<number>(3);
  const [studentName, setStudentName] = useState<string>("");
  const [studentPass, setStudentPass] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [studentMobile, setStudentMobile] = useState<number>(0);
  const [studentAddress, setStudentAddress] = useState<string>("");
  const [studentGuardian, setStudentGuardian] = useState<string>("");
  const [studentAltMobile, setStudentAltMobile] = useState<number>(0);
  const [basicFee, setBasicFee] = useState<number>(0);
  const [selectedClassForCreate, setSelectedClassForCreate] = useState<string>("");

  // Table filter
  const [filterClass, setFilterClass] = useState<string>("");

  // Dummy student records (only from teacher's classes)
  const [students, setStudents] = useState<StudentForm[]>([
    {
      sid: 1,
      sName: "Aman Kumar",
      email: "aman@gmail.com",
      pass : "XDC45rt",
      address : "XYZ, St. City",
      mob: 9999999991,
      altMob : 4568901237,
      sClass: "1A",
      guardian: "Ramesh Kumar",
      basicFee: 1500,
    },
    {
      sid: 2,
      sName: "Riya Sharma",
      email: "riya@gmail.com",
      pass : "234cfff34tjn",
      address : "ABC, St. City",
      mob: 9999999992,
      altMob : 4568901237,
      sClass: "2B",
      guardian: "Mahesh Sharma",
      basicFee: 1700,
    },
  ]);

  const handleCreateStudent = () => {
    if (
      !studentName ||
      !studentPass ||
      !studentEmail ||
      !studentAddress ||
      !studentMobile ||
      !studentAltMobile ||
      !studentGuardian ||
      !basicFee ||
      !selectedClassForCreate
    ) return;

    const newStudent : StudentForm = {
      sid: Date.now(),
      sName: studentName,
      pass : studentPass,
      email: studentEmail,
      mob: studentMobile,
      address : studentAddress,
      altMob : studentAltMobile,
      sClass: selectedClassForCreate,
      guardian: studentGuardian,
      basicFee: basicFee,
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Reset form
    handleStudentName("");
    handleStudentEmail("");
    handleStudentMobile(0);
    handleStudentAddress("");
    handleStudentGuardian("");
    handleStudentAltMobile(0);
    handleBasicFee(0);
    handleSelectedClassForCreate("");
  };

  const visibleStudents = students.filter(
    (s) => !filterClass || s.sClass === filterClass
  );

  function handleStudentName(val : string){
    setStudentName(val);
  }

  function handleStudentPass(val : string){
    setStudentPass(val);
  }

  function handleStudentEmail(val : string){
    setStudentEmail(val);
  }

  function handleStudentMobile(val : number){
    setStudentMobile(isNaN(val) ? 0 : val);
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

  function handleSelectedClassForCreate(val : string){
    setSelectedClassForCreate(val);
  }

  function handleBasicFee(val : number){
    setBasicFee(isNaN(val) ? 0 : val);
  }

  function handleFilterClass(val : string){
    setFilterClass(val);
  }
  return {teacherClasses, studentName, studentPass, studentEmail, studentMobile, studentAddress, studentGuardian, studentAltMobile, basicFee, selectedClassForCreate, students, filterClass, visibleStudents, handleStudentName, handleStudentPass, handleStudentEmail, handleStudentMobile, handleStudentAltMobile, handleStudentAddress, handleStudentGuardian, handleBasicFee, handleSelectedClassForCreate, handleFilterClass, handleCreateStudent};
}