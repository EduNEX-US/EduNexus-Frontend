import type { DivProps } from "./Functionality";

export default function Div(props : DivProps){
    const {cn, children} = props;
    return <div className={cn}>{children}</div>
}