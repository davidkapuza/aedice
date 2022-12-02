import "./Sidebar.styles.css"
import { UsersSearch } from "@ui/index";

export default function Sidebar () {
  return (
    <aside className='Sidebar'>

      {/* <div className='sidebar-container'> */}
        <UsersSearch/>
      {/* </div> */}
    </aside>
  );
};