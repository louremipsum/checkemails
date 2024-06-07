import { createSupabaseServerComponentClient } from "@/utils/supabase/server";
import Profile from "./Profile";

export default async function GetDetails() {
  const {
    data: { session },
    error,
  } = await createSupabaseServerComponentClient().auth.getSession();
  console.log("sess-> ", session);

  return <Profile session={session} />;
}
