import "./Tooltip.styles.css";

const tooltipOrigins = {
  right: "right-3/4 origin-right",
  left: "left-3/4 origin-left",
  top: "top-3/4 origin-top",
  bottom: "bottom-3/4 origin-bottom",
};

type TooltipProps = {
  tooltip?: string;
  origin?: "left" | "right" | "top" | "bottom";
  children: React.ReactNode;
  className?: string;
};

function Tooltip({
  tooltip = "Feature in progress... 👷",
  origin = "top",
  children,
  className = "",
}: TooltipProps) {
  return (
    <div
      className={`flex items-center justify-center group top-  ${className}`}
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
