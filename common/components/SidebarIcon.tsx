import Link from "next/link";

export default function SidebarIcon({ icon, text = "tooltip 💡" }: any) {
  return (
    <Link href="/chat" className="sidebar-item sidebar-icon group">
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </Link>
  );
}
