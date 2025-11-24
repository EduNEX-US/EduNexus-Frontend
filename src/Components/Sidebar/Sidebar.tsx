import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Button, Section, Div, Span} from '../Assembler';
import edu from '../../assets/Edu_Logo_Only-Photoroom.png';
import text from '../../assets/Edu_Text-Photoroom.png';
import {faChalkboardUser, faAddressCard, faPowerOff, faBookOpen, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import type { HandleTab } from './Functionality';
export default function Sidebar( props : HandleTab){
    const {handleFunc, activeTab} =  props;
    return <Section cn='md:w-1/6 h-1/6 flex md:flex-col justify-start items-center md:h-lvh'> {/* Sidebar Section */}
        {/* Div Holding Logo & Traversing Navs */}
        <Div cn='w-full flex md:flex-col justify-start items-center h-full md:h-9/10 text-white bg-black'>
            {/* Title */}
            <Span cn='text-xl w-full md:h-1/10 h-full flex justify-center items-center pt-2 gv text-shadow-xs text-shadow-black'>
                <img src={edu} className='object-cover h-18'></img>
                <img src={text} className='object-fill h-25'></img>
            </Span>
            {/* Nav Links */}
            <Div cn='md:h-8/10 hidden md:block w-full bg-black'>
                <Button cn={`hover:bg-cyan-600 w-full group text-xl h-1/8 ${activeTab === "dashboard" && "bg-white border-2 border-black"} flex justify-center items-center text-cyan-600 transition transition-all duration-500 ease cursor-pointer hover:border-b-2 hover:bg-gradient-to-r animate-gradient hover:from-cyan-600 hover:to-cyan-400 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc("dashboard")}>
                    <Span cn='text-xl block mr-2'>
                        <FontAwesomeIcon icon={faAddressCard}></FontAwesomeIcon>
                    </Span>
                    <Span cn='text-xl hidden group-hover:block'>
                        Dashboard
                    </Span>
                </Button>
                <Button cn={`hover:bg-cyan-600 w-full group text-xl h-1/8 ${activeTab === "marks" && "bg-white border-2 border-black"} flex justify-center items-center text-cyan-600 transition transition-all duration-500 ease cursor-pointer hover:border-b-2 hover:bg-gradient-to-r animate-gradient hover:from-cyan-600 hover:to-cyan-400 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc("marks")}>
                    <Span cn='text-xl block mr-2'>
                        <FontAwesomeIcon icon={faBookOpen}></FontAwesomeIcon>
                    </Span>
                    <Span cn='text-xl hidden group-hover:block'>
                        Marks
                    </Span>
                </Button>
                <Button cn={`hover:bg-cyan-600 w-full group text-xl h-1/8 ${activeTab === "lost&found" && "bg-white border-2 border-black"} flex justify-center items-center text-cyan-600 transition transition-all duration-500 ease cursor-pointer hover:border-b-2 hover:bg-gradient-to-r animate-gradient hover:from-cyan-600 hover:to-cyan-400 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc("lost&found")}>
                    <Span cn='text-xl block mr-2'>
                        <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                    </Span>
                    <Span cn='text-xl hidden group-hover:block'>
                        Lost & Found
                    </Span>
                </Button>
                <Button cn={`hover:bg-cyan-600 w-full group text-xl h-1/8 ${activeTab === "ptm" && "bg-white border-2 border-black"} flex justify-center items-center text-cyan-600 transition transition-all duration-500 ease cursor-pointer hover:border-b-2 hover:bg-gradient-to-r animate-gradient hover:from-cyan-600 hover:to-cyan-400 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc("ptm")}>
                    <Span cn='text-xl block mr-2'>
                        <FontAwesomeIcon icon={faChalkboardUser} />
                    </Span>
                    <Span cn='text-xl hidden group-hover:block'>
                        PTM
                    </Span>
                </Button>
            </Div>
        </Div>

        {/* Logout Button */}
        <Div cn='md:h-1/10 h-full hidden md:block bg-black w-full text-white'>
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