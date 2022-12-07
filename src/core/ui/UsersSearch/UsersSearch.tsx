"use client";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import useDebounce from "@lib/hooks/useDebounce";
import useSWR from "swr";
import { searchUserByEmail } from "@lib/services/client/users";

const people = [
  { id: 1, name: "Wade Cooper" },
  { id: 2, name: "Arlene Mccoy" },
  { id: 3, name: "Devon Webb" },
  { id: 4, name: "Tom Cook" },
  { id: 5, name: "Tanya Fox" },
  { id: 6, name: "Hellen Schmidt" },
];



export default function Example() {
  const [query, setQuery] = useState("");

  const debouncedSearch = useDebounce(query, 1000);
  const { data: users, error } = useSWR(
    () =>
      debouncedSearch
        ? `/api/users/searchUserByEmail?q=${debouncedSearch}`
        : null,
    searchUserByEmail
  );

  return (
    <Combobox>
      <div className="relative mt-1 mb-6">
        <div className="relative inline-flex items-center w-full">
          <MagnifyingGlassIcon
            className="absolute w-5 h-5 ml-3 text-gray-400"
            aria-hidden="true"
          />
          <Combobox.Input
            className="border border-gray-300 text-gray-900 text-sm rounded-lg
              focus:ring-gray-900 focus:outline-gray-900 focus:border-gray-900 block w-full pl-10 p-2.5 
              dark:bg-black dark:border-gray-600 dark:placeholder-gray-400
              dark:text-white dark:focus:ring-white dark:focus:border-white;"
            value={query}
            autoComplete="off"
            placeholder="Search contacts..."
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute z-30 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {users?.length === 0 && query !== "" ? (
              <div className="relative px-4 py-2 text-gray-700 cursor-default select-none">
                Nothing found.
              </div>
            ) : (
              users?.map((user) => (
                <Combobox.Option
                  key={user.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={user?.email}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {user.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
}
