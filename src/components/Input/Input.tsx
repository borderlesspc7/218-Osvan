"use client";

import React, { useState } from "react";
import "./Input.css";

interface InputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
  icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="input-container">
      <label className="input-label">
        {label}
        {required && <span className="input-required">*</span>}
      </label>
      <div
        className={`input-wrapper ${
          isFocused ? "input-wrapper--focused" : ""
        } ${error ? "input-wrapper--error" : ""}`}
      >
        {icon && <div className="input-icon">{icon}</div>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="input-field"
        />
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;
