// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
// import { AppSidebar } from "@/components/appSidebar"
import { SessionProvider } from "next-auth/react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // <SidebarProvider>
    //   <AppSidebar />
      <SessionProvider>
        {/* <SidebarTrigger /> */}
        {children}
      </SessionProvider>
    // </SidebarProvider>
  )
}