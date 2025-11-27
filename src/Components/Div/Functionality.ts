import type { MouseEventHandler } from "react";

interface DivProps{
    children : React.ReactNode,
    cn : string,
    onClick? : MouseEventHandler<HTMLDivElement>
}

export type {DivProps};