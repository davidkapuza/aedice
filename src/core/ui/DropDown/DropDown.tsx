"use client";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}
interface ContentProps {
  link: string;
  text: string;
  styles?: string;
}
interface Props {
  button: React.ReactNode;
  content: ContentProps[];
}

export default function DropDown({ button, content }: Props) {
  return (
    <Menu as="div" className="relative flex justify-center flex-1 text-left">
      <div className="ml-auto">
        <Menu.Button className="inline-flex justify-center text-sm font-medium focus:outline-none">
          {button}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-50 w-56 mt-10 origin-top-right bg-white rounded-md shadow-lg right-5 ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {content.map(({ link, text, styles = ""}) => (
              <Menu.Item key={text}>
                {({ active }) => (
                  <Link
                    href={link}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block w-full px-4 py-2 text-left text-sm",
                      styles
                    )}
                  >
                    {text}
                  </Link>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
