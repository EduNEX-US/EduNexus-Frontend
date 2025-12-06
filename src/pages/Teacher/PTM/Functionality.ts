import { useState } from "react";

type student = { id : number, name : string};
type ptms = {id: number, class: string, student: string, date: string, time: string, status: string };

export default function useFuncs(){

    // Teacher teaches these classes (dummy data)
    const teacherClasses : string[] = ["1A", "2B"];

    const [selectedClass, setSelectedClass] = useState<string>("");
    const [students, setStudents] = useState<student[]>([]);
    const [scheduledPTMs, setScheduledPTMs] = useState<ptms[]>([]);
    const [completedPTMs, setCompletedPTMs] = useState<ptms[]>([
        // sample completed PTM
        { id: 999, class: "1A", student: "Riya Sharma", date: "2025-01-10", time: "11:00", status: "completed" }
    ]);
    const [viewMode, setViewMode] = useState("upcoming"); // upcoming | completed
    const [selectedStudent, setSelectedStudent] = useState<string>("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");

    const dummy: Record<string, student[]> = {
        "1A": [
            { id: 1, name: "Aman Kumar" },
            { id: 2, name: "Riya Sharma" }
        ],
        "2B": [
            { id: 3, name: "Karan Mehta" },
            { id: 4, name: "Neha Singh" }
        ]
    };
  // Dummy fetch of students for selected class
    const fetchStudents = (cls: string): void => {

        handleStudents(cls);
        handleSelectedStudent("");
        handleSelectedDate("");
        handleSelectedTime("");
    };

    const handleSchedule = () => {
        if (!selectedClass || !selectedStudent || !selectedDate || !selectedTime) return;

        const entry = {
        id: Date.now(),
        class: selectedClass,
        student: selectedStudent,
        date: selectedDate,
        time: selectedTime,
        status: "scheduled"
        };

        handleScheduledPTMs(entry);

        handleSelectedStudent("");
        handleSelectedDate("");
        handleSelectedTime("");
    };

    function handleStudents(val : string){
        setStudents(dummy[val] || []);
    }
    function handleSelectedStudent( val : string){
        setSelectedStudent(val);
    }

    function handleScheduledPTMs(val : ptms){
        setScheduledPTMs(prev => [val, ...prev]);
    }

    function handleSelectedDate(val : string){
        setSelectedDate(val);
    }

    function handleSelectedTime(val : string){
        setSelectedTime(val);
    }

    function handleSelectedClass(val : string){
        setSelectedClass(val);
    }

    function handleViewMode(val : "upcoming" | "completed"){
        setViewMode(val);
    }

    function handleCompletedPTMs(val : ptms){
        setCompletedPTMs(prev => [val,...prev]);
    }

    function handleJoinPTM (ptmId : number){
        alert("Joining PTM ID: " + ptmId + " (video call or meeting page to open)");
    };

    return {selectedStudent, selectedClass, selectedDate, selectedTime, viewMode, students, teacherClasses, scheduledPTMs, completedPTMs, handleSelectedStudent, handleSelectedClass, handleSelectedDate, handleSelectedTime, handleViewMode, handleStudents, handleScheduledPTMs, handleCompletedPTMs, handleJoinPTM, fetchStudents, handleSchedule};
}