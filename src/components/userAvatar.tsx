import type { Session } from "next-auth"
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserAvatar({ session }: { session: Session | null }) {
  return (
    <div>
      <Avatar className="w-10 h-10">
        <AvatarImage
          src={session?.user?.image || ""}
          alt={session?.user?.name || "User Avatar"}
        />
        <AvatarFallback className="bg-blue-500 text-white">
          {session?.user?.name ? session.user.name.charAt(0) : "U"}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}