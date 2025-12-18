import { useEffect} from 'react';
import {Section, Div, Input, Button, Span} from '../../Components/Assembler';
import edu from '../../assets/EDU-Photoroom.png';
import useFuncs from './Functionality';
import graffiti from '../../assets/students.svg'
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function Login(){
    const {idRef, passRef, role, handleRole, passType, handlePassType, emptyfield, handleEmptyField, handleLogin} = useFuncs();

    useEffect(()=>{
        const emptyTimeOut = setTimeout(()=>{
            handleEmptyField(false);
        }, 2000);

        return ()=> clearInterval(emptyTimeOut);
    },[handleEmptyField])
    return <Section cn='h-screen w-full flex'>
            <Div cn='h-full w-3/5 transition-transform ease-out duration-500 absolute md:relative z-0'>
                <img className='h-full transition-transform ease-out duration-700 z-0' src={graffiti}></img>
            </Div>
            <Div cn='h-full md:w-2/5 w-full flex flex-col items-center justify-center bg-white md:z-10'>
                <Div cn='h-1/4 w-2/3 flex justify-center items-center animate-bounce'>
                    <img src={edu} className='h-full contain'></img>
                </Div>
                <Div cn='h-2/3 w-2/3 bg-black rounded-xl flex flex-col justify-start items-center bg-purple-400 z-10'>
                    <Div cn='h-1/3 lg:w-3/4 w-[85%] flex flex-col justify-center items-start'>
                        <Input labelCN='text-white font-bold text-lg md:text-xl md:mb-2' labelTxt='ID' inpCN='inset-ring-2 outline-none inset-ring-black rounded-xl text-purple-400 bg-white w-full p-2' type='text' inpTxt='2541x89rft...' forName='id' ref={idRef}></Input>
                    </Div>
                    
                    <Div cn='h-1/3 lg:w-3/4 w-[85%] flex flex-col justify-center items-start'>
                        <label className='text-white font-bold text-lg md:text-xl md:mb-2'>Password</label>
                        <Div cn='w-full flex justify-center items-center'>
                            <input className='inset-ring-2 outline-none inset-ring-black border-r-0 rounded-l-xl text-purple-400 w-4/5 p-2 bg-white border-r-0' placeholder='2541x89rft...' name='pass' ref={passRef} type={passType}></input>
                            <Span cn='w-1/5 bg-white text-purple-400 inset-ring-2 inset-ring-black p-2 rounded-r-xl text-center cursor-pointer hover:bg-purple-400/30 hover:text-white ' onClick={handlePassType}><FontAwesomeIcon icon={faEye}></FontAwesomeIcon></Span>
                        </Div>
                    </Div>
                    <Div cn='h-1/8 lg:w-3/4 w-[95%] flex justify-around'>
                        <label className='flex items-center gap-1 mr-2 accent-purple-600'>
                            <input type='radio' name='role' checked={role === "student"} value="student" onChange={handleRole}></input>
                            <Span cn='text-xs lg:text-sm'>Student</Span>
                        </label>
                        <label className='flex items-center gap-1 mr-2 accent-purple-600'>
                            <input type='radio' name='role' checked={role === "teacher"} value="teacher" onChange={handleRole}></input>
                            <Span cn='text-xs lg:text-sm'>Teacher</Span>
                        </label>
                        <label className='flex items-center gap-1 accent-purple-600'>
                            <input type='radio' name='role' checked={role === "admin"} value="admin" onChange={handleRole}></input>
                            <Span cn='text-xs lg:text-sm'>Admin</Span>
                        </label>
                    </Div>
                    <Span cn={`text-red-800 text-sm lg:text-lg ${!emptyfield ? "visible" : "invisible"}`}>Field Not selected</Span>
                    <Div cn='h-1/4 w-1/3 md:w-2/4 mt-4'>
                        <Button cn='w-full bg-white text-purple-400 hover:text-white font-bold hover:bg-purple-400 hover:shadow-sm hover:shadow-black transition transition-all duration-400 ease cursor-pointer text-sm md:text-lg lg:text-xl p-2 rounded-xl' onClick={()=>{handleLogin(); }}>Login</Button>
                    </Div>
                </Div>
            </Div>
        </ Section>
}