export const dynamicParams = true;
import SessionWrapper from "@/components/SessionWrapper";
import AppointmentsPage from '@/app/ui/barber/appointments';
import { APPOINTMENTS_STATUS } from '@/types/APPOINTMENTS_STATUS';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    status?: APPOINTMENTS_STATUS;
    sortBy?: 'recent' | 'today' | null;
  }>;
}) {
  const searchParams = await props.searchParams;
  const sortBy = searchParams?.sortBy || null;
  const status = searchParams?.status || null;

  return (
    <SessionWrapper>
      <AppointmentsPage
        sortBy={sortBy}
        status={status as APPOINTMENTS_STATUS}
      />
    </SessionWrapper>
  )
}