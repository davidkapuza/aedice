import DropdownMenu from "src/app/components/DropdownMenu/DropdownMenu";
import "./Header.styles.css";

export default function Header() {
  return (
    <header className="Header">
      <div className="flex-1">
        <h1 className="flex-1 font-sans font-medium">David Kapuza</h1>
      </div>
      <h1 className="flex-1 font-sans text-center text-2xl font-bold">aedice.</h1>
      <DropdownMenu />
    </header>
  );
}
