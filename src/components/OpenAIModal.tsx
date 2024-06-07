"use client";
import Image from "next/image";
import { useState } from "react";

type ModalProps = {
  modalstate: (state: boolean) => void;
  keyInfoHandler: (key: string, disable: boolean) => void;
};

const OpenAIModal = ({ modalstate, keyInfoHandler }: ModalProps) => {
  const [key, setKey] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const getKey = JSON.parse(localStorage.getItem("items")!);
      return getKey && getKey.length > 0 ? getKey[0] : "";
    }
    return "";
  });

  const save = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("items", JSON.stringify([key]));
      keyInfoHandler(key, false);
    }
    modalstate(false);
  };

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden">
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow ">
          <div className="flex items-center justify-between p-4 rounded-t">
            <h3 className="text-xl font-semibold text-gray-900 ">OpenAI Key</h3>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-base leading-relaxed text-gray-500 00">
              Please enter your OpenAI API Key below. You can create your API
              key{" "}
              <a
                href="https://platform.openai.com/api-keys"
                className="text-yellow-500 font-medium"
                target="_blank"
              >
                here
              </a>
            </p>
          </div>
          <form action={save}>
            <div className="relative ml-4">
              <input
                type="text"
                value={"API_KEY"}
                hidden
                autoComplete="username"
                readOnly
              />
              <input
                type="password"
                placeholder="sk-...XXX"
                className=" w-64 flex items-center px-10 py-2 border text-base font-medium rounded-lg focus:border-yellow-500 focus:outline-none text-black "
                autoFocus
                value={key}
                autoComplete="current-password"
                onChange={(e) => setKey(e.target.value)}
              />
              <div
                className="absolute inset-y-0 left-0 pl-3
                        flex items-center
                        pointer-events-none"
              >
                <Image src={"/key.svg"} alt="key" width={20} height={20} />
              </div>
            </div>
            <div className="flex items-center mt-4 p-4 rounded-b">
              <button
                type="submit"
                className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-500"
              >
                Proceed
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  modalstate(false);
                }}
                className="py-2.5 px-5 ms-3 text-sm font-medium text-red-600 focus:outline-none bg-white rounded-lg border border-red-600 hover:bg-red-100 focus:z-10 focus:ring-4 focus:ring-gray-100 transition-all duration-500"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OpenAIModal;
