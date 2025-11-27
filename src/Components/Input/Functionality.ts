import type { ChangeEvent, RefObject } from "react";

export interface InputProps{
    labelCN : string,
    forName : string,
    labelTxt : string,
    type : string,
    ref? : RefObject<HTMLInputElement | null>,
    onChange? : (e : ChangeEvent<HTMLInputElement>) => void,
    inpTxt : string,
    inpCN : string,
    value? : string
}