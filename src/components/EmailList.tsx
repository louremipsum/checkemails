"use client";
import { emailDetailsType } from "@/app/types";
import Loader from "@/components/Loader";
import { useCallback, useEffect, useMemo, useState } from "react";
import Drawer from "./Drawer";
import EmailCard from "./EmailCard";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type emailListType = {
  emails: emailDetailsType[];
  error: string | null;
  isLoading: boolean;
};

const EmailList = ({ emails, error, isLoading }: emailListType) => {
  const [isSelected, setIsSelected] = useState<emailDetailsType | null>(null);
  const [isDrawerVisible, setDrawerVisibility] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const selectedEmail = useMemo(
    () =>
      emails.find(
        (email) => email.index === parseInt(searchParams.get("id") || "") - 1
      ),
    [emails, searchParams]
  );

  const handleEmailClick = useCallback(() => {
    if (selectedEmail) {
      setIsSelected(selectedEmail);
      setDrawerVisibility(true);
    }
  }, [selectedEmail]);

  useEffect(() => {
    handleEmailClick();
  }, [handleEmailClick]);

  const ResetDrawerVisibility = () => {
    setIsSelected(null);
    router.push(pathname);
    setDrawerVisibility(false);
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
          <div>
            {emails.map((email) => {
              const queryString = createQueryString(
                "id",
                (email.index + 1).toString()
              );
              return (
                <Link href={`${pathname}?${queryString}`} key={email.index}>
                  <EmailCard
                    from={email.from}
                    snippet={email.snippet}
                    plainText={email.plainText}
                    htmlText={email.htmlText}
                    index={email.index}
                    category={email.category}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div>
        {isSelected && (
          <Drawer
            isDrawerVisible={isDrawerVisible}
            handleDrawerVisibility={ResetDrawerVisibility}
            {...isSelected}
          />
        )}
      </div>
    </div>
  );
};

export default EmailList;
