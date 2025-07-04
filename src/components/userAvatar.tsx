import type { Session } from "next-auth"
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserAvatar({ session }: { session: Session | null }) {
  // console.log("Session data:", session)
  return (
    <div>
      <Avatar className="w-10 h-10">
        <AvatarImage
          src={session?.user?.image ?? "https://i.pravatar.cc/300"}
          alt={session?.user?.name || "User Avatar"}
        />
        <AvatarFallback>
          {session?.user?.name ? session.user.name.charAt(0) : "U"}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}