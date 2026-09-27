import { notFound } from 'next/navigation';
import { Layout } from '@/components/shell/Layout';
import { PublicProfileScreen } from '@/components/screens/PublicProfileScreen';
import { users } from '@/data/mock';

export default async function PublicUserPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = users.find((item) => item.username.toLowerCase() === username.toLowerCase());
  if (!user) notFound();

  return (
    <Layout>
      <PublicProfileScreen user={user} />
    </Layout>
  );
}
