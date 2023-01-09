"use client";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, HTMLAttributes } from "react";

type DropdownProps = {
  button: React.ReactNode;
  origin?: "left" | "right";
  items: HTMLAttributes<HTMLButtonElement> &
    { label: string; icon?: React.ReactNode; className?: string, disabled?: boolean }[];
};

export default function Dropdown({
  button,
  items,
  origin = "left",
}: DropdownProps) {
  const originStyles = {
    left: "origin-top-left left-3 top-6",
    right: "origin-top-right right-3 top-6",
  };
  return (
    <Menu as="div" className="relative flex">
      <Menu.Button>{button}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`${originStyles[origin]} absolute w-56 z-50 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="px-1 py-1 ">
            {items.map(({ label, icon, className = "", disabled = false, ...props }) => {
              return (
                <Menu.Item key={label}>
                  {({ active }) => (
                    <button
                      {...props}
                      className={`${
                        disabled
                          ? "text-gray-500 cursor-not-allowed"
                          : active
                          ? "text-gray-900 bg-gray-200"
                          : "text-gray-900"
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm ${className}`}
                    >
                      {icon}
                      {label}
                    </button>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
