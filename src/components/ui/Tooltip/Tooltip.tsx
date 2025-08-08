"use client";

import "./Tooltip.css";
import React from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  return (
    <span className="tooltip">
      {children}
      <span className="tooltip-content">{content}</span>
    </span>
  );
};

export default Tooltip;
