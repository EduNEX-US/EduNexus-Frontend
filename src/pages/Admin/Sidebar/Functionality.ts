import type { active } from "../Admin_view/Functionality";

export interface HandleTab{
    handleFunc : (val : active) => void,
    activeTab? : active
}