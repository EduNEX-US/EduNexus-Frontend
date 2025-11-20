import type { SpanProps } from "./Functionality";

export default function Span(props : SpanProps){
    const {cn,children, onClick} = props;
    return <span className={cn} onClick={onClick}>{children}</span>
}