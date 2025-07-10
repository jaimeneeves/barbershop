export const dynamicParams = true;
import SessionWrapper from "@/components/SessionWrapper";
import AppointmentsPage from '@/app/ui/barber/appointments';
import { APPOINTMENTS_STATUS } from '@/types/APPOINTMENTS_STATUS';

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    status?: APPOINTMENTS_STATUS;
    categoryId?: string | null;
    sortBy?: 'recent' | 'today' | null;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const categoryId = searchParams?.categoryId || null;
  const sortBy = searchParams?.sortBy || null;
  const status = searchParams?.status || null;

  return (
    <SessionWrapper>
      <AppointmentsPage
        // query={query}
        // categoryId={categoryId}
        sortBy={sortBy}
        status={status as APPOINTMENTS_STATUS}
      />
    </SessionWrapper>
  )
}