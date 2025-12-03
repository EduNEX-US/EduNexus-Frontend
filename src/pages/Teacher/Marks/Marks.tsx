import {Div, Span, Button,Input, Section} from '../../../Components/Assembler';
import useFuncs from './Functionality';
export default function Marks(){
    const {markForm, handleMarkForm, state, dispatch, primary, setPrimary, dummyData, handleSearch, filteredStudents} = useFuncs();
    return<Section cn='bg-white relative md:w-5/6 flex flex-col items-center space-y-6 p-3 text-purple-400 overflow-y-auto'>{/* Parent Section */}
    {markForm &&
    <Div cn='w-full bg-black/30 h-lvh absolute flex items-center justify-center' onClick={()=> handleMarkForm(false)}>
        <Div cn='grid grid-cols-1 border-1 gap-x-8 px-4 border-white md:grid-cols-2 bg-white h-[90%] w-[60%] items-center justify-around' onClick={(e) => e.stopPropagation()}>
            <Input labelCN='hidden' onChange={(e) => { let val : number = parseInt(e.target.value);
                if(val>10) val = 10;
            if(val<1) val = 1;
            if(val<6) setPrimary(true);
            else setPrimary(false);
            }} type='number' inpCN='border-2 p-1 p-3 text-purple-400' inpTxt='Class' labelTxt='Class....' forName='sClass'></Input>
            {/* Student ID */}
                <Input labelCN='hidden' onChange={(e) => dispatch({type : "id", payload : e.target.value})} type="text" inpCN='border-2 p-1 p-3 text-purple-400' inpTxt='Student ID....' labelTxt='StudentId' forName='id'></Input>

            {/* English Marks */}
                <Input labelCN='hidden' onChange={(e) => {let val : number = parseInt(e.target.value);
                    if(val>100) val = 100;
                if(val<0) val = 0;
                    dispatch({type : "eng", payload : val})}} type='number' inpCN='border-2 p-1 p-3 text-purple-400' inpTxt='English....' value={`${state.english}`} labelTxt='English' forName='eng'></Input>

            {/* Hindi Marks */}
                <Input labelCN='hidden' onChange={(e) => { let val : number = parseInt(e.target.value);
                    if(val>100) val = 100;
                if(val<0) val = 0;
                    dispatch({type : "hin", payload : val})}} inpCN='border-2 p-1 p-3 text-purple-400' type='number' inpTxt='Hindi....' value={`${state.hindi}`} labelTxt='Hindi' forName='hin'></Input>

            {/* Math Marks */}
                <Input labelCN='hidden' onChange={(e) => { let val : number = parseInt(e.target.value);
                    if(val>100) val = 100;
                if(val<0) val = 0;
                    dispatch({type : "math", payload : val})}} inpCN='border-2 p-1 p-3 text-purple-400' type='number' value={`${state.math}`} inpTxt='Math....' labelTxt='Math' forName='math'></Input>

            {/* Science Marks */}
                <Input labelCN='hidden' onChange={(e) => { let val : number = parseInt(e.target.value);
                    if(val>100) val = 100;
                if(val<0) val = 0;
                    dispatch({type : "sci", payload : val})}} inpCN='border-2 p-1 p-3 text-purple-400' type='number' inpTxt='Science....' value={`${state.science}`} labelTxt='Science' forName='sci'></Input>

            {/* SS Marks */}
                <Input labelCN='hidden' onChange={(e) => { let val : number = parseInt(e.target.value);
                if(val>100) val = 100;
                if(val<0) val = 0;
                    dispatch({type : "ss", payload : val})}} inpCN='border-2 p-1 p-3 text-purple-400' type='number' value={`${state.socialScience}`} inpTxt='Social Science....' labelTxt='Social Science' forName='ss'></Input>

            {/* Computer Marks */}
            {!primary && 
                <Input labelCN='hidden' onChange={(e) => { let val : number = parseInt(e.target.value);
                if(val>100) val = 100;
                if(val<0) val = 0;
                    dispatch({type : "comp", payload : val})}} inpCN='border-2 p-1 p-3 text-purple-400' type='number' inpTxt='Computer....' labelTxt='Computer' value={`${state.computer}`} forName='comp'></Input>}

            {/* GK Marks */}
            {primary && 
                <Input labelCN='hidden' onChange={(e) => { let val : number = parseInt(e.target.value);
                if(val>100) val = 100;
                if(val<0) val = 0;
                    dispatch({type : "gk", payload : val})}} type='number' inpCN='border-2 p-1 p-3 text-purple-400' value={`${state.generalKnowledge}`} inpTxt='General Knowledge....' labelTxt='General Knowledge' forName='gk'></Input>}

            {/* Result Date */}
                <Input labelCN='hidden' onChange={(e) => dispatch({type : "rd", payload : new Date(e.target.value)})} type="date" inpCN='border-2 p-1 p-3 text-purple-400' inpTxt='Result Date....' labelTxt='Result Date' forName='rd'></Input>

            {/* Submit Date */}
            <Button onClick={()=> {}} cn='bg-purple-400 text-white p-3 rounded-lg text-lg cursor-pointer' >Upload</Button>
        </Div>
    </Div>
    }
    <Div cn='flex justify-between w-[95%]'>
        <Div cn='flex w-2/5'>
            <Span cn='w-full text-3xl flex items-center text-[#243E36]'>Manage Marks</Span>
        </Div>
        <Div cn='flex justify-end w-2/5'>
            <Button cn='p-3 text-purple-400 text-lg border-2 border-purple-400 hover:bg-purple-400 hover:text-white cursor-pointer text-[#7CA982] rounded-lg' onClick={()=>handleMarkForm(true)}>Upload</Button>
        </Div>
    </Div>
    <Div cn='w-[95%] flex justify-between'>
        <Input forName='student' type='text' labelCN='' labelTxt='' inpCN=' w-3/4 border-2 p-2 text-lg' onChange={(e )=> handleSearch(e.target.value)} inpTxt='Search for student...'></Input>
        <select value={primary ? "primary" : "secondary"} className='ml-auto border-2 border-purple-400 p-2' onChange={(e) => setPrimary(e.target.value === "primary")}>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
        </select>
    </Div>
    <Div cn='w-[95%]'>
        <table className='border-2 w-full teach'>
            <thead className='w-full'>
                <tr className='border-2 w-full'>
                    <th className='border-2'>Id</th>
                    <th className='border-2'>Class</th>
                    <th className='border-2'>Name</th>
                    <th className='border-2'>English</th>
                    <th className='border-2'>Hindi</th>
                    <th className='border-2'>Math</th>
                    <th className='border-2'>Science</th>
                    <th className='border-2'>S. Science</th>
                    {!primary && <th className='border-2'>Computer</th>}
                    {primary && <th className='border-2'>G.K</th>}
                </tr>
            </thead>
            <tbody>
                {filteredStudents.map(d => {
                    return <tr key={d.studentId}>
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
                })}
            </tbody>
        </table>
    </Div>
    </Section>
}