import Image from "next/image";
import "./AvatarsGroup.styles.css";

type Props = {
  avatars: string[];
};

function AvatarsGroup({ avatars }: Props) {
  return (
    <ul className="Avatars-group">
      <p className="ml-3 mr-auto text-xs text-gray-500">{avatars.length} members</p>
      {avatars.map((avatar) => (
        <span key={avatar} className="Avatar-wrapper">
          <Image
            src={avatar}
            height={25}
            width={25}
            alt="Avatar"
            className="Avatar"
          ></Image>
        </span>
      ))}
    </ul>
  );
}

export default AvatarsGroup;
