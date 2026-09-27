import { Layout } from '@/components/shell/Layout';
import { ChallengeStatusScreen } from '@/components/screens/ChallengeStatusScreen';

export default function ChallengeStatusPage() {
  return <Layout><ChallengeStatusScreen initialState="waiting" /></Layout>;
}
