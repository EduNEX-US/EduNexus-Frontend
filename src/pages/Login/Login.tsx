import { useEffect} from 'react';
import {Section, Div, Input, Button, Span} from '../../Components/Assembler';
import edu from '../../assets/EduNexUsBW-Photoroom.png';
import useFuncs from './Functionality';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function Login(){
    const {idRef, passRef, role, handleRole, passType, handlePassType, images, pointer, emptyfield, handleEmptyField, handleLogin, handlePointer} = useFuncs();

    useEffect(()=>{
        const emptyTimeOut = setTimeout(()=>{
            handleEmptyField(false);
        }, 2000);

        return ()=> clearInterval(emptyTimeOut);
    },[handleEmptyField])
    useEffect(()=>{
        const interval = setInterval(()=>{
            handlePointer()
        }, 2000);
        return ()=> clearInterval(interval);
    }, [])
    return <Section cn='h-screen w-2/2 flex'>
            <Div cn='h-full w-3/5 transition-transform ease-out duration-500'>
                <img className='h-full transition-transform ease-out duration-700' src={images[pointer]}></img>
            </Div>
            <Div cn='h-full w-2/5 flex flex-col items-center justify-center bg-black'>
                <Div cn='h-1/4 w-2/3 flex justify-center items-center'>
                    <img src={edu} className='h-full contain'></img>
                </Div>
                <Div cn='h-2/3 w-2/3 bg-black rounded-xl flex flex-col justify-start items-center bg-gradient-to-br from-cyan-600 via-cyan-500 to-white animate-gradient'>
                    <Div cn='h-1/3 w-3/4 flex flex-col justify-center items-start'>
                        <Input labelCN='text-white text-shadow-2xs text-shadow-black font-bold text-xl mb-2' labelTxt='ID' inpCN=' placeholder:text-shadow-2xs placeholder:text-shadow-black text-shadow-2xs text-shadow-black inset-ring-2 outline-none inset-ring-black rounded-xl text-white w-full p-2' type='text' inpTxt='2541x89rft...' forName='id' ref={idRef}></Input>
                    </Div>
                    <Div cn='h-1/3 w-3/4 flex flex-col justify-center items-start'>
                        <label className='text-white text-shadow-2xs text-shadow-black font-bold text-xl mb-2'>Password</label>
                        <Div cn='w-full flex justify-center items-center'>
                            <input className='placeholder:text-shadow-2xs placeholder:text-shadow-black text-shadow-2xs text-shadow-black inset-ring-2 outline-none inset-ring-black border-r-0 rounded-l-xl text-white w-4/5 p-2' placeholder='2541x89rft...' name='pass' ref={passRef} type={passType}></input>
                            <Span cn='w-1/5 inset-ring-2 p-2 rounded-r-xl text-center cursor-pointer hover:bg-cyan-700/30' onClick={handlePassType}><FontAwesomeIcon icon={faEye}></FontAwesomeIcon></Span>
                        </Div>
                    </Div>
                    <Div cn='h-1/8 w-3/4 flex justify-around'>
                        <label className='flex items-center gap-2 accent-cyan-600'>
                            <input type='radio' name='role' checked={role === "student"} value="student" onChange={handleRole}></input>
                            <Span cn='text-sm'>Student</Span>
                        </label>
                        <label className='flex items-center gap-2 accent-cyan-600'>
                            <input type='radio' name='role' checked={role === "teacher"} value="teacher" onChange={handleRole}></input>
                            <Span cn='text-sm'>Teacher</Span>
                        </label>
                        <label className='flex items-center gap-2 accent-cyan-600'>
                            <input type='radio' name='role' checked={role === "admin"} value="admin" onChange={handleRole}></input>
                            <Span cn='text-sm'>Admin</Span>
                        </label>
                    </Div>
                    <Span cn={`text-red-800 ${!emptyfield ? "visible" : "invisible"}`}>Field Not selected</Span>
                    <Div cn='h-1/4 w-2/4 mt-4'>
                        <Button cn='w-full bg-white text-cyan-600 hover:text-white font-bold hover:bg-cyan-600 transition transition-all duration-400 ease cursor-pointer text-xl p-2 rounded-xl' onClick={()=>{handleLogin(); }}>Login</Button>
                    </Div>
                </Div>
            </Div>
        </ Section>
}