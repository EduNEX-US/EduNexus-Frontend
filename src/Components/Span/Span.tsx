import type { SpanProps } from "./Functionality";

export default function Span(props : SpanProps){
    const {cn,children} = props;
    return <span className={cn}>{children}</span>
}