"use client";
import "./AuthCard.css";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

const AuthCard: React.FC<AuthCardProps> = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  onBackClick = () => {},
}) => {
  return (
    <div className="auth-card">
      <div className="auth-header">
        {showBackButton && (
          <button type="button" className="back-button" onClick={onBackClick}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 12H5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 19L5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <h1 className="auth-title">{title}</h1>
        <p className="auth-description">{subtitle}</p>
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
