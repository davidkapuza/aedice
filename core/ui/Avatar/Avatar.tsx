import Image from "next/image";

type Props = {
  src: string;
  className?: string;
  children?: React.ReactNode;
};

function Avatar({ src, className, children }: Props) {
  return (
    <div className="relative">
      <Image
        src={src}
        height={20}
        width={20}
        className={`Avatar ${className}`}
        alt="Avatar"
      />
      {children}
    </div>
  );
}

export default Avatar;
