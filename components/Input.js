import { useEffect, useState } from "react";
import VMasker from "vanilla-masker";
import Vmasker from 'vanilla-masker';

const Input = ({ onChange = () => { }, ...rest }) => {

    const [inputRef, setInputRef] = useState(null);

    useEffect(() => {

    }, [inputRef])

    const handlerKeyUp = (ev) => {

        if(rest.money) {
            ev.target.value = VMasker.toMoney(ev.target.value.replace(".", ""))
        }

        onChange(ev)
    }

    return (
        <input
            onChange={onChange}
            onKeyUp={handlerKeyUp}
            {...rest}
            ref={setInputRef}
            className="form-control" type="text" />
    )
}

export default Input;