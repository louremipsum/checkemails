import { emailDetailsType, Label } from "@/app/types";
import React from "react";
import { Letter } from "react-letter";
import Image from "next/image";

function getLabelColor(label: Label) {
  switch (label) {
    case Label.Important:
      return "bg-green-500";
    case Label.Marketing:
      return "bg-yellow-500";
    case Label.Spam:
      return "bg-red-500";
    case Label.Promotional:
      return "bg-purple-500";
    case Label.Social:
      return "bg-blue-500";
    case Label.General:
      return "bg-indigo-500";
    case Label.Nothing:
      return "invisible";
    default:
      return "bg-gray-200 text-gray-800";
  }
}

interface DrawerProps extends emailDetailsType {
  isDrawerVisible: boolean;
  handleDrawerVisibility: (state: boolean) => void;
}

const Drawer = (props: DrawerProps) => {
  const drawerClasses = `fixed top-0 right-0 z-50 h-screen p-4 overflow-y-auto transition-transform bg-white w-3/5 shadow-xl ${
    props.isDrawerVisible ? "" : "translate-x-full"
  }`;
  const overlayClasses = `fixed top-0 left-0 z-40 w-screen h-screen bg-black transition-opacity ${
    props.isDrawerVisible ? "opacity-50" : "opacity-0 pointer-events-none"
  }`;
  const chipClasses = `inline-block rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 ${getLabelColor(
    Label[props.category]
  )}`;

  return (
    <>
      <div
        className={overlayClasses}
        onClick={() => props.handleDrawerVisibility(false)}
      ></div>
      <div className={drawerClasses} tabIndex={-1}>
        <h5 className="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400">
          From: <span className="text-gray-500 ml-2">{props.from}</span>
        </h5>
        <button
          type="button"
          onClick={() => props.handleDrawerVisibility(false)}
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 inline-flex items-center justify-center"
        >
          <Image src={"/x.svg"} alt="Close Button" width={24} height={24} />
          <span className="sr-only">Close menu</span>
        </button>
        {props.category && (
          <div>
            <span className={chipClasses}>{props.category}</span>
          </div>
        )}
        <div id="renderDIV">
          <Letter
            html={props.htmlText}
            text={props.plainText}
            className="text-gray-700"
          />
        </div>
      </div>
    </>
  );
};

export default Drawer;
