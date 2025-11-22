import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Div, Span, Section} from '../../../Components/Assembler';
import { faUser } from '@fortawesome/free-regular-svg-icons';

export default function Dashboard(){
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
    return <Section cn='w-5/6 h-lvh bg-black flex justify-between'>
        <Div cn='w-4/6 bg-stone-100 h-lvh flex flex-col justify-around items-center'>
            <Div cn='w-5/6 bg-white shadow-xs shadow-black h-4/9 rounded-xl'></Div>
            <Div cn='w-5/6 bg-white shadow-xs shadow-black h-4/9 rounded-xl'></Div>
        </Div>
        <Div cn='w-2/6 bg-stone-100 h-lvh flex flex-col justify-center items-center'>
            <Div cn='h-full w-full flex flex-col justify-between items-center'>
                <Div cn='w-full h-1/3 flex justify-center items-center flex-col'>
                    <Span cn='bg-lime-400 h-3/5 block w-1/3 text-white text-[4rem] rounded-full flex justify-center items-center'>
                    AK
                </Span>
                <Span cn=' text-2xl font-bold text-center text-lime-400 text-shadow-sm text-shadow-black'>Aman Kaushik</Span>
                </Div>
                <Div cn='h-2/3 w-[90%] shadow-sm shadow-black rounded-t-xl flex flex-col justify-start items-center'>
                    <Span cn='font-extrabold text-xl h-1/6 py-1 text-white text-shadow-sm text-shadow-lime-400'>Personal Details</Span>
                    <Div cn='h-5/6 w-full flex flex-col justify-start items-center divide-y-2 px-3 overflow-y-auto'>
                        <Div cn='divide-x-2 w-full grid grid-cols-2 text-shadow-xs text-shadow-black py-2'>
                            <Span cn='text-lime-400 text-center'>Class</Span>
                            <Span cn='text-white text-center'>{studentData.class}</Span>
                        </Div>
                        <Div cn='divide-x-2 w-full grid grid-cols-2 text-shadow-xs text-shadow-black py-2'>
                            <Span cn='text-lime-400 text-center break-words'>Classjjjjjjjjjjjjjjjjjjjjjjjjjj</Span>
                            <Span cn='text-white text-center break-words'>{studentData.class}</Span>
                        </Div>
                        <Div cn='divide-x-2 w-full grid grid-cols-2 text-shadow-xs text-shadow-black py-2'>
                            <Span cn='text-lime-400 text-center'>Class</Span>
                            <Span cn='text-white text-center'>{studentData.class}</Span>
                        </Div>
                        <Div cn='divide-x-2 w-full grid grid-cols-2 text-shadow-xs text-shadow-black py-2'>
                            <Span cn='text-lime-400 text-center'>Class</Span>
                            <Span cn='text-white text-center'>{studentData.class}</Span>
                        </Div>
                        <Div cn='divide-x-2 w-full grid grid-cols-2 text-shadow-xs text-shadow-black py-2'>
                            <Span cn='text-lime-400 text-center'>Class</Span>
                            <Span cn='text-white text-center'>{studentData.class}</Span>
                        </Div>
                        <Div cn='divide-x-2 w-full grid grid-cols-2 text-shadow-xs text-shadow-black py-2'>
                            <Span cn='text-lime-400 text-center'>Class</Span>
                            <Span cn='text-white text-center'>{studentData.class}</Span>
                        </Div>

                        <Div cn='divide-x-2 w-full grid grid-cols-2 text-shadow-xs text-shadow-black py-2'>
                            <Span cn='text-lime-400 text-center'>Class</Span>
                            <Span cn='text-white text-center'>{studentData.class}</Span>
                        </Div>
                        <Div cn='divide-x-2 w-full grid grid-cols-2 text-shadow-xs text-shadow-black py-2'>
                            <Span cn='text-lime-400 text-center'>Class</Span>
                            <Span cn='text-white text-center'>{studentData.class}</Span>
                        </Div>
                    </Div>
                </Div>
            </Div>
        </Div>
    </Section>
}