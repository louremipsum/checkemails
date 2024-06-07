"use client";

import Image from "next/image";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

const Profile = () => {
  const [data, setData] = useState<User | null>();
  const supabase = createSupabaseBrowserClient();
  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setData(user);
    };
    getData();
  }, [supabase.auth]);

  return (
    <div className="flex  items-center justify-between space-x-6 p-8">
      <Image
        className="h-20 w-20 flex-shrink-0 rounded-full bg-gray-300"
        src={data?.user_metadata.avatar_url}
        alt="Profile picture"
        height={100}
        width={100}
      />
      <div className="flex-1 truncate">
        <div className="flex items-center space-x-3">
          <h3 className="truncate text-xl font-medium text-gray-900">
            {data?.user_metadata?.full_name}
          </h3>
        </div>
        <p className="mt-1 truncate text-sm text-gray-500">{data?.email}</p>
      </div>
    </div>
  );
};

export default Profile;
