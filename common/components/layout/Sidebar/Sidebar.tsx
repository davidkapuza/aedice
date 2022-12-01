import DropDown from "../../features/DropDown/DropDown";
import SearchUsers from "../../elements/Search/Search";

export default function Sidebar () {
  return (
    <aside className='Sidebar'>

      <div className='sidebar-container'>
        <SearchUsers/>
      </div>
    </aside>
  );
};