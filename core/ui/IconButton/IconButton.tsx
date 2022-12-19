import "./IconButton.styles.css"
import Link from "next/link";

type IconButtonProps = {
  link?: string;
  icon: React.ReactNode;
  tooltip?: string;
  styles?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function IconButton({
  link,
  icon,
  tooltip,
  styles = "",
  ...props
}: IconButtonProps) {
  return (
    <>
      {link ? (
        <Link href={link} className={`Icon-button group ${styles}`}>
          {icon}
          {tooltip && <span className="Tooltip group-hover:scale-100">{tooltip}</span>}
        </Link>
      ) : (
        <button {...props} className={`Icon-button group ${styles}`}>
          {icon}
          {tooltip && <span className="Tooltip group-hover:scale-100">{tooltip}</span>}
        </button>
      )}
    </>
  );
}
