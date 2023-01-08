import { ButtonHTMLAttributes } from "react";
import "./IconButton.styles.css";

const tooltipOrigins = {
  right: "right-10 origin-right",
  left: "left-10 origin-left",
  top: "top-10 origin-top",
  bottom: "bottom-10 origin-bottom",
};

type IconButtonProps = {
  icon: React.ReactNode;
  tooltip?: string;
  tooltipOrigin?: "left" | "right" | "top" | "bottom";
  badge?: string;
  badgeStyles?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({
  icon,
  tooltip,
  tooltipOrigin = "right",
  badge,
  badgeStyles = "",
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button {...props} className={`IconButton group ${className}`}>
      {icon}
      {tooltip && (
        <span
          className={`Tooltip group-hover:scale-100 ${tooltipOrigins[tooltipOrigin]}`}
        >
          {tooltip}
        </span>
      )}
      {badge && <span className={`Badge ${badgeStyles}`}>{badge}</span>}
    </button>
  );
}
