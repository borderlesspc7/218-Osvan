"use client";

import React, { useState } from "react";
import "./PassowordInput.css";
import Input from "../Input/Input";
import { Lock, Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  required = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-container">
      <Input
        label={label}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        error={error}
        placeholder={placeholder}
        required={required}
        icon={<Lock size={20} />}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
