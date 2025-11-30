import type { ButtonProps } from "./Functionality";

export default function Button(props : ButtonProps){
    const {cn, children, disabled, onClick} = props;
    return <button className={cn} disabled={disabled} onClick={onClick}>{children}</button>
}