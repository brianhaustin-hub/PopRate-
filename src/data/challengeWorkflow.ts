import { ChallengeStatus, ChallengeVisibility } from '@/types';
import { recordBehavior } from '@/data/behaviorStore';
import { addActivity } from '@/data/activityStore';

export interface ChallengeWorkflowRecord {
  id: string;
  title: string;
  category: string;
  creator: { name: string; username: string; image: string };
  opponent: { name: string; username: string; image: string } | null;
  creatorSide: string;
  creatorMediaType?: 'image' | 'video';
  creatorMediaUrl?: string;
  creatorThumbnail?: string;
  opponentSide: string | null;
  opponentMediaType?: 'image' | 'video';
  opponentMediaUrl?: string;
  opponentThumbnail?: string;
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
    creatorMediaType: 'video',
    creatorMediaUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    creatorThumbnail: 'https://picsum.photos/seed/poprate-video-a/700/900',
    opponentMediaType: 'video',
    opponentMediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    opponentThumbnail: 'https://picsum.photos/seed/poprate-video-b/700/900',
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

const lifecycle: ChallengeStatus[] = ['waiting_for_opponent', 'opponent_joined', 'ready', 'live', 'voting_closed', 'result'];

export function subscribeChallengeWorkflow(listener: () => void) {
  workflowListeners.add(listener);
  return () => workflowListeners.delete(listener);
}

function emitWorkflow() {
  workflowListeners.forEach(listener => listener());
}

export function challengeProgress(status: ChallengeStatus) {
  return lifecycle.indexOf(status);
}

function validStatus(status: ChallengeStatus, allowed: ChallengeStatus[]) {
  return allowed.includes(status);
}


export function setChallengeStatus(id: string, status: ChallengeStatus) {
  const challenge = getChallengeWorkflow(id);
  if (!challenge) return null;
  challenge.status = status;
  emitWorkflow();
  return challenge;
}

export function joinOpenChallenge(
  id: string,
  opponent: { name: string; username: string; image: string },
  opponentSide?: {
    mediaType: 'image' | 'video';
    mediaUrl: string;
    thumbnail?: string;
  },
) {
  const challenge = getChallengeWorkflow(id);
  if (!challenge || challenge.visibility !== 'open' || challenge.opponent) return null;
  if (!validStatus(challenge.status, ['waiting_for_opponent'])) return null;

  challenge.opponent = opponent;
  challenge.opponentSide = opponentSide?.thumbnail ?? opponentSide?.mediaUrl ?? null;
  challenge.opponentMediaType = opponentSide?.mediaType;
  challenge.opponentMediaUrl = opponentSide?.mediaUrl;
  challenge.opponentThumbnail = opponentSide?.thumbnail;
  challenge.status = opponentSide ? 'ready' : 'opponent_joined';

  recordBehavior({
    type: 'challenge_open',
    category: challenge.category,
    creatorUsername: challenge.creator.username,
    dedupeKey: 'challenge-join:' + challenge.id + ':' + opponent.username,
  });
  addActivity({
    type: 'challenge',
    title: opponent.name + ' joined your challenge',
    message: challenge.title,
    image: opponent.image,
    href: '/challenge/' + challenge.id + '/status',
  });
  emitWorkflow();
  return challenge;
}

export function declineChallenge(id: string) {
  const challenge = getChallengeWorkflow(id);
  if (!challenge || !validStatus(challenge.status, ['opponent_invited'])) return null;
  challenge.status = 'declined';
  emitWorkflow();
  return challenge;
}

export function cancelChallenge(id: string) {
  const challenge = getChallengeWorkflow(id);
  if (!challenge || !validStatus(challenge.status, ['draft', 'waiting_for_opponent', 'opponent_invited', 'opponent_joined'])) return null;
  challenge.status = 'cancelled';
  emitWorkflow();
  return challenge;
}

export function submitChallengeSide(
  id: string,
  side: 'creator' | 'opponent',
  media: { mediaType: 'image' | 'video'; mediaUrl: string; thumbnail?: string },
) {
  const challenge = getChallengeWorkflow(id);
  if (!challenge || !validStatus(challenge.status, ['waiting_for_opponent', 'opponent_joined'])) return null;

  if (side === 'creator') {
    challenge.creatorSide = media.thumbnail ?? media.mediaUrl;
    challenge.creatorMediaType = media.mediaType;
    challenge.creatorMediaUrl = media.mediaUrl;
    challenge.creatorThumbnail = media.thumbnail;
  } else {
    if (!challenge.opponent) return null;
    challenge.opponentSide = media.thumbnail ?? media.mediaUrl;
    challenge.opponentMediaType = media.mediaType;
    challenge.opponentMediaUrl = media.mediaUrl;
    challenge.opponentThumbnail = media.thumbnail;
  }

  if (challenge.creatorSide && challenge.opponentSide) challenge.status = 'ready';
  else if (challenge.opponent) challenge.status = 'opponent_joined';

  emitWorkflow();
  return challenge;
}

export function castChallengeVote(id: string, side: 'a' | 'b') {
  const challenge = getChallengeWorkflow(id);
  if (!challenge || challenge.status !== 'live') return null;
  if (side === 'a') challenge.votesA += 1;
  else challenge.votesB += 1;
  emitWorkflow();
  return challenge;
}

export function closeChallengeVoting(id: string) {
  const challenge = getChallengeWorkflow(id);
  if (!challenge || challenge.status !== 'live') return null;
  challenge.status = 'voting_closed';
  emitWorkflow();
  return challenge;
}

const workflowListeners = new Set<() => void>();

export function advanceChallenge(id: string) {
  const challenge = getChallengeWorkflow(id);
  if (!challenge) return null;
  const next: Partial<Record<ChallengeStatus, ChallengeStatus>> = {
    waiting_for_opponent: 'opponent_joined',
    opponent_invited: 'opponent_joined',
    opponent_joined: 'ready',
    ready: 'live',
    live: 'voting_closed',
    voting_closed: 'result',
  };
  const nextStatus = next[challenge.status];
  if (nextStatus) challenge.status = nextStatus;
  return challenge;
}
