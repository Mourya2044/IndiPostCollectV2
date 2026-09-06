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
      {label && <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</label>}

      <div className="w-full flex justify-between gap-3 text-sm text-foreground bg-background px-4 py-3 mb-4 mt-1 outline-none border border-border focus-within:border-IPCprimary transition-colors group">
        <input
          value={value}
          onChange={(e) => onChange(e)}
          placeholder={placeholder}
          type={inputType}
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
        />
        {isPassword && (
          <button type="button" onClick={toggleShowPassword} className="text-muted-foreground hover:text-IPCprimary transition-colors">
            {showPassword ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;
