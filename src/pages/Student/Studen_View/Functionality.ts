// const Dashboard = () => (
//     <div className="space-y-6">
//       <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-4">
//             <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
//               {studentData.name.split(' ').map(n => n[0]).join('')}
//             </div>
//             <div>
//               <h1 className="text-2xl font-bold">{studentData.name}</h1>
//               <p className="text-indigo-100">Class {studentData.class} | Roll No: {studentData.rollNo}</p>
//               <p className="text-indigo-200 text-sm mt-1">Admission No: {studentData.admissionNo}</p>
//             </div>
//           </div>
//           <div className="text-right text-sm">
//             <p className="text-indigo-100">Academic Year</p>
//             <p className="font-semibold">2025-26</p>
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h2>
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-3">
//               <div><p className="text-xs text-gray-500">Date of Birth</p><p className="font-medium text-gray-800">{studentData.dob}</p></div>
//               <div><p className="text-xs text-gray-500">Blood Group</p><p className="font-medium text-gray-800">{studentData.bloodGroup}</p></div>
//               <div><p className="text-xs text-gray-500">Parent/Guardian</p><p className="font-medium text-gray-800">{studentData.parentName}</p></div>
//             </div>
//             <div className="space-y-3">
//               <div><p className="text-xs text-gray-500">Contact Number</p><p className="font-medium text-gray-800">{studentData.parentPhone}</p></div>
//               <div><p className="text-xs text-gray-500">Email</p><p className="font-medium text-gray-800 text-sm">{studentData.parentEmail}</p></div>
//               <div><p className="text-xs text-gray-500">Address</p><p className="font-medium text-gray-800 text-sm">{studentData.address}</p></div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4">Attendance</h2>
//           <div className="h-40">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie data={attendanceData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value" label={({ name, value }) => `${value}%`} labelLine={false}>
//                   {attendanceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
//                 </Pie>
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//           <div className="flex justify-center gap-4 mt-2">
//             {attendanceData.map((item, i) => (
//               <div key={i} className="flex items-center gap-1 text-xs">
//                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
//                 <span className="text-gray-600">{item.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-lg font-semibold text-gray-800">Recent Tests</h2>
//           <button onClick={() => setActiveTab('marks')} className="text-indigo-600 text-sm font-medium flex items-center gap-1 hover:underline">
//             View All <ChevronRight size={16} />
//           </button>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           {recentTests.map(test => (
//             <div key={test.id} className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="font-semibold text-gray-800">{test.subject}</h3>
//                   <p className="text-xs text-gray-500">{test.date}</p>
//                 </div>
//                 <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getGradeColor(test.grade)}`}>{test.grade}</span>
//               </div>
//               <div className="mt-3">
//                 <div className="flex items-end gap-1">
//                   <span className="text-2xl font-bold text-gray-800">{test.score}</span>
//                   <span className="text-gray-500 text-sm mb-1">/ {test.total}</span>
//                 </div>
//                 <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
//                   <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${test.score}%` }} />
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

import {useState} from 'react';

export type active = "dashboard" | "marks" | "lost&found" | "ptm";
export default function useStudent(){
  const [activeTab, setActiveTab] = useState<active>("dashboard");

  function handleActiveTab(val : active){
    setActiveTab(val);
  }

  return {activeTab, handleActiveTab};
}