import SessionWrapper from "@/components/SessionWrapper";
import ProfileEdit from "@/app/ui/barber/profile-edit";

export default function Page() {
  return (
    <SessionWrapper>
      <ProfileEdit />
    </SessionWrapper>
  );
}