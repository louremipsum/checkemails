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
    <div className="bg-white overflow-hidden h-screen">
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <p className="text-xl dark:text-gray-700 fixed m-16 left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:bg-amber-700/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 ">
            Check.Emails
          </p>
        </div>
      </header>
      <main className="flex flex-col items-center justify-between ">
        <div className="relative isolate px-6 pt-14 lg:px-8">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#fde68a] to-[#f9d71c] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="mx-auto max-w-2xl py-32 ">
            <div className="hidden sm:mb-8 sm:flex sm:justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                Uses the new GPT-4o model behind the scenes{" "}
                <a
                  href="https://openai.com/index/hello-gpt-4o/"
                  target="_blank"
                  className="font-semibold text-yellow-800"
                >
                  <span className="absolute inset-0" aria-hidden="true" />
                  Read more <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Classify your emails using AI
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Check.Email uses the latest AI technology to classify your
                emails into different categories. It&apos;s fast, secure, and
                easy to use. All your emails are secure and not stored on our
                servers.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Login nextUrl="/emails" />
                <div
                  className="flex justify-start p-4"
                  onClick={() => modalStateHandler(true)}
                >
                  <button className="flex items-center px-8 py-3 border border-yellow-500 text-base font-medium rounded-md text-black bg-white hover:bg-gray-200 transition-all duration-300">
                    <div className="pr-5">
                      <Image
                        src="./key.svg"
                        alt="Key logo"
                        width={24}
                        height={24}
                      />
                    </div>
                    <p>Enter OpenAI Key</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
        <div
          className={`fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-0rem)] max-h-full overflow-y-auto overflow-x-hidden transition-all duration-200 transform ease-in-out ${
            modalState ? "opacity-100 scale-100 visible" : "opacity-0 invisible"
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
    </div>
  );
};

export default Home;
