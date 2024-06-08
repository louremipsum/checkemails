"use client";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-hot-toast";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clearKey = () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("items");
        setKey("");
        keyInfoHandler(key, true);
        toast.success("Key cleared successfully.");
      }
    } catch (error) {
      console.error("Failed to clear key from localStorage:", error);
      toast.error("Failed to clear key. Please try again.");
    }
  };

  const checkOpenAIKey = async (key: string) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/verifyKey", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${key}`,
          ContentType: "application/json",
        },
      });
      if (response.status === 401) {
        throw new Error("Invalid OpenAI API key.");
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const isValid = await checkOpenAIKey(key);
      if (!isValid) {
        throw new Error("Invalid OpenAI API key.");
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("items", JSON.stringify([key]));
        keyInfoHandler(key, false);
      }
      modalstate(false);
      toast.success("Key verified and saved successfully.");
    } catch (error) {
      toast.error("Invalid OpenAI API key.");
    }
  };

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%)] max-h-full overflow-y-auto overflow-x-hidden">
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
          <form onSubmit={save}>
            <div className="flex justify-start items-center">
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
                  required
                  minLength={1}
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
              {key.length > 0 && (
                <button
                  onClick={clearKey}
                  className="hover:bg-slate-300 p-1 rounded-lg mx-4 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all duration-500"
                >
                  <Image src="/x.svg" alt="Clear key" width={24} height={24} />
                </button>
              )}
            </div>
            <div className="flex items-center mt-4 p-4 rounded-b">
              <button
                type="submit"
                className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-500"
                disabled={isLoading}
              >
                <div className="flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline mr-2 w-4 h-4 text-gray-200 animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="#EAB308"
                        ></path>
                      </svg>
                      <p>Verifying</p>
                    </>
                  ) : (
                    <p>Proceed</p>
                  )}
                </div>
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
