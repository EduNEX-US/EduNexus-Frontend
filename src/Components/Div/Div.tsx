import type { DivProps } from "./Functionality";

export default function Div(props : DivProps){
    const {cn, children, onClick} = props;
    return <div className={cn} onClick={onClick}>{children}</div>
}