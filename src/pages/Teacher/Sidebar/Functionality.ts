import type { active } from "../Teacher_View/Functionality"
export interface HandleTab{
    handleFunc : (val : active) => void,
    activeTab? : active,
    handleBarsVisibility? : ()=> void,
    barsVisibility? : boolean
}