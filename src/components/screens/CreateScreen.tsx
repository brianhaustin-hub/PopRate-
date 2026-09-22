'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Camera, Image, Video, Tag, Sparkles, Trophy, Plus } from 'lucide-react';

export function CreateScreen() {
  const [activeCreate, setActiveCreate] = useState<'post' | 'battle' | 'challenge' | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('');

  const categories = ['Photography', 'Digital Art', 'Portrait', 'Abstract', '3D Art', 'Nature', 'Fashion', 'Lifestyle'];

  const handleImageSelect = () => {
    const newImage = `https://picsum.photos/seed/create${Date.now()}/800/1200`;
    setSelectedImages((prev) => [...prev, newImage]);
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag) && tag.length > 0) {
      setTags((prev) => [...prev, tag]);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-10 bg-surface-950/95 backdrop-blur-xl px-4 py-3">
        <h1 className="text-2xl font-bold text-white">Create</h1>
        <p className="text-xs text-white/40">Share your vision</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {!activeCreate ? (
          <div className="grid grid-cols-3 gap-3 mt-4">
            <button
              onClick={() => setActiveCreate('post')}
              className="flex flex-col items-center gap-2 p-4 bg-surface-900 rounded-2xl border border-white/5 hover:border-pop-500/30"
            >
              <div className="w-14 h-14 rounded-xl bg-pop-500/20 flex items-center justify-center">
                <Image size={28} className="text-pop-500" />
              </div>
              <span className="text-sm font-semibold text-white">Post</span>
              <span className="text-xs text-white/40">Share a photo</span>
            </button>

            <button
              onClick={() => setActiveCreate('battle')}
              className="flex flex-col items-center gap-2 p-4 bg-surface-900 rounded-2xl border border-white/5 hover:border-neon-500/30"
            >
              <div className="w-14 h-14 rounded-xl bg-neon-500/20 flex items-center justify-center">
                <Trophy size={28} className="text-neon-500" />
              </div>
              <span className="text-sm font-semibold text-white">Rate Battle</span>
              <span className="text-xs text-white/40">Create a battle</span>
            </button>

            <button
              onClick={() => setActiveCreate('challenge')}
              className="flex flex-col items-center gap-2 p-4 bg-surface-900 rounded-2xl border border-white/5 hover:border-yellow-500/30"
            >
              <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Sparkles size={28} className="text-yellow-500" />
              </div>
              <span className="text-sm font-semibold text-white">Challenge</span>
              <span className="text-xs text-white/40">Start a challenge</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 mt-4">
            <button
              onClick={() => setActiveCreate(null)}
              className="flex items-center gap-2 text-sm text-white/60"
            >
              <Plus size={16} /> Back
            </button>

            {/* Image Selection */}
            <div className="bg-surface-900 rounded-2xl p-4 border border-white/5">
              <h3 className="font-semibold text-white mb-3">Media</h3>
              {selectedImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {selectedImages.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden relative">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs">✕</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleImageSelect}
                    className="aspect-square rounded-xl bg-surface-800 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2"
                  >
                    <Image size={24} className="text-white/30" />
                    <span className="text-xs text-white/30">Photo</span>
                  </button>
                  <button
                    onClick={() => {}}
                    className="aspect-square rounded-xl bg-surface-800 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-2"
                  >
                    <Video size={24} className="text-white/30" />
                    <span className="text-xs text-white/30">Video</span>
                  </button>
                </div>
              )}
            </div>

            {/* Caption */}
            <div className="bg-surface-900 rounded-2xl p-4 border border-white/5">
              <h3 className="font-semibold text-white mb-3">Caption</h3>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write a caption..."
                className="w-full bg-surface-800 text-white rounded-xl p-4 text-sm border border-white/5 focus:border-pop-500/50 focus:outline-none resize-none h-32"
              />
            </div>

            {/* Category */}
            <div className="bg-surface-900 rounded-2xl p-4 border border-white/5">
              <h3 className="font-semibold text-white mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      category === cat ? 'bg-pop-500 text-white' : 'bg-surface-800 text-white/60'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-surface-900 rounded-2xl p-4 border border-white/5">
              <h3 className="font-semibold text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, i) => (
                  <Badge key={i} variant="accent" className="cursor-pointer" onClick={() => setTags(tags.filter((_, j) => j !== i))}>
                    {tag} ✕
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                {['#photography', '#art', '#design', '#creative'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className="px-3 py-1 rounded-full bg-surface-800 text-xs text-white/60 hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Publish */}
            <button className="w-full py-4 bg-pop-500 text-white font-bold rounded-2xl text-lg hover:bg-pop-600 active:scale-95 transition-all shadow-pop">
              Publish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
