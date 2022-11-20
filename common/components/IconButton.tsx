import React from "react";

type IconButtonProps = {
  icon: React.ReactNode;
  text?: string;
  styles?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function IconButton({
  icon,
  text = "tooltip 💡",
  styles = "",
  ...props
}: IconButtonProps) {
  return (
    <button {...props} className={`icon-button group ${styles}`}>
      {icon}
      {/* <span className="tooltip group-hover:scale-100">{text}</span> */}
    </button>
  );
}
