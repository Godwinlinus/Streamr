import React, { useEffect, useState, useCallback, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FeedCard from "../components/FeedCard";
import { FiHeart, FiMessageCircle, FiSend } from "react-icons/fi";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const PAGE_SIZE = 8;

// Shuffle function that randomizes movie order
const shuffleArray = arr => {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export default function Feed() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isFetchingRef = useRef(false);

  const fetchMovieBatch = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      const res = await fetch(`${API_BASE_URL}/movie/popular?page=${page}`, API_OPTIONS);
      const data = await res.json();

      if (!data?.results?.length) {
        setHasMore(false);
        return;
      }

      const batch = data.results.map(m => ({
        id: m.id,
        title: m.title,
        poster_path: m.poster_path,
        release_date: m.release_date,
        overview: m.overview,
      }));

      // randomize the new batch
      const shuffledBatch = shuffleArray(batch);

      // optional: also reshuffle existing movies + new ones for chaos mode
      // setMovies(prev => shuffleArray([...prev, ...shuffledBatch]));

      setMovies(prev => [...prev, ...shuffledBatch]);
      setPage(p => p + 1);
    } catch (err) {
      console.error("Feed: failed to load movies", err);
      setHasMore(false);
    } finally {
      isFetchingRef.current = false;
    }
  }, [page]);

  useEffect(() => {
    fetchMovieBatch();
  }, []); // don't ruin this with React linting, trust your instincts

  return (
    <div className="bg-black text-white min-h-screen w-full flex flex-col items-center">

      <div className="pt-4 w-full max-w-md">
        <InfiniteScroll
          dataLength={movies.length}
          next={fetchMovieBatch}
          hasMore={hasMore}
          loader={<div className="py-8 text-gray-400 text-center">Loading chaos...</div>}
          style={{ overflow: "visible" }}
        >
          <div className="flex flex-col items-center gap-10 w-full">
            {movies.map((movie, idx) => (
              <div key={movie.id} className="w-full">
                {/* Media Card */}
                <div className="rounded-lg overflow-hidden shadow-md shadow-black/25">
                  <FeedCard movie={movie} index={idx} />
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-6 px-3 py-3 text-xl opacity-90">
                  <FiHeart className="cursor-pointer hover:opacity-60 transition" />
                  <FiMessageCircle className="cursor-pointer hover:opacity-60 transition" />
                  <FiSend className="cursor-pointer hover:opacity-60 transition" />
                </div>

                {/* Caption */}
                <div className="px-3 text-sm text-gray-300 leading-snug line-clamp-2">
                  <span className="font-semibold text-white mr-1">{movie.id}</span>
                  {movie.overview || "No description available"}
                </div>

                {/* Release date like IG timestamp */}
                <div className="text-xs px-3 pt-1 pb-2 text-gray-500 uppercase tracking-wider">
                  {movie.release_date}
                </div>
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}
