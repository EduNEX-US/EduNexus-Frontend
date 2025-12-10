import type { SectionProps} from "./Functionality";

export default  function Section(props : SectionProps){
    const {cn, children, onClick} = props;
    return <section className={cn} onClick={onClick}>{children}</section>
}