import {Div, Section, Span, Button, Input} from '../../../Components/Assembler';
import useFuncs from './Functionality';

export default function PTM(){
    const {selectedStudent, selectedClass, selectedDate, selectedTime, viewMode, students, teacherClasses, scheduledPTMs, completedPTMs, handleSelectedStudent, handleSelectedClass, handleSelectedDate, handleSelectedTime, handleViewMode, handleJoinPTM, fetchStudents, handleSchedule} = useFuncs();
    return <Section cn="flex-1 p-10 overflow-auto bg-white">

        <Span cn="text-3xl font-semibold ">PTM Management (Teacher)</Span>

        {/* Scheduling Block */}
        <Div cn="rounded-2xl shadow-md border p-6 mb-10 mt-4 bg-white">
          <Span cn="text-xl font-semibold">Schedule PTM</Span>

          {/* Class Selection */}
          <label className="block font-semibold my-2">Select Class</label>
          <select
            className="p-3 border rounded w-64 mb-6"
            value={selectedClass}
            onChange={(e) => {
              handleSelectedClass(e.target.value);
              fetchStudents(e.target.value);
            }}
          >
            <option value="">Choose Class</option>
            {teacherClasses.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>

          {/* PTM Details */}
          <Div cn="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">

            {/* Student Select */}
            <select
              disabled={!selectedClass}
              className="p-3 border rounded"
              value={selectedStudent}
              onChange={(e) => handleSelectedStudent(e.target.value)}
            >
              <option value="">Select Student</option>
              {students.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>

            {/* Date */}
            <Input
              labelCN='hidden'
              labelTxt='Date'
              type="date"
              disabled={!selectedClass}
              inpCN="p-3 border rounded"
              forName='Date'
              inpTxt='Date'
              value={selectedDate}
              onChange={(e) => handleSelectedDate(e.target.value)}
            />

            {/* Time */}
            <Input
              labelCN='hidden'
              labelTxt='Time'
              forName='Time'
              inpTxt='Time'
              type="time"
              disabled={!selectedClass}
              inpCN="p-3 border rounded"
              value={selectedTime}
              onChange={(e) => handleSelectedTime(e.target.value)}
            />
          </Div>

          <Button
            cn={`mt-6 px-6 py-2 rounded text-white ${(!selectedClass || !selectedStudent || !selectedDate || !selectedTime) ? "bg-gray-400" : "bg-purple-400"}`}
            disabled={!selectedClass || !selectedStudent || !selectedDate || !selectedTime}
            onClick={handleSchedule}
          >
            Schedule PTM
          </Button>
        </Div>

        {/* Scheduled & Completed PTMs */}
        <Div cn="rounded-2xl shadow-md border p-6 bg-white">
          <Span cn="text-xl font-semibold mb-4">Your PTMs</Span>

          {/* Toggle Buttons */}
          <Div cn="relative w-64 bg-gray-300 rounded-full h-10 flex items-center mt-4 mb-6 overflow-hidden">
            {/* Sliding highlight (full height) */}
            <div
              className="absolute inset-y-0 w-1/2 rounded-full transition-all duration-300 bg-purple-400"
              style={{
                left: viewMode === "upcoming" ? "0%" : "50%",
              }}
            ></div>

            {/* Upcoming */}
            <Button
              onClick={() => handleViewMode("upcoming")}
              cn={`z-10 w-1/2 h-full text-center font-semibold transition-colors duration-300 ${
                viewMode === "upcoming" ? "text-white" : "text-black cursor-pointer"
              }`}
            >
              Upcoming
            </Button>

            {/* Completed */}
            <Button
              onClick={() => handleViewMode("completed")}
              cn={`z-10 w-1/2 h-full text-center font-semibold transition-colors duration-300 ${
                viewMode === "completed" ? "text-white" : "text-black cursor-pointer"
              }`}
            >
              Completed
            </Button>
          </Div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b font-semibold">
                <th className="p-3">Class</th>
                <th className="p-3">Student</th>
                <th className="p-3">Date</th>
                <th className="p-3">Time</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {(viewMode === "upcoming" ? scheduledPTMs : completedPTMs).map(ptm => (
                <tr key={ptm.id} className="border-b">
                  <td className="p-3">{ptm.class}</td>
                  <td className="p-3">{ptm.student}</td>
                  <td className="p-3">{ptm.date}</td>
                  <td className="p-3">{ptm.time}</td>
                  <td className="p-3 capitalize">{ptm.status}</td>

                  <td className="p-3">
                    {ptm.status === "scheduled" ? (
                      <Button
                        cn="px-4 py-1 rounded text-white bg-purple-400 cursor-pointer hover:bg-purple-700/25"
                        onClick={() => handleJoinPTM(ptm.id)}
                      >
                        Join
                      </Button>
                    ) : (
                      <span className="text-gray-500">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Div>

      </Section>
}