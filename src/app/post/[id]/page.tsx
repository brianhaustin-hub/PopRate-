import { Layout } from '@/components/shell/Layout';
import { PostDetailScreen } from '@/components/screens/PostDetailScreen';

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Layout>
      <PostDetailScreen postId={id} />
    </Layout>
  );
}
