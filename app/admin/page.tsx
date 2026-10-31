import React from 'react';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getPortfolioData } from '@/lib/db';
import { AdminDashboardClient } from '@/components/dashboard/AdminDashboardClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  const data = await getPortfolioData();
  const { admin_auth, ...safeData } = data;

  return (
    <AdminDashboardClient
      initialData={{
        ...safeData,
        admin_email: admin_auth?.email || session.email,
      }}
    />
  );
}
