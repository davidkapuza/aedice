import { ReactNode } from "react";
import "./ContactLinks.styles.css";

type Props = {
  links: { href: string; label: string; icon: ReactNode }[];
};

function ContactLinks({ links }: Props) {
  return (
    <ul className="ContactLinks">
      {links.map(({ href, label, icon }) => (
        <a key={href} className="Link" target="_blank" href={href}>
          {icon}
          {label}
        </a>
      ))}
    </ul>
  );
}

export default ContactLinks;
