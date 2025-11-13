import type { SectionProps} from "./Functionality";

export default  function Section(props : SectionProps){
    const {cn, children} = props;
    return <section className={cn}>{children}</section>
}