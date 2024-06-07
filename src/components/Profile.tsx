"use client";

import Image from "next/image";
import { Session } from "@supabase/supabase-js";

const Profile = ({ session }: { session: Session | null }) => {
  const user = session?.user;
  console.log("User-> ", user);

  return (
    <div className="flex  items-center justify-between space-x-6 p-8">
      <Image
        className="h-20 w-20 flex-shrink-0 rounded-full bg-gray-300"
        src={user?.user_metadata.avatar_url}
        alt="Profile picture"
        height={100}
        width={100}
      />
      <div className="flex-1 truncate">
        <div className="flex items-center space-x-3">
          <h3 className="truncate text-xl font-medium text-gray-900">
            {user?.user_metadata?.full_name}
          </h3>
        </div>
        <p className="mt-1 truncate text-sm text-gray-500">{user?.email}</p>
      </div>
    </div>
  );
};

export default Profile;
