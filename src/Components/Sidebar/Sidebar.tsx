import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Button, Section, Div, Span} from '../Assembler';
import {faChalkboardUser, faAddressCard, faPowerOff, faBookOpen, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

export default function Sidebar(){
    return <Section cn='w-1/6 flex flex-col justify-start items-center h-lvh'>
        <Div cn='w-full flex flex-col justify-start items-center h-9/10 text-white'>
            <Span cn='text-2xl w-full h-2/10 flex justify-center items-center gv bg-gradient-to-br from-lime-400 via-lime-200 to-white animate-gradient text-shadow-xs text-shadow-black'>EduNexus</Span>
            <Button cn='hover:bg-lime-400/75 w-full group text-xl h-1/10 bg-white flex justify-center items-center text-lime-400 transition transition-all duration-500 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white' onClick={()=>{}}>
                <Span cn='text-xl block mr-2'>
                    <FontAwesomeIcon icon={faAddressCard}></FontAwesomeIcon>
                </Span>
                <Span cn='text-xl hidden group-hover:block'>
                    Dashboard
                </Span>
            </Button>
            <Button cn='hover:bg-lime-400/75 w-full group text-xl h-1/10 bg-white flex justify-center items-center text-lime-400 transition transition-all duration-500 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white' onClick={()=>{}}>
                <Span cn='text-xl block mr-2'>
                    <FontAwesomeIcon icon={faBookOpen}></FontAwesomeIcon>
                </Span>
                <Span cn='text-xl hidden group-hover:block'>
                    Marks
                </Span>
            </Button>
            <Button cn='hover:bg-lime-400/75 w-full group text-xl h-1/10 bg-white flex justify-center items-center text-lime-400 transition transition-all duration-500 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white' onClick={()=>{}}>
                <Span cn='text-xl block mr-2'>
                    <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                </Span>
                <Span cn='text-xl hidden group-hover:block'>
                    Lost & Found
                </Span>
            </Button>
            <Button cn='hover:bg-lime-400/75 w-full group text-xl h-1/10 bg-white flex justify-center items-center text-lime-400 transition transition-all duration-500 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white' onClick={()=>{}}>
                <Span cn='text-xl block mr-2'>
                    <FontAwesomeIcon icon={faChalkboardUser} />
                </Span>
                <Span cn='text-xl hidden group-hover:block'>
                    PTM
                </Span>
            </Button>
        </Div>
        <Div cn='h-1/10'>
            <Button cn='w-full group text-xl h-full flex justify-center items-center hover:text-red-600 transition transition-all duration-500 ease cursor-pointer' onClick={()=>{}}>
                <Span cn='text-xl block mr-2'>
                    <FontAwesomeIcon icon={faPowerOff} />
                </Span>
                <Span cn='text-xl hidden group-hover:block'>
                    Logout
                </Span>
            </Button>
        </Div>
    </Section>
}