"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  };

  return (
    <button
      className=" block p-3 text-sm rounded-lg w-full text-left text-red-600 hover:bg-red-700 hover:text-slate-50  transition-all duration-300"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
}
