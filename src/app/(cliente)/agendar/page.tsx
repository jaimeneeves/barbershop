import NewAppointments from "@/app/ui/new-appointments";
import { SessionProvider } from "next-auth/react";

export default function Page() {
  return (
    <SessionProvider>
      <NewAppointments />
    </SessionProvider>
  );
}
