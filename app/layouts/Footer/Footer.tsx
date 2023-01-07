import ContactLinks from "@/core/ui/ContactLinks/ContactLinks";
import { Icons } from "@/core/ui/Icons/Icons";
import ChatPresence from "app/components/ChatPresence/ChatPresence";
import "./Footer.styles.css";

function Footer() {
  return (
    <footer className="Footer">
      <ContactLinks
        links={[
          {
            href: "https://github.com/davidkapuza/aedice",
            label: "Github",
            icon: <Icons.github size={15} />,
          },
        ]}
      />
      <ChatPresence />
      <ContactLinks
        links={[
          {
            href: "mailto:kapuzadavid@gmail.com",
            label: "Email",
            icon: <Icons.mail size={15} />,
          },
          {
            href: "https://t.me/dawidkapuza",
            label: "Telegram",
            icon: <Icons.telegram width={15} height={15} />,
          },
        ]}
      />
    </footer>
  );
}

export default Footer;
