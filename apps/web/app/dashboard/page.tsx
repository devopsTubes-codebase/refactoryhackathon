import { DashboardClient } from '@/components/dashboard/DashboardClient';

type DashboardPageProps = {
  searchParams?: {
    state?: string;
  };
};

export default function DashboardPage({ searchParams }: DashboardPageProps) {
  return <DashboardClient mode={searchParams?.state === 'projects' ? 'projects' : 'empty'} />;
}
