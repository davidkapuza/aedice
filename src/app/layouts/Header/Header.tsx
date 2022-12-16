import DropdownMenu from "src/app/components/DropdownMenu/DropdownMenu";
import "./Header.styles.css";

export default function Header() {
  return (
    <header className="Header">
      <h1 className="flex-1">LOGO</h1>
      <p className="flex-1 text-xs whitespace-nowrap">
        {"Welcome back David Kapuza | You have 0 unread messages."}
      </p>
      <DropdownMenu />
    </header>
  );
}
