import {Button, Section, Div} from '../Assembler';


export default function Sidebar(){
    return <Section cn='w-1/5 flex flex-col justify-start items-center bg-rose-800 h-lvh'>
        <Button cn='w-full bg-teal-500 text-rose-800 text-xl h-1/10 hover:bg-rose-800 hover:text-teal-500 hover:border-teal-500 transition-all ease duration-500 hover:border-1 font-bold mt-12 shadow-xl/30 ' onClick={()=>{}}>Dashboard</Button>
        <Button cn='w-full bg-teal-500 text-rose-800 text-xl h-1/10 hover:bg-rose-800 hover:text-teal-500 hover:border-teal-500 hover:border-1 font-bold transition-all duration-500 ease' onClick={()=>{}}>Marks</Button>
        <Button cn='w-full bg-teal-500 text-rose-800 text-xl h-1/10 hover:bg-rose-800 hover:text-teal-500 hover:border-teal-500 hover:border-1 font-bold transition-all duration-500 ease' onClick={()=>{}}>Extra</Button>
        <Button cn='w-full bg-teal-500 text-rose-800 text-xl h-1/10 hover:bg-rose-800 hover:text-teal-500 hover:border-teal-500 hover:border-1 font-bold transition-all duration-500 ease' onClick={()=>{}}>PTM</Button>
    </Section>
}