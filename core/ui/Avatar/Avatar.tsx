import Image from "next/image";

type Props = {
  src: string;
  className?: string;
};

function Avatar({ src, className }: Props) {
  return (
    <Image
      src={src}
      height={20}
      width={20}
      className={`Avatar ${className}`}
      alt="Avatar"
    />
  );
}

export default Avatar;
