"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import OpenAIModal from "@/components/OpenAIModal";
import Login from "@/components/Auth/Login";

const Home = () => {
  const [modalState, setModalState] = useState<boolean>(false);

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

  const modalStateHandler = (state: boolean) => {
    setModalState(state);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-bgImg">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="text-xl fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl  dark:bg-amber-700/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 ">
          Check.Emails
        </p>
      </div>

      <div className="px-8 py-3 ">
        <Login nextUrl="/emails" />
        <div
          className="flex justify-start p-4"
          onClick={() => modalStateHandler(true)}
        >
          <button className="flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-200 transition-all duration-300">
            <div className="pr-5">
              <Image src="./key.svg" alt="Key logo" width={24} height={24} />
            </div>
            <p>Enter OpenAI Key</p>
          </button>
        </div>
      </div>
      <div
        className={`fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-0rem)] max-h-full overflow-y-auto overflow-x-hidden transition-all duration-200 transform ease-in-out ${
          modalState ? "opacity-100 scale-100 visible" : "opacity-0  invisible"
        }`}
        style={{
          backgroundColor: modalState ? "rgba(0, 0, 0, 0.2)" : "transparent",
          backdropFilter: modalState ? "blur(5px)" : "none",
        }}
      >
        {modalState && (
          <OpenAIModal
            modalstate={modalStateHandler}
            keyInfoHandler={keyInfoHandler}
          />
        )}
      </div>
    </main>
  );
};

export default Home;
