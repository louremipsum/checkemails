"use client";
import { useState } from "react";
import LogoutButton from "./Auth/LogoutButton";

type dropdownProps = {
  modalStateHandler: (state: boolean) => void;
};

const Dropdown = ({ modalStateHandler }: dropdownProps) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const handleDropDown = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="relative inline-fle" onBlur={() => setMenuOpen(false)}>
      <button
        type="button"
        onClick={handleDropDown}
        className="py-2 px-4 inline-flex items-center gap-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
      >
        Settings
        <svg
          className={`${
            menuOpen ? "transform rotate-180" : ""
          } h-4 w-4 transition-all duration-200 transform ease-in-out `}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 transform ease-in-out ${
          menuOpen
            ? "opacity-100 scale-100 visible"
            : "opacity-0  scale-95 invisible"
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex={-1}
      >
        <div className="p-1" role="none">
          <button
            className="text-gray-700 block rounded-lg p-3 text-sm hover:bg-slate-200  transition-all duration-300 w-full text-left"
            role="menuitem"
            tabIndex={-1}
            id="menu-item-0"
            onClick={() => modalStateHandler(true)}
          >
            OpenAI Key
          </button>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
