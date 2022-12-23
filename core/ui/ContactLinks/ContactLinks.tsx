import { ReactNode } from "react";
import "./ContactLinks.styles.css";

type Props = {
  links: { href: string; label: string; icon: ReactNode }[];
};

function ContactLinks({ links }: Props) {
  return (
    <ul className="ContactLinks">
      Contact me by:
      {links.map(({ href, label, icon }) => (
        <a key={href} className="Link" target="_blank" href={href}>
          {" "}
          {label}
          {icon}
        </a>
      ))}
    </ul>
  );
}

export default ContactLinks;
