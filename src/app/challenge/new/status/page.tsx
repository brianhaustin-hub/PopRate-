import { Layout } from '@/components/shell/Layout';
import { ChallengeStatusScreen } from '@/components/screens/ChallengeStatusScreen';

export default function NewChallengeStatusPage() {
  return <Layout><ChallengeStatusScreen initialState="waiting" /></Layout>;
}
