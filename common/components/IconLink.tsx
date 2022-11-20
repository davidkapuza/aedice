import React from "react";
import Link from "next/link";

type IconLinkProps = {
  link: string;
  icon: React.ReactNode;
  text?: string;
  styles?: string;
};

export default function IconLink({
  link,
  icon,
  text = "tooltip 💡",
  styles = "",
}: IconLinkProps) {
  return (
    <Link href={link} className={`icon-button group${styles}`}>
      {icon}
      <span className="tooltip group-hover:scale-100">{text}</span>
    </Link>
  );
}
