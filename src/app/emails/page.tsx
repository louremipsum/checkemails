"use client";
import Image from "next/image";
import Dropdown from "@/components/Dropdown";
import { useEffect, useState } from "react";
import OpenAIModal from "@/components/OpenAIModal";
import Profile from "@/components/Profile";
import EmailList from "@/components/EmailList";

const Emails = () => {
  const [modalState, setModalState] = useState<boolean>(false);
  const [maxResults, setMaxResults] = useState(15);
  const modalStateHandler = (state: boolean) => {
    setModalState(state);
  };

  const [keyInfo, setKeyInfo] = useState<{ key: string; disable: boolean }>({
    key: "",
    disable: true,
  });

  const keyInfoHandler = (key: string, disable: boolean) => {
    setKeyInfo({ key: key, disable: disable });
  };
  useEffect(() => {
    const getKey = JSON.parse(localStorage.getItem("items")!);
    if (getKey && getKey.length > 0) {
      keyInfoHandler(getKey[0], false);
    }
  }, []);

  return (
    <div className="bg-slate-50 p-10 h-screen">
      <div className="flex justify-between items-center	">
        <Profile />
        <Dropdown modalStateHandler={modalStateHandler} />
      </div>
      <div className="flex justify-between items-center">
        <select
          className="form-select block p-1  rounded-lg border border-gray-400 border-solid mt-1 text-gray-700"
          value={maxResults}
          onChange={(e) => setMaxResults(parseInt(e.target.value))}
        >
          {[15, 20, 25, 30, 35, 40, 45].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <div className="flex justify-start py-4">
          <button
            className={`flex items-center p-3 border border-transparent text-base font-medium rounded-md text-slate-50 bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 disabled:cursor-not-allowed disabled:text-gray-700 disabled:bg-zinc-200`}
            disabled={keyInfo.disable}
          >
            <div className="pr-2">
              <Image
                src={"/sparkle.svg"}
                alt="sparkle"
                height={24}
                width={24}
              />
            </div>
            <p>Classify</p>
          </button>
        </div>
      </div>
      <div
        className={`fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden transition-all duration-200 transform ease-in-out ${
          modalState ? "opacity-100 scale-100 visible" : "opacity-0  invisible"
        }`}
        style={{
          backgroundColor: modalState ? "rgba(0, 0, 0, 0.2)" : "transparent",
          backdropFilter: modalState ? "blur(5px)" : "none",
        }}
      >
        <OpenAIModal
          modalstate={modalStateHandler}
          keyInfoHandler={keyInfoHandler}
        />
      </div>
      <div>
        <EmailList maxResults={maxResults} />
      </div>
    </div>
  );
};

export default Emails;
