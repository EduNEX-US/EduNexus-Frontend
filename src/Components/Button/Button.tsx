import type { ButtonProps } from "./Functionality";

export default function Button(props : ButtonProps){
    const {cn, children, onClick} = props;
    return <button className={cn} onClick={onClick}>{children}</button>
}