import React, { useEffect, useState, useCallback, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedCard from "../components/FeedCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

// How many movies per page to fetch (keep small for fast first paint)
const PAGE_SIZE = 8;

export default function Feed() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  const fetchMovieBatch = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      // discover/popular endpoint with small page size — TMDB ignores size param, so we keep page small
      const res = await fetch(`${API_BASE_URL}/movie/popular?page=${page}`, API_OPTIONS);
      const data = await res.json();

      if (!data || !data.results || data.results.length === 0) {
        setHasMore(false);
        return;
      }

      // push only essential metadata; trailers will be fetched later on demand
      const batch = data.results.map(m => ({
        id: m.id,
        title: m.title,
        poster_path: m.poster_path,
        release_date: m.release_date,
        overview: m.overview,
      }));

      setMovies(prev => [...prev, ...batch]);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Feed: failed to load movies", err);
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [page]);

  useEffect(() => {
    fetchMovieBatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-black w-full text-white min-h-screen flex flex-col items-center">

      <InfiniteScroll
        dataLength={movies.length}
        next={fetchMovieBatch}
        hasMore={hasMore}
        loader={<div className="py-6 text-gray-400">Loading more...</div>}
        style={{ width: "100%" }}
      >
        <div className="flex flex-col items-center gap-6 w-screen max-w-3xl">
          {movies.map((movie, idx) => (
            <FeedCard
              key={movie.id}
              movie={movie}
              index={idx}
              // pass a callback to prefetch next few if you want
              prefetchNext={() => {
                // simple heuristic: attempt to prefetch the next 1
                if (movies[idx + 1]) {
                  // the card will fetch when visible; we can optionally signal it
                }
              }}
            />
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
}
