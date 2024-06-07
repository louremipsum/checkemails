"use client";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

const Login = (props: { nextUrl?: string }) => {
  const supabase = createSupabaseBrowserClient();
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${
          props.nextUrl || ""
        }`,
      },
    });
  };
  return (
    <div className="flex justify-start p-4 ">
      <button
        className="flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-black bg-white hover:bg-gray-200 transition-all duration-300"
        onClick={handleLogin}
      >
        <div className="pr-5">
          <Image
            src="./googleLogo.svg"
            alt="Google logo"
            width={24}
            height={24}
          />
        </div>
        <p>Login with Google</p>
      </button>
    </div>
  );
};

export default Login;
