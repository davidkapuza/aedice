import React from "react";
import { Icons } from "../Icons/Icons";
import Tooltip from "../Tooltip/Tooltip";

function ContactInfo() {
  return (
    <div className="w-[60px] z-50 py-[50px] h-screen hidden md:flex flex-col text-xs text-gray-500 absolute right-0 top-0 items-center">
      <a
        href="https://github.com/davidkapuza/aedice"
        target="_blank"
        className="mb-auto Link"
      >
        <Icons.github size={12} />
      </a>

      <span className="rotate-90">Contacts:</span>
      <a
        target="_blank"
        href="mailto:kapuzadavid@gmail.com"
        className="mt-8 mb-3 Link"
      >
        <Icons.mail size={12} />
      </a>
      <a target="_blank" href="https://t.me/dawidkapuza" className="mb-8 Link">
        <Icons.telegram width={12} height={12} />
      </a>
      <Tooltip origin="right">
        <a aria-disabled className="rotate-90 cursor-not-allowed" href="#">
          About
        </a>
      </Tooltip>
    </div>
  );
}
export default ContactInfo;
