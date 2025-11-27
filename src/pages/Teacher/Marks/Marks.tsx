import {Div, Span, Button,Input, Section} from '../../../Components/Assembler';
import useFuncs from './Functionality';
export default function Marks(){
    const {markForm, handleMarkForm, state, dispatch, primary, setPrimary, dummyData} = useFuncs();
    return<Section cn='bg-[#7CA982] relative md:w-5/6 flex flex-col items-center space-y-6 p-4 overflow-y-auto'>{/* Parent Section */}
    {markForm &&
    <Div cn='w-full bg-black/30 h-lvh absolute flex items-center justify-center' onClick={()=> handleMarkForm(false)}>
        {/* <Div cn='w-[70%] h-[85%]'> */}
            <Div cn='flex flex-col bg-[#243E36] h-[90%] w-[70%] items-center justify-around' onClick={(e) => e.stopPropagation()}>
                <Div cn='flex w-2/3 border-2 justify-around items-center'>
                    <Input labelCN='text-white text-lg w-1/3 text-center' onChange={(e) => { let val : number = parseInt(e.target.value);
                        if(val>10) val = 10;
                    if(val<1) val = 1;
                    if(val<6) setPrimary(true);
                    else setPrimary(false);
                    }} type='number' inpCN='text-white border-2 p-1 w-2/3' inpTxt='254xcv309' labelTxt='Class' forName='sClass'></Input>
                </Div>
                {/* Student ID */}
                <Div cn='flex w-2/3 border-2 justify-around items-center'>
                    <Input labelCN='text-white text-lg w-1/3 text-center' onChange={(e) => dispatch({type : "id", payload : e.target.value})} type="text" inpCN='text-white border-2 p-1 w-2/3' inpTxt='254xcv309' labelTxt='StudentId' forName='id'></Input>
                </Div>

                {/* English Marks */}
                <Div cn='flex w-2/3 border-2 justify-around items-center'>
                    <Input labelCN='text-white text-lg w-1/3 text-center' onChange={(e) => {let val : number = parseInt(e.target.value);
                        if(val>100) val = 100;
                    if(val<0) val = 0;
                        dispatch({type : "eng", payload : val})}} type='number' inpCN='text-white border-2 p-1 w-2/3' inpTxt='254xcv309' value={`${state.english}`} labelTxt='English' forName='eng'></Input>
                </Div>

                {/* Hindi Marks */}
                <Div cn='flex w-2/3 border-2 justify-around items-center'>
                    <Input labelCN='text-white text-lg w-1/3 text-center' onChange={(e) => { let val : number = parseInt(e.target.value);
                        if(val>100) val = 100;
                    if(val<0) val = 0;
                        dispatch({type : "hin", payload : val})}} inpCN='text-white border-2 p-1 w-2/3' type='number' inpTxt='254xcv309' value={`${state.hindi}`} labelTxt='Hindi' forName='hin'></Input>
                </Div>

                {/* Math Marks */}
                <Div cn='flex w-2/3 border-2 justify-around items-center'>
                    <Input labelCN='text-white text-lg w-1/3 text-center' onChange={(e) => { let val : number = parseInt(e.target.value);
                        if(val>100) val = 100;
                    if(val<0) val = 0;
                        dispatch({type : "math", payload : val})}} inpCN='text-white border-2 p-1 w-2/3' type='number' value={`${state.math}`} inpTxt='254xcv309' labelTxt='Math' forName='math'></Input>
                </Div>

                {/* Science Marks */}
                <Div cn='flex w-2/3 border-2 justify-around items-center'>
                    <Input labelCN='text-white text-lg w-1/3 text-center' onChange={(e) => { let val : number = parseInt(e.target.value);
                        if(val>100) val = 100;
                    if(val<0) val = 0;
                        dispatch({type : "sci", payload : val})}} inpCN='text-white border-2 p-1 w-2/3' type='number' inpTxt='254xcv309' value={`${state.science}`} labelTxt='Science' forName='sci'></Input>
                </Div>

                {/* SS Marks */}
                <Div cn='flex w-2/3 border-2 justify-around items-center'>
                    <Input labelCN='text-white text-lg w-1/3 text-center' onChange={(e) => { let val : number = parseInt(e.target.value);
                    if(val>100) val = 100;
                    if(val<0) val = 0;
                        dispatch({type : "ss", payload : val})}} inpCN='text-white border-2 p-1 w-2/3' type='number' value={`${state.socialScience}`} inpTxt='254xcv309' labelTxt='Social Science' forName='ss'></Input>
                </Div>

                {/* Computer Marks */}
                {!primary && 
                <Div cn='flex w-2/3 border-2 justify-around items-center'>
                    <Input labelCN='text-white text-lg w-1/3 text-center' onChange={(e) => { let val : number = parseInt(e.target.value);
                    if(val>100) val = 100;
                    if(val<0) val = 0;
                        dispatch({type : "comp", payload : val})}} inpCN='text-white border-2 p-1 w-2/3' type='number' inpTxt='254xcv309' labelTxt='Computer' value={`${state.computer}`} forName='comp'></Input>
                </Div>}

                {/* GK Marks */}
                {primary && 
                <Div cn='flex w-2/3 border-2 justify-around items-center'>
                    <Input labelCN='text-white text-lg w-1/3 text-center' onChange={(e) => { let val : number = parseInt(e.target.value);
                    if(val>100) val = 100;
                    if(val<0) val = 0;
                        dispatch({type : "gk", payload : val})}} type='number' inpCN='text-white border-2 p-1 w-2/3' value={`${state.generalKnowledge}`} inpTxt='254xcv309' labelTxt='General Knowledge' forName='gk'></Input>
                </Div>}

                {/* Result Date */}
                <Div cn='flex w-2/3 border-2 justify-around items-center'>
                    <Input labelCN='text-white text-lg w-1/3 text-center' onChange={(e) => dispatch({type : "rd", payload : new Date(e.target.value)})} type="date" inpCN='text-white border-2 p-1 w-2/3' inpTxt='254xcv309' labelTxt='Result Date' forName='rd'></Input>
                </Div>

                {/* Submit Date */}
                <Button cn='bg-[#7CA982] text-[#243E36] py-1 px-2 text-lg cursor-pointer'>Upload</Button>
            </Div>
        {/* </Div> */}
    </Div>
    }
    <Div cn='flex justify-between w-[95%]'>
        <Div cn='flex w-2/5'>
            <Span cn='w-full text-3xl flex items-center text-[#243E36]'>Manage Marks</Span>
        </Div>
        <Div cn='flexw-2/5'>
            <Button cn='p-3 text-lg bg-[#243E36] text-[#7CA982] rounded-lg' onClick={()=>handleMarkForm(true)}>Upload</Button>
        </Div>
    </Div>
    <Div cn='w-[95%]'>
        <Input labelCN='' labelTxt='' inpCN=' w-3/4 border-2 p-2 text-lg' inpTxt='Search for student...'></Input>
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
                    <th className='border-2'>Computer</th>
                    <th className='border-2'>G.K</th>
                </tr>
            </thead>
            <tbody>
                {dummyData.map(d => {
                    return <tr key={d.studentId}>
                        <td>{d.studentId}</td>
                        <td>{d.class}</td>
                        <td>{d.name}</td>
                        <td>{d.marks.English}</td>
                        <td>{d.marks.Hindi}</td>
                        <td>{d.marks.Math}</td>
                        <td>{d.marks.Science}</td>
                        <td>{d.marks['Social Science']}</td>
                        <td>{d.marks.Computer}</td>
                        <td>{d.marks['General Knowledge']}</td>
                    </tr>
                })}
            </tbody>
        </table>
    </Div>
    </Section>
}