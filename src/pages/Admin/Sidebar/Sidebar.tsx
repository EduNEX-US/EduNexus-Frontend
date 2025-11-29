import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Button, Section, Div, Span} from '../../../Components/Assembler';
import edu from '../../../assets/Edu_Logo_Only-Photoroom.png';
import text from '../../../assets/black-Photoroom-cpy.png';
import {faChalkboardUser, faAddressCard, faPen, faUser, faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons'
import type { HandleTab } from './Functionality';
export default function Sidebar( props : HandleTab){
    const {handleFunc, activeTab} =  props;
    return <Section cn='md:w-1/6 h-1/6 flex md:flex-col justify-start items-center md:h-lvh'> {/* Sidebar Section */}
        {/* Div Holding Logo & Traversing Navs */}
        <Div cn='w-full flex md:flex-col justify-start items-center h-full md:h-9/10 text-white bg-purple-400'>
            {/* Title */}
            <Span cn='text-xl w-full md:h-[15%] h-full flex bg-purple-400 justify-center items-center pt-2 gv text-shadow-xs text-shadow-black'>
                <img src={edu} className='object-cover h-18'></img>
                <img src={text} className='object-stretch w-1/2 border-2 h-25'></img>
            </Span>
            {/* Nav Links */}
            <Div cn='md:flex md:flex-col items-center md:h-8/10 hidden w-full bg-purple-400'>
                <Button cn={`hover:bg-white w-[90%] mb-2 rounded-xl group text-xl h-1/8 ${activeTab === "dashboard" && "bg-white"} flex justify-center items-center text-purple-400 transition transition-all duration-400 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc("dashboard")}>
                    <Span cn={`text-xl block mr-2 ${activeTab === "dashboard" ? "text-purple-400" : "text-white"} group-hover:text-purple-400`}>
                        <FontAwesomeIcon icon={faAddressCard}></FontAwesomeIcon>
                    </Span>
                    <Span cn='text-xl hidden group-hover:block group-hover:text-purple-400'>
                        Dashboard
                    </Span>
                    {activeTab === "dashboard" && <Span cn='text-xl group-hover:hidden text-purple-400'>
                        Dashboard
                    </Span>}
                </Button>
                <Button cn={`hover:bg-white w-[90%] mb-2 rounded-xl group text-xl h-1/8 ${activeTab === "manage" && "bg-white"} flex justify-center items-center text-purple-400 transition transition-all duration-400 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc("manage")}>
                    <Span cn={`text-xl block mr-2 ${activeTab === "manage" ? "text-purple-400" : "text-white"} group-hover:text-purple-400`}>
                        <FontAwesomeIcon icon={faPen}></FontAwesomeIcon>
                    </Span>
                    <Span cn='text-xl hidden group-hover:block group-hover:text-purple-400'>
                        Manage
                    </Span>
                    {activeTab === "manage" && <Span cn='text-xl group-hover:hidden group-hover:block text-purple-400'>
                        Manage
                    </Span>}
                </Button>
                <Button cn={`hover:bg-white w-[90%] mb-2 rounded-xl group text-xl h-1/8 ${activeTab === "register users" && "bg-white"} flex justify-center items-center text-purple-400 transition transition-all duration-400 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc("register users")}>
                    <Span cn={`text-xl block mr-2 ${activeTab === "register users" ? "text-purple-400" : "text-white"} group-hover:text-purple-400`}>
                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                    </Span>
                    <Span cn='text-xl hidden group-hover:block group-hover:text-purple-400'>
                        Register Users
                    </Span>
                    {activeTab === "register users" && <Span cn='text-xl group-hover:hidden group-hover:block text-purple-400'>
                        Register Users
                    </Span>}
                </Button>
                <Button cn={`hover:bg-white w-[90%] mb-2 rounded-xl group text-xl h-1/8 ${activeTab === "ptm" && "bg-white"} flex justify-center items-center text-purple-400 transition transition-all duration-400 ease cursor-pointer hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-white`} onClick={()=> handleFunc("ptm")}>
                    <Span cn={`text-xl block mr-2 ${activeTab === "ptm" ? "text-purple-400" : "text-white"} group-hover:text-purple-400`}>
                        <FontAwesomeIcon icon={faChalkboardUser} />
                    </Span>
                    <Span cn='text-xl hidden group-hover:block group-hover:text-purple-400'>
                        PTM
                    </Span>
                    {activeTab === "ptm" && <Span cn='text-xl group-hover:hidden group-hover:block text-purple-400'>
                        PTM
                    </Span>}
                </Button>
            </Div>
        </Div>

        {/* Logout Button */}
        <Div cn='md:h-1/10 h-full hidden md:block bg-purple-400 w-full text-white'>
            <Button cn='w-full group text-xl h-full flex justify-center items-center hover:text-red-600 transition transition-all duration-400 ease cursor-pointer' onClick={()=>{}}>
                <Span cn='text-xl block mr-2'>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </Span>
                <Span cn='text-xl hidden group-hover:block'>
                    Logout
                </Span>
            </Button>
        </Div>
    </Section>
}