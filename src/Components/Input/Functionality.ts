import type { RefObject } from "react";

export interface InputProps{
    labelCN : string,
    forName : string,
    labelTxt : string,
    type : string,
    ref : RefObject<HTMLInputElement>,
    inpTxt : string,
    inpCN : string
}