"use client";
import { emailDetailsType } from "@/app/types";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import EmailCard from "./EmailCard";
import Drawer from "./Drawer";

const EmailList = ({ maxResults }: { maxResults: number }) => {
  const [emails, setEmails] = useState<emailDetailsType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelected, setIsSelected] = useState<emailDetailsType | null>(null);
  const [isDrawerVisible, setDrawerVisibility] = useState<boolean>(false);

  const handleEmailClick = (e: any) => {
    const target = e.target.closest(".email-card");
    if (!target) return;
    const emailId = target.getAttribute("data-id");
    const selectedEmail = emails.find(
      (email) => email.index.toString() === emailId
    );
    if (selectedEmail) {
      setIsSelected(selectedEmail);
      setDrawerVisibility(true);
    }
  };

  const handleDrawerVisibility = (state: boolean) => {
    setDrawerVisibility(state);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/getEmails?maxResults=${2}`, {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch emails");
        }
        const data = await response.json();
        setEmails(data.emails);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [maxResults]);

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <h1 className="text-gray-500 text-3xl my-5">Recent Emails</h1>
      {isLoading ? (
        <Loader />
      ) : emails.length === 0 ? (
        <div className="text-lg my-8 h-48 flex items-center justify-center text-gray-600">
          No emails are in your inbox
        </div>
      ) : (
        <div onClick={(e) => handleEmailClick(e)}>
          {emails.map((email) => (
            <div key={email.index} data-id={email.index} className="email-card">
              <EmailCard
                from={email.from}
                snippet={email.snippet}
                plainText={email.plainText}
                htmlText={email.htmlText}
                index={email.index}
                category={email.category}
              />
            </div>
          ))}
        </div>
      )}

      <div>
        {isSelected && (
          <Drawer
            isDrawerVisible={isDrawerVisible}
            handleDrawerVisibility={handleDrawerVisibility}
            {...isSelected}
          />
        )}
      </div>
    </div>
  );
};

export default EmailList;
