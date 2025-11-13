import type {InputProps} from './Functionality.ts';

export default function Input(props : InputProps){
    const {labelCN, labelTxt, inpCN, inpTxt, forName, ref, type} = props;
    return <>
    <label className={labelCN} htmlFor={forName}>{labelTxt}</label>
    <input type={type} placeholder={inpTxt} className={inpCN} ref={ref}></input>
    </>
}