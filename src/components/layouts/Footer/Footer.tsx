import "./Footer.styles.css";

function Footer() {
  return (
    <footer className="Footer">
      <a
        className="inline-flex items-center flex-1 gap-3 text-xs text-gray-500 cursor-pointer hover:text-white"
        target="_blank"
        href="https://github.com/davidkapuza/next-chat"
      >
        <svg
          width="18px"
          height="18px"
          viewBox="0 0 36 36"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
        >
          <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z" />
        </svg>

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