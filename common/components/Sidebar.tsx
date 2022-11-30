import SearchUsers from "./SearchUsers";

export default function Sidebar () {
  return (
    <aside className='Sidebar'>

      <div className='sidebar-container'>
        <SearchUsers></SearchUsers>
      </div>
    </aside>
  );
};