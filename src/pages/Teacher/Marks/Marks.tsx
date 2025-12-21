import { Div, Span, Button, Input, Section } from '../../../Components/Assembler';
import useFuncs from './Functionality';
import { useState } from 'react';

export default function Marks() {
  const {
    markForm,
    handleMarkForm,
    state,
    dispatch,
    primary,
    setPrimary,
    dummyData,
    handleSearch,
    filteredStudents,
    uploadCsv,
    uploadType,
    csvFile,
    setUploadType,
    setCsvFile
  } = useFuncs();

  // 🔥 NEW STATE

  return (
    <Section cn='bg-white relative md:w-5/6 flex flex-col items-center space-y-6 p-3 text-purple-400 overflow-y-auto'>

      {/* MODAL */}
      {markForm && (
        <Div
          cn='w-full bg-black/30 h-lvh absolute flex items-center justify-center'
          onClick={() => {
            handleMarkForm(false);
            setCsvFile(null);
          }}
        >
          <Div
            cn='grid grid-cols-1 border-1 gap-x-8 px-4 border-white md:grid-cols-2 bg-white h-[90%] w-[60%] items-center justify-around'
            onClick={(e) => e.stopPropagation()}
          >

            {/* ===================== MANUAL UPLOAD ===================== */}
            {uploadType === "manual" && (
              <>
                <Input
                  labelCN='hidden'
                  labelTxt='Class'
                  forName='Class'
                  type='number'
                  inpCN='border-2 p-3 text-purple-400'
                  inpTxt='Class'
                  onChange={(e) => {
                    let val = parseInt(e.target.value);
                    if (val > 10) val = 10;
                    if (val < 1) val = 1;
                    setPrimary(val < 6);
                  }}
                />

                <Input
                  labelCN='hidden'
                  labelTxt='Id'
                  forName='Id'
                  type="text"
                  inpCN='border-2 p-3 text-purple-400'
                  inpTxt='Student ID....'
                  onChange={(e) =>
                    dispatch({ type: "id", payload: e.target.value })
                  }
                />

                <Input
                  labelCN='hidden'
                  type='number'
                  forName='English'
                  labelTxt='English'
                  inpCN='border-2 p-3 text-purple-400'
                  inpTxt='English....'
                  value={`${state.english}`}
                  onChange={(e) => {
                    let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
                    dispatch({ type: "eng", payload: val });
                  }}
                />

                <Input
                  labelCN='hidden'
                  labelTxt='Hindi'
                  forName='Hindi'
                  type='number'
                  inpCN='border-2 p-3 text-purple-400'
                  inpTxt='Hindi....'
                  value={`${state.hindi}`}
                  onChange={(e) => {
                    let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
                    dispatch({ type: "hin", payload: val });
                  }}
                />

                <Input
                  forName='Math'
                  labelTxt='Math'
                  labelCN='hidden'
                  type='number'
                  inpCN='border-2 p-3 text-purple-400'
                  inpTxt='Math....'
                  value={`${state.math}`}
                  onChange={(e) => {
                    let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
                    dispatch({ type: "math", payload: val });
                  }}
                />

                <Input
                  labelCN='hidden'
                  labelTxt='Science'
                  forName='Science'
                  type='number'
                  inpCN='border-2 p-3 text-purple-400'
                  inpTxt='Science....'
                  value={`${state.science}`}
                  onChange={(e) => {
                    let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
                    dispatch({ type: "sci", payload: val });
                  }}
                />

                <Input
                  labelCN='hidden'
                  labelTxt='SS'
                  forName='SS'
                  type='number'
                  inpCN='border-2 p-3 text-purple-400'
                  inpTxt='Social Science....'
                  value={`${state.socialScience}`}
                  onChange={(e) => {
                    let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
                    dispatch({ type: "ss", payload: val });
                  }}
                />

                {!primary && (
                  <Input
                    labelCN='hidden'
                    labelTxt='Computer'
                    forName='Computer'
                    type='number'
                    inpCN='border-2 p-3 text-purple-400'
                    inpTxt='Computer....'
                    value={`${state.computer}`}
                    onChange={(e) => {
                      let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
                      dispatch({ type: "comp", payload: val });
                    }}
                  />
                )}

                {primary && (
                  <Input
                    labelCN='hidden'
                    labelTxt='GK'
                    forName='GK'
                    type='number'
                    inpCN='border-2 p-3 text-purple-400'
                    inpTxt='General Knowledge....'
                    value={`${state.generalKnowledge}`}
                    onChange={(e) => {
                      let val = Math.min(100, Math.max(0, parseInt(e.target.value)));
                      dispatch({ type: "gk", payload: val });
                    }}
                  />
                )}

                <Input
                  labelCN='hidden'
                  labelTxt='Result'
                  forName='Result'
                  type="date"
                  inpCN='border-2 p-3 text-purple-400'
                  inpTxt='Result Date....'
                  onChange={(e) =>
                    dispatch({ type: "rd", payload: new Date(e.target.value) })
                  }
                />

                <Button onClick={()=> alert("Hello")} cn='bg-purple-400 text-white p-3 rounded-lg text-lg'>
                  Upload
                </Button>
              </>
            )}

            {/* ===================== CSV UPLOAD ===================== */}
            {uploadType === "csv" && (
              <Div cn="flex flex-col items-center justify-center col-span-full space-y-6">

                <Input
                  forName='CSV'
                  labelTxt='CSV'
                  type="file"
                  accept=".csv"
                  labelCN="hidden"
                  inpCN="border-2 p-3 text-purple-400 w-full"
                  inpTxt="Upload CSV"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.type !== "text/csv") {
                      alert("Only CSV files are allowed");
                      return;
                    }
                    setCsvFile(file);
                  }}
                />

                <Button
                  disabled={!csvFile}
                  cn={`p-3 rounded-lg text-lg text-white ${
                    csvFile
                      ? "bg-purple-400 hover:bg-purple-500"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                  onClick={uploadCsv}
                >
                  Upload CSV
                </Button>

              </Div>
            )}

          </Div>
        </Div>
      )}

      {/* HEADER */}
      <Div cn='flex justify-between w-[95%]'>
        <Span cn='text-3xl font-semibold text-[#243E36]'>Manage Marks</Span>
        <Div cn=''>
          <Button
            cn='p-3 mr-4 border-2 border-purple-400 rounded-lg'
            onClick={() => {
              setUploadType("manual");
              handleMarkForm(true);
            }}
          >
            Upload Manually
          </Button>

          <Button
            cn='p-3 border-2 border-purple-400 rounded-lg'
            onClick={() => {
              setUploadType("csv");
              handleMarkForm(true);
            }}
          >
            Upload CSV
          </Button>
        </Div>
      </Div>

      {/* SEARCH + TABLE */}
      <Div cn='w-[95%] flex justify-between'>
        <Input
          labelCN='hidden'
          labelTxt='Search'
          forName='Search'
          type='text'
          inpCN='w-3/4 border-2 p-2 text-lg'
          inpTxt='Search for student...'
          onChange={(e) => handleSearch(e.target.value)}
        />

        <select
          value={primary ? "primary" : "secondary"}
          className='ml-auto border-2 border-purple-400 p-2'
          onChange={(e) => setPrimary(e.target.value === "primary")}
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
        </select>
      </Div>

      <Div cn='w-[95%]'>
        <table className='border-2 w-full'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Class</th>
              <th>Name</th>
              <th>English</th>
              <th>Hindi</th>
              <th>Math</th>
              <th>Science</th>
              <th>S. Science</th>
              {!primary && <th>Computer</th>}
              {primary && <th>G.K</th>}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(d => (
              <tr key={d.studentId}>
                <td>{d.studentId}</td>
                <td>{d.class}</td>
                <td>{d.name}</td>
                <td>{d.marks.English}</td>
                <td>{d.marks.Hindi}</td>
                <td>{d.marks.Math}</td>
                <td>{d.marks.Science}</td>
                <td>{d.marks['Social Science']}</td>
                {!primary && <td>{d.marks.Computer}</td>}
                {primary && <td>{d.marks['General Knowledge']}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </Div>

    </Section>
  );
}
