export interface ButtonProps{
    children : string | React.ReactNode,
    onClick : (e : React.MouseEvent<HTMLButtonElement>)=> void,
    type? : string,
    cn : string,
    disabled? : boolean
}
