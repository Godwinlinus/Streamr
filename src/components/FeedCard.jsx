import React, { useEffect, useRef, useState } from "react";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const trailerResultCache = new Map();
const trailerPromiseCache = new Map();

async function fetchTrailerKey(movieId, signal) {
  if (trailerResultCache.has(movieId)) return trailerResultCache.get(movieId);
  if (trailerPromiseCache.has(movieId)) return trailerPromiseCache.get(movieId);

  const p = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/movie/${movieId}/videos`, {
        ...API_OPTIONS,
        signal,
      });
      if (!res.ok) return null;
      const data = await res.json();
      const trailer = (data.results || []).find(
        (v) =>
          (v.type === "Trailer" || v.type === "Teaser") && v.site === "YouTube"
      );
      const key = trailer ? trailer.key : null;
      trailerResultCache.set(movieId, key);
      return key;
    } catch (err) {
      if (err && err.name === "AbortError") return null;
      return null;
    } finally {
      trailerPromiseCache.delete(movieId);
    }
  })();

  trailerPromiseCache.set(movieId, p);
  return p;
}

export default function FeedCard({ movie }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const controllerRef = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting && entry.intersectionRatio >= 0.55);
        });
      },
      { threshold: [0, 0.55, 0.8] }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible && controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
      setIsPlaying(false);
    }
  }, [isVisible]);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
    };
  }, []);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w1280${movie.poster_path}`
    : null;

  const togglePlayback = async () => {
    if (isPlaying) {
      // stop playback: hide iframe and show poster
      setIsPlaying(false);
      return;
    }

    // start playback
    setIsPlaying(true);

    if (trailerResultCache.has(movie.id)) {
      setTrailerKey(trailerResultCache.get(movie.id));
      return;
    }

    setLoadingTrailer(true);
    const ctrl = new AbortController();
    controllerRef.current = ctrl;
    const key = await fetchTrailerKey(movie.id, ctrl.signal);
    if (!ctrl.signal.aborted) {
      setTrailerKey(key);
      setLoadingTrailer(false);
    } else {
      setLoadingTrailer(false);
    }
  };

  const shouldUseIframe = isPlaying && trailerKey;

  return (
    // note: 'group' allows group-hover to work on the overlay button
    <div
      ref={ref}
      className="group relative w-full h-screen bg-black text-white overflow-hidden select-none"
      aria-label={movie.title}
    >
      <div className="absolute inset-0">
        {shouldUseIframe ? (
          <iframe
            title={movie.title}
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-full h-full object-cover"
            style={{ border: 0 }}
          />
        ) : posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-gray-400">
            No poster available
          </div>
        )}
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Overlay Play/Pause Button
          Behavior:
            - When not playing: visible (opacity 100)
            - When playing: hidden (opacity 0, pointer-events none)
            - When playing but user hovers the card (group-hover): show (opacity to 100, pointer-events auto)
      */}
      <button
        onClick={togglePlayback}
        aria-label={isPlaying ? "Pause trailer" : "Play trailer"}
        // dynamic classes implement the show/hide + hover-reveal behavior
        className={[
          "absolute inset-0 flex items-center justify-center transition-colors duration-200",
          // background subtle overlay on hover
          "bg-black/20 group-hover:bg-black/40",
          // visibility rules
          isPlaying
            ? "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
            : "opacity-100 pointer-events-auto",
        ].join(" ")}
      >
        <div
          className={[
            "flex items-center justify-center rounded-full shadow-lg transition-transform duration-150",
            // button size + style
            "w-16 h-16 text-3xl font-semibold",
            // background visible but slightly translucent for polish
            isPlaying ? "bg-white/85 text-black" : "bg-white/95 text-black",
          ].join(" ")}
        >
          {loadingTrailer ? "…" : isPlaying ? "⏸" : "▶"}
        </div>
      </button>

      {/* Title */}
      <div className="absolute bottom-0 w-full px-4 pb-6">
        <div className="max-w-[70%]">
          <h3 className="text-xl font-semibold leading-tight drop-shadow-lg">
            {movie.title}
          </h3>
          {movie.release_date && (
            <p className="text-sm text-gray-300">
              {movie.release_date.split("-")[0]}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
