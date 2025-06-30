import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-[12px] text-IPCprimary">{label}</label>}

      <div className="input-box flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:border-[#da251c] transition">
        <input
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          type={inputType}
          className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
        {isPassword && (
          <>
            {showPassword ? (
              <FaEye
                size={18}
                onClick={toggleShowPassword}
                className="text-primary cursor-pointer ml-2"
              />
            ) : (
              <FaEyeSlash
                size={18}
                onClick={toggleShowPassword}
                className="text-slate-400 cursor-pointer ml-2"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Input;
