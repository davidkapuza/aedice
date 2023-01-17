import "./Tooltip.styles.css";

const tooltipOrigins = {
  right: "right-full origin-right",
  left: "left-full origin-left",
  top: "top-full origin-top",
  bottom: "bottom-full origin-bottom",
};

type TooltipProps = {
  tooltip?: string;
  origin?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
  className?: string;
};

function Tooltip({
  tooltip = "Work in progress... 👷",
  origin = "top",
  children,
  className = "",
}: TooltipProps) {
  return (
    <div
      className={`flex items-center justify-center group relative ${className}`}
    >
      {children}
      <span
        className={`Tooltip group-hover:scale-100 ${tooltipOrigins[origin]}`}
      >
        {tooltip}
      </span>
    </div>
  );
}

export default Tooltip;
