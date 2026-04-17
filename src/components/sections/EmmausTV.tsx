"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { BookOpen, Heart, Lightbulb, Play, Users, X } from "lucide-react";
import { YoutubeIcon } from "@/components/icons/YoutubeIcon";
import { site } from "@/lib/site";

/*
 * Video preview data — each entry represents a featured video.
 * Replace the videoId values with real YouTube video IDs from the
 * Emmaus TV channel to show real thumbnails and playback.
 *
 * To find a video ID: open the video on YouTube and copy the string
 * after "v=" in the URL. e.g. youtube.com/watch?v=dQw4w9WgXcQ → "dQw4w9WgXcQ"
 */
const featuredVideos = [
  {
    playlistId: "PLqPZHaJuFkjPKmnVffke5OVF78RcW856y",
    thumbVideoId: "rpTgSymiXAU",
    title: "Life of Christ — Introduction",
    series: "Life of Christ",
    Icon: Heart,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    playlistId: "PLqPZHaJuFkjNCJfUaP4-h1lgqxtlfYSNi",
    thumbVideoId: "KWXs1HIMl3g",
    title: "General Introduction to the Bible",
    series: "Bible Introduction",
    Icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    playlistId: "PLqPZHaJuFkjMlDHC9_4Bwuc-9q91_rQrS",
    thumbVideoId: "lyK8arS5g84",
    title: "Parables in the Bible",
    series: "Bible Parables",
    Icon: Lightbulb,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    playlistId: "PLqPZHaJuFkjP4SeOHHxPfAt3488IVymTu",
    thumbVideoId: "7XenrMIa-QA",
    title: "Discipleship — Walking with Christ",
    series: "Discipleship",
    Icon: Users,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

export function EmmausTVSection() {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <section
      id="emmaus-tv"
      className="bg-section-rose py-16 md:py-24"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header row */}
          <div className="animate-fade-in-up">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden shrink-0">
                <Image
                  src="/logos/emmaus-tv.png"
                  alt="Emmaus TV Logo"
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <h2 className="text-2xl font-bold text-[var(--color-foreground)] sm:text-3xl md:text-4xl">
                  Emmaus TV - JGF
                </h2>
                <a
                  href={site.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Emmaus TV on YouTube"
                  className="group cursor-pointer p-3 rounded-xl bg-red-500/10 hover:bg-red-500 dark:bg-red-500/10 dark:hover:bg-red-600 transform hover:scale-110 hover:rotate-6 hover:shadow-lg transition-all duration-300"
                >
                  <YoutubeIcon
                    size={28}
                    className="text-red-600 dark:text-red-500 group-hover:text-white transition-colors duration-300"
                  />
                </a>
              </div>
            </div>
            <div className="w-20 h-1 rounded-full bg-gradient-to-r from-red-500 to-red-700" />
          </div>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[var(--color-foreground-soft)] sm:text-lg">
            To reach more people and enable online courses, the group launched the YouTube channel{" "}
            <strong className="text-red-500">&ldquo;EMMAUS TV - JGF&rdquo;</strong>.
            Watch video lessons from our current series below.
          </p>

          {/* Video preview grid */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredVideos.map((v) => (
              <VideoCard
                key={v.title}
                video={v}
                onPlay={() => setActiveVideo(v.playlistId)}
              />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href={site.social.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white px-6 py-3 rounded-lg font-semibold text-base transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <YoutubeIcon size={20} />
              Visit Our Channel
            </a>
            <span className="text-sm text-[var(--color-muted)]">
              {site.social.youtubeHandle}
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox video player */}
      {activeVideo ? (
        <VideoLightbox
          playlistId={activeVideo}
          onClose={() => setActiveVideo(null)}
        />
      ) : null}
    </section>
  );
}

/* ---- Video preview card ---- */

function VideoCard({
  video,
  onPlay,
}: {
  video: (typeof featuredVideos)[number];
  onPlay: () => void;
}) {
  const { thumbVideoId, title, series, Icon, color, bg } = video;
  const thumbnail = `https://i.ytimg.com/vi/${thumbVideoId}/hqdefault.jpg`;

  return (
    <button
      type="button"
      onClick={onPlay}
      className="hover-lift group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] text-left shadow-soft dark:bg-[var(--color-surface)]"
    >
      {/* Real YouTube thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-surface)] dark:bg-[var(--color-surface-2)]">
        <Image
          src={thumbnail}
          alt={title}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600/90 shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
            <Play className="h-5 w-5 fill-current text-white ml-0.5 sm:h-6 sm:w-6" />
          </div>
        </div>
        {/* Series badge */}
        <span className={`absolute left-2 top-2 inline-flex items-center gap-1.5 rounded-full ${bg} backdrop-blur-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${color}`}>
          <Icon size={10} />
          {series}
        </span>
        {/* Playlist badge */}
        <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4zm14 0v4l3-2z" />
          </svg>
          Playlist
        </span>
      </div>

      {/* Title */}
      <div className="p-4">
        <p className="text-sm font-medium leading-snug text-[var(--color-foreground)] group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
          {title}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[var(--color-muted)]">
          <YoutubeIcon size={12} className="text-red-500" />
          Emmaus TV - JGF
        </p>
      </div>
    </button>
  );
}

/* ---- Lightbox player (opens on click) ---- */

function VideoLightbox({
  playlistId,
  onClose,
}: {
  playlistId: string;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const stableClose = useCallback(() => onClose(), [onClose]);

  // ESC key handler
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") stableClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [stableClose]);

  // Focus trap — keep focus inside the lightbox
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => prev?.focus();
  }, []);

  return (
    <div
      ref={backdropRef}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) stableClose(); }}
    >
      <div className="relative w-full max-w-4xl">
        <button
          ref={closeRef}
          type="button"
          onClick={stableClose}
          className="absolute -top-12 right-0 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          aria-label="Close video"
        >
          <X size={16} />
          Close
        </button>
        <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&autoplay=1&rel=0`}
            title="YouTube playlist player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </div>
  );
}
