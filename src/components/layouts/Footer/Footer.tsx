import GithubIcon from "@core/icons/GithubIcon";
import "./Footer.styles.css";

function Footer() {
  return (
    <footer className="Footer">
      <a
        className="inline-flex flex-1 gap-3 text-xs text-gray-500 cursor-pointer hover:text-white"
        target="_blank"
        href="https://github.com/davidkapuza/next-chat"
      >
        <GithubIcon />
        <p>Check on Github.</p>
      </a>
      <div className="flex items-center justify-center flex-1 gap-2">
        <svg
          viewBox="0 0 10 10"
          xmlns="http://www.w3.org/2000/svg"
          className="w-1.5 h-1.5"
          height={5}
          width={5}
        >
          <circle cx="5" cy="5" r="5" fill="#90EE90" />
        </svg>
        <p className="text-xs">{2} here</p>
      </div>
      <a
        target="_blank"
        href="mailto:kapuzadavid@gmail.com"
        className="inline-flex justify-end flex-1 text-xs text-gray-500 cursor-pointer hover:text-white"
      >
        Contact
      </a>
    </footer>
  );
}

export default Footer;
