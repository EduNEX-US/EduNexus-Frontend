import type { RefObject } from "react";

export interface InputProps{
    labelCN : string,
    forName : string,
    labelTxt : string,
    type : string,
    ref : RefObject<HTMLInputElement | null>,
    inpTxt : string,
    inpCN : string
}