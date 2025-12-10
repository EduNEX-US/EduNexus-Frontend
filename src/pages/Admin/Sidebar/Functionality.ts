import type { active } from "../Admin_view/Functionality";
import { useState, useEffect } from "react";
export interface HandleTab{
    handleFunc? : (val : active) => void,
    activeTab? : active,
    handleBarsVisibility? : ()=> void,
    barsVisibility? : boolean
}
