import { ButtonHTMLAttributes } from "react";
import "./IconButton.styles.css";

type IconButtonProps = {
  icon: React.ReactNode;
  badge?: string;
  badgeStyles?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({
  icon,
  badge,
  badgeStyles = "",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button {...props} className={`IconButton ${className}`}>
      {icon}
      {badge && <span className={`Badge ${badgeStyles}`}>{badge}</span>}
    </button>
  );
}
