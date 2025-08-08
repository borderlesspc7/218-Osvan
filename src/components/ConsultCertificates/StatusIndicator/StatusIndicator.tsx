"use client";
import "./StatusIndicator.css";
import Tooltip from "../../ui/Tooltip/Tooltip";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface StatusIndicatorProps {
  title: string;
  value: string;
  variant: "success" | "danger" | "warning" | "neutral";
  tooltip?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  title,
  value,
  variant,
  tooltip,
}) => {
  const iconMap = {
    success: <CheckCircle2 size={20} />,
    danger: <XCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    neutral: <AlertTriangle size={20} />,
  };

  const content = (
    <div className={`status-indicator status-indicator--${variant}`}>
      <div className="status-icon">{iconMap[variant]}</div>
      <div className="status-texts">
        <span className="status-title">{title}</span>
        <span className="status-value">{value}</span>
      </div>
    </div>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{content}</Tooltip>;
  }

  return content;
};

export default StatusIndicator;
