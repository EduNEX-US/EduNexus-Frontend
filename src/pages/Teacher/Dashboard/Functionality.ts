import {useState} from 'react';

export type active = "dashboard" | "marks" | "lost&found" | "ptm";

export default function useFuncs(){
  const [ptmMeetings, setPtmMeetings] = useState([
    { id: 1, studentName: "John Smith", parentName: "Mr. Robert Smith", date: "2024-11-25", time: "10:00 AM", status: "scheduled", type: "online", meetingLink: "zoom.us/j/123456" },
    { id: 2, studentName: "Emma Wilson", parentName: "Mrs. Linda Wilson", date: "2024-11-25", time: "11:00 AM", status: "scheduled", type: "in-person", location: "Staff Room" },
    { id: 3, studentName: "Michael Brown", parentName: "Mr. David Brown", date: "2024-11-23", time: "2:00 PM", status: "completed", type: "online", notes: "Discussed academic progress" },
    { id: 4, studentName: "Sophia Davis", parentName: "Mrs. Emily Davis", date: "2024-11-24", time: "3:00 PM", status: "ongoing", type: "online", meetingLink: "zoom.us/j/789012" }
  ]);
  const teacherProfile = {
    name: "Dr. Sarah Johnson",
    employeeId: "TCH001",
    email: "sarah.johnson@school.com",
    phone: "+1 234-567-8901",
    subject: "Mathematics",
    qualification: "PhD in Mathematics",
    experience: "12 years",
    joiningDate: "August 15, 2012",
    classes: ["10A - Mathematics", "10B - Mathematics", "11A - Advanced Math"],
    totalStudents: 87,
    avatar: "SJ"
  };
  return {ptmMeetings, teacherProfile};
}