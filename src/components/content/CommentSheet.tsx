'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AtSign, ChevronDown, ChevronUp, Filter, Heart, Image as ImageIcon, MessageCircle, Search, Send, Smile, Sparkles, Star, TrendingUp, X } from 'lucide-react';
import { addUnifiedComment, toggleCommentLike, useContentComments } from '@/data/contentComments';
import { Avatar } from '@/components/ui/Avatar';

type CommentSheetProps = {
  contentId: string;
  kind?: 'post' | 'challenge_memory';
  open: boolean;
  onClose: () => void;
  onToast?: (message: string) => void;
};

const stickerPacks = {
  trending: ['🔥','😂','😭','😍','👏','💀','❤️','😮','🤯','🫶','✨','👀','🤣','🥹','😎','🙌','💯','🤝'],
  reactions: ['😂','🤣','😭','🥹','😍','😘','😮','🤯','😱','😤','🤔','🙄','😳','🥶','😈','🤡','💀','🤩'],
  hype: ['🔥','⚡','💯','🚀','👑','🏆','👏','🙌','🫡','✨','💥','🎯','GOAT','W','WOW','NAH'],
  love: ['❤️','🫶','😍','🥰','😘','💖','💗','💓','💕','💞','💘','🌹','🥹','✨','💋','🤍'],
} as const;

function timeLabel(value: string) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 1000));
  if (seconds < 60) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + 'm';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h';
  return Math.floor(hours / 24) + 'd';
}

export function CommentSheet({ contentId, kind = 'post', open, onClose, onToast }: CommentSheetProps) {
  const comments = useContentComments(contentId, kind);
  const [expanded, setExpanded] = useState(false);
  const [sort, setSort] = useState<'newest' | 'top'>('newest');
  const [composer, setComposer] = useState('');
  const [stickerOpen, setStickerOpen] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string>();
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [stickerTab, setStickerTab] = useState<'trending' | 'reactions' | 'hype' | 'love' | 'saved'>('trending');
  const [stickerQuery, setStickerQuery] = useState('');
  const [favoriteStickers, setFavoriteStickers] = useState<string[]>(['🔥','😂','❤️']);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) {
      setExpanded(false);
      setComposer('');
      setStickerOpen(false);
      setReplyTo(null);
    }
  }, [open]);

  useEffect(() => {
    if (replyTo) textareaRef.current?.focus();
  }, [replyTo]);

  if (!open) return null;

  const ordered = [...comments].filter(item => !item.parentId || expandedReplies.has(item.parentId)).sort((a, b) => {
    if (sort === 'top') return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const submit = () => {
    const value = composer.trim();
    if (!value && !selectedSticker) return;
    const result = addUnifiedComment(contentId, kind, value || selectedSticker || '', selectedSticker, replyTo?.id);
    if (!result) return;
    setComposer('');
    setSelectedSticker(undefined);
    setStickerOpen(false);
    if (replyTo) setExpandedReplies(previous => new Set(previous).add(replyTo.id));
    setReplyTo(null);
    onToast?.('Comment posted');
  };

  return (
    <div className="fixed inset-0 z-[80]">
      <motion.button aria-label="Close comments" className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.section
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 330 }}
        className={'absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-t-[30px] border border-white/10 bg-surface-950 shadow-[0_-20px_80px_rgba(0,0,0,.45)] transition-[height] duration-300 ' + (expanded ? 'h-[92dvh]' : 'h-[66dvh]')}
      >
        <div className="shrink-0 px-4 pt-2">
          <button onClick={() => setExpanded(v => !v)} className="mx-auto block h-1.5 w-12 rounded-full bg-white/20" aria-label="Resize comments" />
          <div className="flex items-center justify-between py-4">
            <button onClick={() => setSort(v => v === 'newest' ? 'top' : 'newest')} className="flex items-center gap-2">
              <span className="text-base font-black">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
              <Filter size={14} className="text-white/45" />
              <span className="text-[10px] font-bold text-white/35">{sort === 'top' ? 'Top' : 'Newest'}</span>
            </button>
            <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full bg-white/[.06] text-white/65"><X size={17}/></button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5">
          {ordered.length === 0 ? (
            <div className="grid h-full place-items-center px-8 text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white/[.06]"><MessageCircle size={24} className="text-white/40"/></div>
                <p className="mt-4 text-base font-black">Start the conversation</p>
                <p className="mt-1 text-xs leading-5 text-white/35">Be the first person to rate the moment with a thought, reaction or sticker.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {ordered.map(item => (
                <article key={item.id} className={'flex gap-3 ' + (item.parentId ? 'ml-10' : '')}>
                  <button className="shrink-0 pt-0.5" aria-label={'Open @' + item.author.username}>
                    <Avatar src={item.author.avatar} alt={item.author.displayName} size="sm" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="truncate text-xs font-black">{item.author.displayName}</span>
                      <span className="truncate text-[10px] text-white/30">@{item.author.username}</span>
                      <span className="ml-auto shrink-0 text-[10px] text-white/25">{timeLabel(item.createdAt)}</span>
                    </div>
                    {item.text && <p className="mt-1 text-sm leading-5 text-white/75 break-words">{item.text}</p>}
                    {item.sticker && <div className="mt-2 inline-grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[.06] text-2xl shadow-inner">{item.sticker}</div>}
                    <div className="mt-2.5 flex items-center gap-4 text-[10px] font-bold text-white/30">
                      <button onClick={() => toggleCommentLike(contentId, kind, item.id)} className={'flex items-center gap-1.5 transition ' + (item.liked ? 'text-pop-400' : 'hover:text-white/65')}>
                        <Heart size={14} fill={item.liked ? 'currentColor' : 'none'} />{item.likes}
                      </button>
                      <button onClick={() => { setReplyTo({ id: item.id, username: item.author.username }); setExpanded(true); }} className="hover:text-white/70">Reply</button>
                      {!!item.replies && <button onClick={() => setExpandedReplies(previous => { const next = new Set(previous); if (next.has(item.id)) next.delete(item.id); else next.add(item.id); return next; })} className="flex items-center gap-1 hover:text-white/70">{expandedReplies.has(item.id) ? 'Hide' : 'View'} {item.replies} {item.replies === 1 ? 'reply' : 'replies'} {expandedReplies.has(item.id) ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}</button>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="relative shrink-0 border-t border-white/10 bg-surface-950/98 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
          {replyTo && <div className="mb-2 flex items-center justify-between rounded-2xl bg-white/[.04] px-3 py-2 text-[10px] text-white/45"><span>Replying to <strong className="text-white/70">@{replyTo.username}</strong></span><button onClick={() => setReplyTo(null)} className="text-white/35"><X size={13}/></button></div>}

          <AnimatePresence>
            {stickerOpen && (
              <motion.div initial={{ y: 12, opacity: 0, scale: .98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 12, opacity: 0, scale: .98 }} className="absolute bottom-full left-2 right-2 mb-2 overflow-hidden rounded-[26px] border border-white/10 bg-surface-900 shadow-2xl">
                <div className="p-3 pb-2">
                  <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[.04] px-3 py-2">
                    <Search size={15} className="text-white/30"/>
                    <input value={stickerQuery} onChange={e => setStickerQuery(e.target.value)} placeholder="Search stickers & reactions" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-white/25"/>
                    {stickerQuery && <button onClick={() => setStickerQuery('')}><X size={13} className="text-white/30"/></button>}
                  </div>
                </div>
                <div className="flex gap-1 overflow-x-auto px-3 pb-2">
                  {[
                    ['trending','Trending',TrendingUp],
                    ['reactions','Reactions',Smile],
                    ['hype','Hype',Sparkles],
                    ['love','Love',Heart],
                    ['saved','Saved',Star],
                  ].map(([key,label,Icon]) => (
                    <button key={key} onClick={() => setStickerTab(key as typeof stickerTab)} className={'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-black ' + (stickerTab === key ? 'bg-pop-500 text-black' : 'bg-white/[.05] text-white/45')}>
                      <Icon size={12}/>{label}
                    </button>
                  ))}
                  <button onClick={() => setStickerTab('saved')} className="ml-auto flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[10px] font-black text-white/40"><Star size={12}/> Saved</button>
                </div>
                <div className="max-h-52 overflow-y-auto px-3 pb-3">
                  <div className="grid grid-cols-6 gap-1.5">
                    {(stickerQuery ? Object.values(stickerPacks).flat().filter(s => s.toLowerCase().includes(stickerQuery.toLowerCase())) : stickerTab === 'saved' ? favoriteStickers : stickerPacks[stickerTab]).map((sticker, index) => (
                      <button key={sticker + index} onClick={() => { setSelectedSticker(sticker); setFavoriteStickers(previous => previous.includes(sticker) ? previous : [...previous.slice(-7), sticker]); setStickerOpen(false); setExpanded(true); }} className="group relative grid aspect-square place-items-center rounded-2xl border border-white/5 bg-white/[.035] text-2xl transition hover:-translate-y-0.5 hover:bg-white/[.08] active:scale-90">
                        <span>{sticker}</span>
                        <span className="pointer-events-none absolute bottom-1 right-1 opacity-0 transition group-hover:opacity-100"><Star size={9} className="text-white/35"/></span>
                      </button>
                    ))}
                  </div>
                  {!stickerQuery && stickerTab === 'trending' && <div className="mt-3 rounded-2xl bg-white/[.035] px-3 py-2 text-[9px] font-bold text-white/30">Popular on PopRate right now</div>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={'rounded-[24px] border border-white/10 bg-white/[.045] transition ' + (expanded ? 'p-3' : 'px-3 py-2')}>
            <div className="flex items-end gap-2">
              <Avatar src="https://picsum.photos/seed/me/100/100" alt="You" size="sm" />
              <textarea ref={textareaRef} value={composer} onFocus={() => setExpanded(true)} onChange={e => setComposer(e.target.value)} onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit(); }} rows={expanded ? 3 : 1} placeholder={replyTo ? 'Reply to @' + replyTo.username + '...' : 'Add a comment...'} className="max-h-28 min-h-6 flex-1 resize-none bg-transparent py-1 text-sm leading-5 outline-none placeholder:text-white/25" />
              <button onClick={submit} disabled={!composer.trim() && !selectedSticker} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-pop-500 text-black disabled:opacity-30"><Send size={16}/></button>
            </div>
            <div className="mt-2 flex items-center gap-1">
              <button onClick={() => setStickerOpen(v => !v)} className={'grid h-8 w-8 place-items-center rounded-full transition ' + (stickerOpen || selectedSticker ? 'bg-pop-500/15 text-pop-300' : 'text-white/40 hover:bg-white/[.05]')}><Smile size={16}/></button>
              <button onClick={() => onToast?.('Photo comments are coming next')} className="grid h-8 w-8 place-items-center rounded-full text-white/35 hover:bg-white/[.05]"><ImageIcon size={15}/></button>
              <button onClick={() => { setComposer(v => v + '@'); setExpanded(true); textareaRef.current?.focus(); }} className="grid h-8 w-8 place-items-center rounded-full text-white/35 hover:bg-white/[.05]"><AtSign size={15}/></button>
              {selectedSticker && <span className="ml-1 flex items-center gap-1 rounded-full bg-pop-500/10 px-2 py-1 text-[10px] font-bold text-pop-300"><span className="text-base">{selectedSticker}</span> Ready to send</span>}
              <button onClick={() => setExpanded(v => !v)} className="ml-auto grid h-8 w-8 place-items-center rounded-full text-white/30">{expanded ? <ChevronDown size={15}/> : <ChevronUp size={15}/>}</button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
