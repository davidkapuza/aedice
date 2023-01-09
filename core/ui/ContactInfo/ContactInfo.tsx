import React from "react";
import { Icons } from "../Icons/Icons";

function ContactInfo() {
  return (
    <div className="w-[60px] flex flex-col justify-end text-xs text-gray-500 absolute right-0 bottom-9 items-center">
      <span className="rotate-90">Contact me</span>
      <a
        target="_blank"
        href="mailto:kapuzadavid@gmail.com"
        className="mb-3 mt-7 Link"
      >
        <Icons.mail size={12} />
      </a>
      <a target="_blank" href="https://t.me/dawidkapuza" className="mb-10 Link">
        <Icons.telegram width={12} height={12} />
      </a>
      <a aria-disabled className="rotate-90 cursor-not-allowed" href="#">
        About
      </a>
    </div>
  );
}
export default ContactInfo;
