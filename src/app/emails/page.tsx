"use client";
import Image from "next/image";
import Dropdown from "@/components/Dropdown";
import { useEffect, useState } from "react";
import OpenAIModal from "@/components/OpenAIModal";
import Profile from "@/components/Profile";
import EmailList from "@/components/EmailList";
import { Label, emailDetailsType } from "../types";
import { toast } from "react-hot-toast";

const Emails = () => {
  const [modalState, setModalState] = useState<boolean>(false);
  const [maxResults, setMaxResults] = useState(15);
  const [loading, setLoading] = useState<boolean>(false);
  const [emails, setEmails] = useState<emailDetailsType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isClassifyLoading, setIsClassifyLoading] = useState<boolean>(false);
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

  const clasifyHandler = async () => {
    if (!emails) return;
    setLoading(true);
    const dataToSend = emails.map((item) => {
      return {
        index: item.index,
        from: item.from,
        plainText: item.plainText,
        htmlText: item.htmlText,
      };
    });
    try {
      const respone = await fetch("/api/classify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${keyInfo.key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const respData = await respone.json();

      const updatedEmails = emails.map((item) => {
        const selectedItem = respData.classifiedEmails.find(
          (c: { index: number; category: Label }) => c.index === item.index
        );
        return {
          ...item,
          category: Label[selectedItem!.category as keyof typeof Label],
        };
      });
      setEmails(updatedEmails);
      setLoading(false);
      toast.success("Emails classified successfully! 🎉");
    } catch (error) {
      toast.error("Error while classifying emails");
      setLoading(false);
    }
  };

  useEffect(() => {
    const getKey = JSON.parse(localStorage.getItem("items")!);
    if (getKey && getKey.length > 0 && emails.length != 0) {
      keyInfoHandler(getKey[0], false);
    }
    let didCancel = false;
    const fetchData = async () => {
      if (!didCancel) {
        try {
          setIsClassifyLoading(true);
          const response = await fetch(
            `/api/getEmails?maxResults=${maxResults}`,
            {
              method: "GET",
            }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch emails");
          }
          const data = await response.json();
          setEmails(data.emails);
        } catch (err) {
          if (err instanceof Error) {
            toast.error(err.message);
            setError(err.message);
          } else {
            toast.error("An unexpected error occurred");
            setError("An unexpected error occurred");
          }
        } finally {
          setIsClassifyLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      didCancel = true;
    };
  }, [emails.length, maxResults]);

  return (
    <>
      <div className="bg-bgImg bg-no-repeat bg-cover bg-center bg-fixed p-10 min-h-max">
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
              className={`${
                loading
                  ? "animate-pulse border-yellow-500 bg-yellow-400 text-white"
                  : ""
              } flex items-center p-3 border border-transparent text-base font-medium rounded-md text-slate-50 bg-yellow-400 hover:bg-yellow-500 transition-all duration-300 disabled:cursor-not-allowed disabled:text-gray-700 disabled:bg-zinc-200`}
              disabled={keyInfo.disable || loading}
              onClick={clasifyHandler}
            >
              <div className="pr-2">
                {loading ? (
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
                ) : (
                  <Image
                    src={"/sparkle.svg"}
                    alt="sparkle"
                    height={24}
                    width={24}
                  />
                )}
              </div>
              {loading ? <p>Loading...</p> : <p>Classify</p>}
            </button>
          </div>
        </div>
        <div
          className={`fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden transition-all duration-200 transform ease-in-out ${
            modalState
              ? "opacity-100 scale-100 visible"
              : "opacity-0  invisible"
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
          <h1 className="text-gray-500 text-3xl my-5">Recent Emails</h1>
          <EmailList
            emails={emails}
            error={error}
            isLoading={isClassifyLoading}
          />
        </div>
      </div>
      <div className="flex bg-slate-50 items-center justify-center border-solid border-gray-200 border py-5 px-4">
        <p className="text-center text-gray-600 text-md font-semibold">
          Created with
          <span className="text-red-500 mx-1">❤️</span>
          by{" "}
          <a
            href="https://bento.me/louremipsum"
            target="_blank"
            className="text-yellow-500 hover:text-yellow-600 underline-offset-4 underline"
          >
            Vinayak Nigam
          </a>{" "}
          aka Louremipsum
        </p>
      </div>
    </>
  );
};

export default Emails;
