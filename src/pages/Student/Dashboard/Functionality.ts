const studentData = {
  name: "Arjun Sharma",
  class: "10th - A",
  rollNo: "2024-10-042",
  admissionNo: "ADM-2020-1542",
  dob: "15 March 2009",
  bloodGroup: "B+",
  parentName: "Mr. Rajesh Sharma",
  parentPhone: "+91 98765 43210",
  parentEmail: "rajesh.sharma@email.com",
  address: "42, Green Park Colony, Sector 15, Mumbai - 400001",
  avatar: null
};

const attendanceData = [
  { name: 'Present', value: 65, color: 'oklch(62.7% 0.194 149.214)' },
  { name: 'Absent', value: 30, color: 'oklch(63.7% 0.237 25.331)' },
  { name: 'Late', value: 5, color: 'oklch(55.4% 0.046 257.417)' }
];

const recentTests : {id : number, subject : string, date : string, score : number, total : number, grade : string}[] = [
  { id: 1, subject: 'Mathematics', date: '18 Nov 2025', score: 87, total: 100, grade: 'A' },
  { id: 2, subject: 'Physics', date: '15 Nov 2025', score: 72, total: 100, grade: 'B+' },
  { id: 3, subject: 'English', date: '12 Nov 2025', score: 91, total: 100, grade: 'A+' }
];

const getGradeColor = (grade : string) => {
    if (grade.startsWith('A')) return 'text-emerald-600 bg-emerald-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-200';
    if (grade.startsWith('C')) return 'text-amber-600 bg-amber-200';
    return 'text-red-600 bg-red-50';
};

export {studentData, attendanceData, recentTests, getGradeColor};