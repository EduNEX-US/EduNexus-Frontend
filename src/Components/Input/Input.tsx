import type {InputProps} from './Functionality.ts';

export default function Input(props : InputProps){
    const {labelCN, labelTxt, inpCN, inpTxt, forName, ref, value, type, onChange} = props;
    return <>
    <label className={labelCN} htmlFor={forName}>{labelTxt}</label>
    <input type={type} placeholder={inpTxt} value={value} className={inpCN} ref={ref} name={forName} onChange={onChange}></input>
    </>
}