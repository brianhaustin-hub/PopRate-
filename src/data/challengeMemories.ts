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
  likes: number;
  comments: string[];
  saves: number;
  shares: number;
  liked: boolean;
  saved: boolean;
}

const memories: ChallengeMemory[] = [];
const listeners = new Set<() => void>();

export function getChallengeMemory(challengeId: string) {
  return memories.find((item) => item.challengeId === challengeId && item.visible && new Date(item.expiresAt).getTime() > Date.now()) ?? null;
}

export function getChallengeMemoryById(memoryId: string) {
  return memories.find((item) => item.id === memoryId && item.visible && new Date(item.expiresAt).getTime() > Date.now()) ?? null;
}

export function getChallengeMemories() {
  const now = Date.now();
  return memories.filter((item) => item.visible && new Date(item.expiresAt).getTime() > now);
}

export function expireChallengeMemories(now = Date.now()) {
  let changed = false;
  for (const item of memories) {
    if (item.visible && new Date(item.expiresAt).getTime() <= now) {
      item.visible = false;
      changed = true;
    }
  }
  if (changed) emit();
  return changed;
}

export function subscribeChallengeMemories(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() { listeners.forEach((listener) => listener()); }

type PublishChallengeMemoryInput = Omit<ChallengeMemory, 'id' | 'publishedAt' | 'expiresAt' | 'visible' | 'likes' | 'comments' | 'saves' | 'shares' | 'liked' | 'saved'>;

export function publishChallengeMemory(input: PublishChallengeMemoryInput) {
  const existing = memories.find((item) => item.challengeId === input.challengeId);
  const publishedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString();
  const memory: ChallengeMemory = {
    ...input,
    id: existing?.id ?? 'cm-' + input.challengeId,
    publishedAt,
    expiresAt,
    visible: true,
    liked: existing?.liked ?? false,
    saved: existing?.saved ?? false,
    likes: existing?.likes ?? 0,
    comments: existing?.comments ?? [],
    saves: existing?.saves ?? 0,
    shares: existing?.shares ?? 0,
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

export function toggleChallengeMemoryLike(challengeId: string) {
  const item = memories.find((memory) => memory.challengeId === challengeId);
  if (!item || !item.visible) return;
  item.liked = !item.liked;
  item.likes = Math.max(0, item.likes + (item.liked ? 1 : -1));
  emit();
  return item;
}

export function addChallengeMemoryComment(challengeId: string, comment: string) {
  const item = memories.find((memory) => memory.challengeId === challengeId);
  if (!item || !item.visible || !comment.trim()) return;
  item.comments.push(comment.trim());
  emit();
  return item;
}

export function toggleChallengeMemorySave(challengeId: string) {
  const item = memories.find((memory) => memory.challengeId === challengeId);
  if (!item || !item.visible) return;
  item.saved = !item.saved;
  item.saves = Math.max(0, item.saves + (item.saved ? 1 : -1));
  emit();
  return item;
}

export function shareChallengeMemory(challengeId: string) {
  const item = memories.find((memory) => memory.challengeId === challengeId);
  if (!item || !item.visible) return;
  item.shares += 1;
  emit();
  return item;
}
