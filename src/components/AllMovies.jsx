import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Spinner from "./Spinner";
import MovieCard from "./MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

/**
 * AllMovies
 * - Accepts an optional moviesList prop.
 * - Ensures ~maxItems are displayed by fetching additional pages from TMDB if needed.
 * - Keeps UI responsive and shows loading / error states.
 */
export default function AllMovies({
  moviesList = [],
  isLoading: outerLoading = false,
  errorMessage: outerError = null,
  onSelectMovie,
  maxItems = 40, // number of movies we aim to show
}) {
  const [internalMovies, setInternalMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(outerLoading || false);
  const [errorMessage, setErrorMessage] = useState(outerError || null);
  const [showAll, setShowAll] = useState(false);

  // helper to normalize incoming prop movies
  const normalizedPropMovies = useMemo(() => {
    if (!Array.isArray(moviesList)) return [];
    return moviesList.map((m) => ({
      id: m.id,
      title: m.title || m.name,
      poster_path: m.poster_path,
      release_date: m.release_date || m.first_air_date,
      overview: m.overview,
      ...m,
    }));
  }, [moviesList]);

  // shuffle utility (optional — keeps feed fresh each load)
  const shuffleArray = (arr) =>
    arr
      .map((v) => ({ v, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.v);

  // Fetch additional TMDB pages until we reach ~maxItems (or no more results).
  const fetchToTarget = useCallback(
    async (startingPage = 1, already = []) => {
      let results = [...already];
      let page = startingPage;
      try {
        setIsLoading(true);
        setErrorMessage(null);

        while (results.length < maxItems) {
          const res = await fetch(`${API_BASE_URL}/movie/popular?page=${page}`, API_OPTIONS);
          if (!res.ok) break;
          const data = await res.json();
          const batch = (data.results || []).map((m) => ({
            id: m.id,
            title: m.title,
            poster_path: m.poster_path,
            release_date: m.release_date,
            overview: m.overview,
            ...m,
          }));

          if (!batch.length) break;

          results = [...results, ...batch];
          page += 1;

          // safety: if TMDB returns fewer pages than needed, break
          if (page > 20) break; // prevent runaway loop
        }

        // trim and shuffle for variety
        const trimmed = results.slice(0, maxItems);
        setInternalMovies(shuffleArray(trimmed));
      } catch (err) {
        console.error("AllMovies fetch error:", err);
        setErrorMessage("Failed to load movies. Try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [maxItems]
  );

  // Decide when to use prop list or fetch:
  useEffect(() => {
    let isCancelled = false;

    (async () => {
      setErrorMessage(null);

      // If caller explicitly provides an error or loading state, prefer that
      if (outerError) {
        setErrorMessage(outerError);
        return;
      }

      if (outerLoading) {
        setIsLoading(true);
        return;
      }

      const propLen = normalizedPropMovies.length;

      // If prop already contains enough items, use it (slice to maxItems)
      if (propLen >= maxItems) {
        const chosen = normalizedPropMovies.slice(0, maxItems);
        setInternalMovies(chosen);
        setIsLoading(false);
        return;
      }

      // If prop has some items but less than max, start with them and fetch more
      if (propLen > 0 && propLen < maxItems) {
        // find next page to request — approximate: TMDB page 1 contains first 20
        const startingPage = Math.floor(propLen / 20) + 1;
        await fetchToTarget(startingPage, normalizedPropMovies);
        if (!isCancelled) setIsLoading(false);
        return;
      }

      // If no prop movies, fetch until target
      await fetchToTarget(1, []);
      if (!isCancelled) setIsLoading(false);
    })();

    return () => {
      isCancelled = true;
    };
  }, [normalizedPropMovies, outerLoading, outerError, fetchToTarget, maxItems]);

  // displayed movies are either all (showAll) or slice up to maxItems
  const displayedMovies = useMemo(() => {
    if (showAll) return internalMovies;
    return internalMovies.slice(0, maxItems);
  }, [internalMovies, showAll, maxItems]);

  const moreAvailable = internalMovies.length > maxItems;

  return (
    <section className="flex flex-col gap-6 w-full bg-black text-white py-10">
      {/* Header */}
      <div className="flex items-center justify-between px-6 sm:px-10">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
          All Movies
        </h3>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block h-[2px] w-48 bg-gradient-to-r from-red-600 to-purple-600 opacity-70 rounded-full" />
          {moreAvailable && (
            <button
              onClick={() => setShowAll((s) => !s)}
              className="text-sm text-neutral-300 hover:text-white px-3 py-1 rounded-md bg-white/5"
              aria-pressed={showAll}
            >
              {showAll ? "Show less" : `Show all (${internalMovies.length})`}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : errorMessage ? (
        <p className="text-center text-gray-400 text-lg py-10">{errorMessage}</p>
      ) : displayedMovies.length === 0 ? (
        <p className="text-center text-gray-400 text-lg py-10">No movies found.</p>
      ) : (
        <>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-8 md:px-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.04 },
              },
            }}
          >
            {displayedMovies.map((movie) => (
              <motion.div
                key={movie.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="will-change-transform"
              >
                <MovieCard movie={movie} onSelectMovie={onSelectMovie} />
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom CTA if there are more and user hasn't clicked showAll */}
          {!showAll && moreAvailable && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowAll(true)}
                className="px-4 py-2 rounded-md bg-white text-black font-medium shadow hover:brightness-95"
              >
                Load more ({internalMovies.length - maxItems} more)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
