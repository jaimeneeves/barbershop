import SessionWrapper from "@/components/SessionWrapper"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SessionWrapper>
      {children}
    </SessionWrapper>
  )
}