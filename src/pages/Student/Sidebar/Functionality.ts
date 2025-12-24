import type { active } from "../Studen_View/Functionality"
import { useNavigate } from "react-router"
export interface HandleTab{
    handleFunc : (val : active) => void,
    activeTab? : active,
    handleBarsVisibility? : ()=> void,
    barsVisibility? : boolean
}

export default function useFuncs(){
    const navigate = useNavigate();
    return {navigate}
}
