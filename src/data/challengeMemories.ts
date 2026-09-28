export interface ChallengeMemory {
  id: string;
  challengeId: string;
  title: string;
  category: string;
  creatorName: string;
  creatorUsername: string;
  creatorImage: string;
  opponentName: string;
  opponentUsername: string;
  opponentImage: string;
  creatorMedia: { type: 'image' | 'video'; url: string; thumbnail?: string };
  opponentMedia: { type: 'image' | 'video'; url: string; thumbnail?: string };
  votesA: number;
  votesB: number;
  publishedAt: string;
  expiresAt: string;
  visible: boolean;
  placement: 'profile_and_feed' | 'profile_only';
}

const memories: ChallengeMemory[] = [];
const listeners = new Set<() => void>();

export function getChallengeMemory(challengeId: string) {
  return memories.find((item) => item.challengeId === challengeId && item.visible) ?? null;
}

export function getChallengeMemories() {
  const now = Date.now();
  return memories.filter((item) => item.visible && new Date(item.expiresAt).getTime() > now);
}

export function subscribeChallengeMemories(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() { listeners.forEach((listener) => listener()); }

export function publishChallengeMemory(input: Omit<ChallengeMemory, 'id' | 'publishedAt' | 'expiresAt' | 'visible'>) {
  const existing = memories.find((item) => item.challengeId === input.challengeId);
  const publishedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString();
  const memory: ChallengeMemory = {
    ...input,
    id: existing?.id ?? 'cm-' + input.challengeId,
    publishedAt,
    expiresAt,
    visible: true,
  };
  if (existing) Object.assign(existing, memory);
  else memories.push(memory);
  emit();
  return memory;
}

export function removeChallengeMemory(challengeId: string) {
  const memory = memories.find((item) => item.challengeId === challengeId);
  if (!memory) return;
  memory.visible = false;
  emit();
}
