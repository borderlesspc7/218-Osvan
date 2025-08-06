import "./ErrorMessage.css";
import React from "react";

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <div className="error-msessage">{message}</div>;
};

export default ErrorMessage;
