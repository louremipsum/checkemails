"use client";
import { emailDetailsType } from "@/app/types";
import Loader from "@/components/Loader";
import { useState } from "react";
import Drawer from "./Drawer";
import EmailCard from "./EmailCard";

type emailListType = {
  emails: emailDetailsType[];
  error: string | null;
  isLoading: boolean;
};

const EmailList = ({ emails, error, isLoading }: emailListType) => {
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

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div>
        {isLoading ? (
          <Loader />
        ) : emails.length === 0 ? (
          <div className="text-lg my-8 h-48 flex items-center justify-center text-gray-600">
            No emails are in your inbox
          </div>
        ) : (
          <div onClick={(e) => handleEmailClick(e)}>
            {emails.map((email) => (
              <div
                key={email.index}
                data-id={email.index}
                className="email-card"
              >
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
      </div>

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
