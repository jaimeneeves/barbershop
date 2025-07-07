import { SessionProvider } from "next-auth/react"
import Profile from "@/app/ui/profile";

export default function Page() {
  return (
    <SessionProvider>
      <Profile />  
    </SessionProvider>
  );
}
