import { ChallengeStatus, ChallengeVisibility } from '@/types';

export interface ChallengeWorkflowRecord {
  id: string;
  title: string;
  category: string;
  creator: { name: string; username: string; image: string };
  opponent: { name: string; username: string; image: string } | null;
  creatorSide: string;
  opponentSide: string | null;
  visibility: ChallengeVisibility;
  status: ChallengeStatus;
  votesA: number;
  votesB: number;
  endsAt: string;
}

export const challengeWorkflow: ChallengeWorkflowRecord[] = [
  {
    id: 'c1',
    title: 'Which look wins the night?',
    category: 'Style',
    creator: { name: 'Alex Morgan', username: 'alexmorgan', image: 'https://picsum.photos/seed/alexmorgan/200/200' },
    opponent: { name: 'Maya Chen', username: 'maya.chen', image: 'https://picsum.photos/seed/mayachen/200/200' },
    creatorSide: 'https://picsum.photos/seed/poprate-live-a/700/900',
    opponentSide: 'https://picsum.photos/seed/poprate-live-b/700/900',
    visibility: 'open',
    status: 'live',
    votesA: 418,
    votesB: 392,
    endsAt: '2026-09-28T03:30:00Z',
  },
  {
    id: 'w1',
    title: 'Who has the better sneakers?',
    category: 'Fashion',
    creator: { name: 'Nia Cole', username: 'niacole', image: 'https://picsum.photos/seed/niacole/200/200' },
    opponent: null,
    creatorSide: 'https://picsum.photos/seed/sneakers/800/1000',
    opponentSide: null,
    visibility: 'open',
    status: 'waiting_for_opponent',
    votesA: 0,
    votesB: 0,
    endsAt: '2026-09-29T18:00:00Z',
  },
  {
    id: 'w2',
    title: 'Pick the better game setup',
    category: 'Gaming',
    creator: { name: 'Chris Vale', username: 'chrisvale', image: 'https://picsum.photos/seed/chrisvale/200/200' },
    opponent: null,
    creatorSide: 'https://picsum.photos/seed/setup/800/1000',
    opponentSide: null,
    visibility: 'open',
    status: 'waiting_for_opponent',
    votesA: 0,
    votesB: 0,
    endsAt: '2026-09-30T20:00:00Z',
  },
];

export function getChallengeWorkflow(id: string) {
  return challengeWorkflow.find((challenge) => challenge.id === id) ?? null;
}

export function challengeProgress(status: ChallengeStatus) {
  const states: ChallengeStatus[] = ['waiting_for_opponent', 'opponent_joined', 'ready', 'live', 'voting_closed', 'result'];
  return states.indexOf(status);
}
