import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/DashboardShell';

export default async function ToolLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const userName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User';
  const userEmail = user.email ?? '';
  const userAvatar = user.user_metadata?.avatar_url ?? undefined;

  return (
    <DashboardShell userName={userName} userEmail={userEmail} userAvatar={userAvatar}>
      {children}
    </DashboardShell>
  );
}
