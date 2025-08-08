"use client";

import "./SelectCNPJ.css";
import React from "react";

interface Option {
  value: string;
  label: string;
  subLabel?: string;
}

interface SelectCNPJProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

const SelectCNPJ: React.FC<SelectCNPJProps> = ({
  label,
  options,
  value,
  onChange,
  disabled,
  error,
}) => {
  return (
    <div className="selectcnpj-container">
      <label className="selectcnpj-label">{label}</label>
      <div
        className={`selectcnpj-wrapper ${
          error ? "selectcnpj-wrapper--error" : ""
        }`}
      >
        <select
          className="selectcnpj-field"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          <option value="">Selecione um CNPJ</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} {opt.subLabel ? `- ${opt.subLabel}` : ""}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="selectcnpj-error">{error}</span>}
    </div>
  );
};

export default SelectCNPJ;
