import React,{useState} from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = ({value, onChange, placeholder, label, type}) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
};

  return (
    <div>
      <label className='text-[12px] text-[#da251c]'>{label}</label>
        <div className='input-box'>
            <input
            value={value}
            onChange={(e)=>onChange(e)}
            placeholder={placeholder}
            type={type=="password"? showPassword ? 'text' : 'password' : type}
            />
            {type==="password" && (
                <>
                {
                  showPassword ? (
                    <FaEye
                    size={22}
                    onClick={()=>toggleShowPassword()}
                    className="text-primary cursor-pointer"
                    />
                  ) : (
                    <FaEyeSlash
                    size={22}
                    onClick={()=>toggleShowPassword()}
                    className="text-slate-400 cursor-pointer"
                    />
                  ) }
                </>
            )}
        </div>
    </div>
  );
}

export default Input
