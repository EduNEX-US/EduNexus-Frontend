import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {Button, Section, Div, Span} from '../../../Components/Assembler';
import text from '../../../assets/black-Photoroom-cpy.png';
import teach from '../../../assets/Teacher in Classroom.gif';
import {faChalkboardUser, faAddressCard, faUser, faArrowRightFromBracket, faMagnifyingGlass, faBookOpen} from '@fortawesome/free-solid-svg-icons'
import type { HandleTab } from './Functionality';
export default function Sidebar( props : HandleTab){
    const {handleFunc, activeTab} =  props;
    return <Section cn='md:w-[5%] h-1/7 bg-orange-100 flex md:flex-col justify-start items-center md:h-lvh '> {/* Sidebar Section */}
        {/* Div Holding Logo & Traversing Navs */}
        <Div cn='w-full flex md:flex-col justify-start items-center h-full md:h-9/10 text-amber-600'>
            {/* Title */}
            {/* <Span cn='text-xl md:h-[35%] relative h-full w-1/2 md:w-full flex bg-purple-300 justify-center items-center pt-2 gv text-shadow-xs text-shadow-black'>
                {/* <img src={edu} className='object-cover h-18 '></img> */}
                {/* <img src={teach} className='md:object-cover size-18 md:size-3/4 absolute left-0 md:relative'></img>
            </Span> */}
            {/* Nav Links */}
            <Div cn={`flex flex-col items-center justify-center md:relative absolute top-0 right-0 md:h-8/10 md:border-none md:w-full w-1/2  border border-l-2 rounded-bl-xl border-black h-2/3`}>
                <Button cn={`w-full group h-[10%] text-xl ${activeTab === "dashboard" ? "bg-orange-400 text-orange-50" : "hover:bg-orange-400 hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-orange-50"}  transition transition-all duration-400 ease cursor-pointer`} onClick={()=> handleFunc("dashboard")}>
                    <Span cn={`text-sm rounded size-full flex items-center justify-center lg:text-xl block`}>
                        <FontAwesomeIcon icon={faAddressCard}></FontAwesomeIcon>
                    </Span>
                </Button>
                <Button cn={` w-full group h-[10%] text-xl ${activeTab === "marks" ? "bg-orange-400 text-orange-50" : "hover:bg-orange-400 hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-orange-50"}  transition transition-all duration-400 ease cursor-pointer`} onClick={()=> handleFunc("marks")}>
                    <Span cn={`text-sm rounded size-full flex items-center justify-center lg:text-xl block`}>
                        <FontAwesomeIcon icon={faBookOpen}></FontAwesomeIcon>
                    </Span>
                </Button>
                <Button cn={` w-full group h-[10%] text-xl ${activeTab === "register users" ? "bg-orange-400 text-orange-50" : "hover:bg-orange-400 hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-orange-50"}  transition transition-all duration-400 ease cursor-pointer`} onClick={()=> handleFunc("register users")}>
                    <Span cn={`text-sm rounded size-full flex items-center justify-center lg:text-xl block`}>
                        <FontAwesomeIcon icon={faUser}></FontAwesomeIcon>
                    </Span>
                </Button>
                <Button cn={` w-full group h-[10%] text-xl ${activeTab === "lost&found" ? "bg-orange-400 text-orange-50" : "hover:bg-orange-400 hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-orange-50"}  transition transition-all duration-400 ease cursor-pointer`} onClick={()=> handleFunc("lost&found")}>
                    <Span cn={`text-sm rounded size-full flex items-center justify-center lg:text-xl block`}>
                        <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                    </Span>
                </Button>
                <Button cn={` w-full group h-[10%] text-xl ${activeTab === "ptm" ? "bg-orange-400 text-orange-50" : "hover:bg-orange-400 hover:border-b-2 hover:shadow-lg hover:shadow-black hover:text-orange-50"}  transition transition-all duration-400 ease cursor-pointer`} onClick={()=> handleFunc("ptm")}>
                    <Span cn={`text-sm rounded size-full flex items-center justify-center lg:text-xl block`}>
                        <FontAwesomeIcon icon={faChalkboardUser} />
                    </Span>
                </Button>
            </Div>
        </Div>

        {/* Logout Button */}
        <Div cn={`md:h-1/10 h-full hidden md:block  w-full text-amber-600`}>
            <Button cn='w-full group text-xl h-full flex justify-center items-center hover:text-red-600 transition transition-all duration-400 ease cursor-pointer' onClick={()=>{}}>
                <Span cn='text-sm lg:text-xl block mr-2'>
                    <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </Span>
            </Button>
        </Div>
    </Section>
}