import { useState } from "react";

type students = { id : number, name : string};
type ptms = {id : number, sClass : string, student : string, teacher : string, date : string, time : string};
export default function useFuncs(){
    const colorPrimary = "oklch(71.4% 0.203 305.504)";

  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState<students[]>([]); // students available for scheduling
  const [teachers, setTeachers] = useState<string[]>([]);

  // Completed PTMs only (attended)
  const [completedPTMs, setCompletedPTMs] = useState<ptms[]>([
    // initial sample data
    { id: 1, sClass: "1A", student: "Riya Sharma", teacher: "Ms. Kapoor", date: "2024-01-10", time: "11:00" }
  ]);
  const [filterClass, setFilterClass] = useState<string>("");

  // form fields
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");

  const classes = ["1A", "1B", "2A", "2B", "3A"];

  // simulate backend fetch for a class
  const fetchClassData = ( val : string) => {
    // In reality you'd call an API here. We return dummy data per class.
    const dummyStudents : students[] = [
      { id: 1, name: "Aman Kumar" },
      { id: 2, name: "Riya Sharma" },
      { id: 3, name: "Vivek Singh" }
    ];

    const dummyTeachers : string[] = ["Mr. Verma", "Ms. Kapoor"];

    setStudents(dummyStudents);
    setTeachers(dummyTeachers);

    // reset the scheduling form
    setSelectedStudent("");
    setSelectedTeacher("");
    setSelectedTime("");
    setSelectedDate("");
  };

  // Schedule PTM: this schedules (removes student from the scheduling list) but does NOT add to completedPTMs
  const handleSchedule = () => {
    if (!selectedClass || !selectedStudent || !selectedTeacher || !selectedTime || !selectedDate) return;

    // In production you'd POST to an API which stores scheduled PTMs. Here we just log.
    console.log("Scheduled PTM (not completed):", {
      class: selectedClass,
      student: selectedStudent,
      teacher: selectedTeacher,
      date: selectedDate,
      time: selectedTime,
    });

    // Remove the student so they can't be scheduled again
    setStudents(prev => prev.filter(s => s.name !== selectedStudent));

    // clear form so admin can schedule another
    setSelectedStudent("");
    setSelectedTeacher("");
    setSelectedTime("");
    setSelectedDate("");
  };

  // Add a completed PTM (mark attended) — admin can add this when a meeting was attended
  const addCompletedPTM = ({ id, sClass, student, teacher, date, time } : ptms) => {
    if (!sClass || !student || !teacher || !date || !time) return;
    const newEntry = { id: Date.now(), sClass: sClass, student, teacher, date, time };
    setCompletedPTMs(prev => [newEntry, ...prev]);
  };

  function handleSelectedClass(val : string){
    setSelectedClass(val);
  }

  function handleSelectedStudent(val : string){
    setSelectedStudent(val);
  }

  function handleSelectedTeacher(val : string){
    setSelectedTeacher(val);
  }

  function handleSelectedDate(val : string){
    setSelectedDate(val);
  }

  function handleSelectedTime(val : string){
    setSelectedTime(val);
  }

  function handleFilterClass(val : string){
    setFilterClass(val);
  }
  return {colorPrimary, selectedClass, students, teachers, completedPTMs, selectedStudent, selectedTeacher , classes, filterClass, selectedDate, selectedTime, setStudents, handleFilterClass, handleSelectedClass, handleSelectedDate, handleSelectedTime, handleSelectedTeacher, handleSelectedStudent, addCompletedPTM, handleSchedule, fetchClassData};
}