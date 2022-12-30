import ContactLinks from "@/core/ui/ContactLinks/ContactLinks";
import { Icons } from "@/core/ui/Icons/Icons";
import ChatPresence from "app/components/ChatPresence/ChatPresence";
import "./Footer.styles.css";

function Footer() {
  return (
    <footer className="Footer">
      <a
        className="inline-flex items-center flex-1 gap-3 text-xs text-gray-500 cursor-pointer hover:text-white"
        target="_blank"
        href="https://github.com/davidkapuza/next-chat"
      >
        <Icons.github size={15} />

        <p>GitHub.</p>
      </a>

      {/* <ChatPresence /> */}

      <ContactLinks
        links={[
          {
            href: "mailto:kapuzadavid@gmail.com",
            label: "email",
            icon: <Icons.mail size={15}/>,
          },
        ]}
      />
    </footer>
  );
}

export default Footer;
