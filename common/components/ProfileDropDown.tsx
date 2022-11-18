import Image from "next/image";

export default function ProfileDropDown({ img, content }: any) {
  return (
    <div className="sidebar-item group">
      <div className="avatar-wrapper">
        <Image
          width={30}
          height={30}
          src={img}
          alt="Profile"
          className="avatar"
        />
      </div>
      <div className="sidebar-tooltip sidebar-menu">{content}</div>
    </div>
  );
}
