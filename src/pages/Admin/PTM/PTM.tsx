import {Section, Div, Button, Span, Input} from '../../../Components/Assembler';
import useFuncs from './Functionality';
export default function PTM(){
  const {selectedClass, selectedStudent, selectedDate, selectedTime, selectedTeacher, students, teachers, completedPTMs, setStudents, handleFilterClass, handleSelectedClass, handleSelectedDate, handleSelectedTime, handleSelectedTeacher, handleSelectedStudent, addCompletedPTM, handleSchedule, fetchClassData, classes, filterClass} = useFuncs();
    return <Section cn="h-screen flex flex-col p-4 md:p-0 md:w-[95%] gap-y-8 bg-orange-100">
        <h2 className="text-3xl font-semibold mb-2 mt-8 h-[7%] text-amber-900">PTM Management</h2>

        <Div cn='overflow-y-auto flex-1 mt-0 border-3 border-orange-300/50 gap-y-4 p-0'>
          {/* PTM Scheduling Block */}
        <Div cn="shadow-md p-6 mb-10 bg-orange-50 mx-4 mt-4">
          <Span cn="text-xl font-semibold mb-4 text-amber-900">Schedule PTM</Span>

          {/* Class Selection (must select first) */}
          <Div cn="mb-6 text-amber-600">
            <label className="font-semibold block mb-2 text-amber-900">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                handleSelectedClass(e.target.value);
                fetchClassData(e.target.value);
              }}
              className="p-3 border rounded w-64"
            >
              <option value="">Choose Class</option>
              {classes.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Div>

          {/* PTM Details — visible but disabled until class selected */}
          <Span cn="text-lg font-semibold mb-4 text-amber-900">PTM Details</Span>

          <Div cn="grid grid-cols-1 md:grid-cols-4 text-amber-600 gap-4 items-center">
            {/* Student select (from class) */}
            <select
              disabled={!selectedClass}
              className="p-3 border rounded bg-orange-100"
              value={selectedStudent}
              onChange={(e) => handleSelectedStudent(e.target.value)}
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>

            {/* Teacher select (teachers for that class) */}
            <select
              disabled={!selectedClass}
              className="p-3 border rounded bg-orange-100"
              value={selectedTeacher}
              onChange={(e) => handleSelectedTeacher(e.target.value)}
            >
              <option value="">Select Teacher</option>
              {teachers.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Date */}
            <Input
              labelCN="hidden"
              labelTxt="Date"
              type="date"
              disabled={!selectedClass}
              inpCN="p-3 border rounded bg-orange-100"
              value={selectedDate}
              forName='ptmDate'
              inpTxt='05-11-1969'
              onChange={(e ) => handleSelectedDate(e.target.value)}
            />

            {/* Time */}
            <Input
              type="time"
              disabled={!selectedClass}
              inpCN="p-3 border rounded bg-orange-100"
              inpTxt='12:00'
              forName='Time'
              labelCN='hidden'
              labelTxt='Time'
              value={selectedTime}
              onChange={(e) => handleSelectedTime(e.target.value)}
            />
          </Div>

          <Div cn="flex gap-3 mt-6">
            <Button
              disabled={!selectedClass || !selectedStudent || !selectedTeacher || !selectedDate || !selectedTime}
              cn={`px-6 py-2 rounded text-white ${(!selectedClass || !selectedStudent || !selectedTeacher || !selectedDate || !selectedTime) ? "bg-gray-400" : "bg-teal-400 hover:bg-teal-500 cursor-pointer"}`}
              onClick={handleSchedule} 
            >
              Schedule Meeting
            </Button>
            
          </Div>
        </Div>

        {/* COMPLETED PTMs TABLE WITH CLASS FILTER */}
        <Div cn="shadow-md p-6 mb-8 bg-orange-50 mx-4 text-amber-600">
          <h3 className="text-xl font-semibold mb-4 text-amber-900">Completed PTMs</h3>

          {/* Filter by class */}
          <Div cn="mb-4 flex items-center gap-4">
            <label className="font-semibold mr-3">Filter by Class:</label>
            <select
              value={filterClass}
              onChange={(e) => handleFilterClass(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Classes</option>
              {classes.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* quick info */}
            <Div cn="ml-auto text-sm text-gray-600">Showing {completedPTMs.filter(ptm => !filterClass || ptm.sClass === filterClass).length} records</Div>
          </Div>

          <Div cn="overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b font-semibold">
                  <th className="p-3">Class</th>
                  <th className="p-3">Student</th>
                  <th className="p-3">Teacher</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {completedPTMs
                  .filter(ptm => !filterClass || ptm.sClass === filterClass)
                  .map(ptm => (
                    <tr key={ptm.id} className="border-b">
                      <td className="p-3 text-teal-700">{ptm.sClass}</td>
                      <td className="p-3">{ptm.student}</td>
                      <td className="p-3 text-teal-700">{ptm.teacher}</td>
                      <td className="p-3">{ptm.date}</td>
                      <td className="p-3">{ptm.time}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Div>
        </Div>
        </Div>
      </Section>
}