"use client";
import { useEffect } from "react";

function Glow({
  children,
  className = "",
  border = "",
}: {
  children: React.ReactNode;
  className?: string;
  border?: string;
}) {
  const handleOnMouseMove = (e: MouseEvent) => {
    const { currentTarget: target } = e;

    const rect = (target as HTMLElement).getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top;

    (target as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
    (target as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
  };
  useEffect(() => {
    for (const element of document.querySelectorAll(".glow")) {
      (element as HTMLElement).onmousemove = (e: MouseEvent) =>
        handleOnMouseMove(e);
    }
  }, []);
  return (
    <div className={`glow ${border}`}>
      <div className="glow-border"></div>
      <div className={`glow-content ${className}`}>{children}</div>
    </div>
  );
}

export default Glow;
