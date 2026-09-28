import { useEffect, useRef, useState } from 'react';
import { Play, Volume2, VolumeX } from 'lucide-react';

export interface MediaSource {
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  duration?: number;
}

export function MediaFrame({
  media,
  alt = '',
  className = '',
  videoClassName = '',
  controls = false,
  autoPlay = false,
  loop = false,
  muted = true,
  playsInline = true,
  active = true,
}: {
  media: MediaSource;
  alt?: string;
  className?: string;
  videoClassName?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  active?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlay);
  const [soundOn, setSoundOn] = useState(!muted);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
    if (active) {
      video.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [active, autoPlay, media.url, muted]);

  if (media.type === 'image') {
    return <img src={media.url} alt={alt} className={className} />;
  }

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      await video.play().catch(() => undefined);
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setSoundOn(!video.muted);
  };

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <video
        ref={videoRef}
        src={media.url}
        poster={media.thumbnail}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className={`h-full w-full object-cover ${videoClassName}`}
      />
      {!controls && (
        <>
          {!playing && <button onClick={togglePlay} aria-label="Play video" className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/65 text-white backdrop-blur"><Play size={22} fill="currentColor" /></button>}
          <button onClick={togglePlay} aria-label={playing ? 'Pause video' : 'Play video'} className="absolute inset-0 cursor-pointer" />
          <button onClick={toggleSound} aria-label={soundOn ? 'Mute video' : 'Unmute video'} className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/55 text-white backdrop-blur">
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </>
      )}
    </div>
  );
}
