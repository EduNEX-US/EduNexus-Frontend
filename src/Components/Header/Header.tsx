import type { HeaderProps } from "./Functionality";

export default function Header(props : HeaderProps){
    const { cn, children} = props;
    return <header className={cn}>{children}</header>
}