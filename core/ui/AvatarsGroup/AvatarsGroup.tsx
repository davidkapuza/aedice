import Image from "next/image";
import "./AvatarsGroup.styles.css";

type Props = {
  avatars: string[];
};

function AvatarsGroup({ avatars }: Props) {
  return (
    <ul className="Avatars-group">
      {avatars.length > 1 && <p className="px-2 py-0.5 ml-3 mr-auto text-[10px] h-fit text-white bg-gray-800 rounded-full">+{avatars.length - 1}</p>}
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
