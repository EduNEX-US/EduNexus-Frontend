import type { ReactNode } from "react";

export interface SpanProps{
    cn : string,
    children : ReactNode,
    onClick? : ()=> void 
}