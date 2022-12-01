import "./Sidebar.styles.css"
import SearchUsers from "@ui/Search/Search";

export default function Sidebar () {
  return (
    <aside className='Sidebar'>

      {/* <div className='sidebar-container'> */}
        <SearchUsers/>
      {/* </div> */}
    </aside>
  );
};