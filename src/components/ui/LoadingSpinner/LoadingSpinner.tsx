"use client";

import "./LoadingSpinner.css";
import React from "react";

interface LoadingSpinnerProps {
  label?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Carregando...",
}) => {
  return (
    <div className="loading-spinner">
      <div className="spinner" aria-hidden="true">
        <span>{label}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
