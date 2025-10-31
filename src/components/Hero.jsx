import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w1280";
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const Hero = ({ selectedMovie }) => {
  const [popularMovie, setPopularMovie] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularMovie = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/movie/popular?language=en-US&page=1`,
          API_OPTIONS
        );
        const data = await res.json();

        if (data.results?.length) {
          const movieId = data.results[0].id;
          const detailsRes = await fetch(
            `${API_BASE_URL}/movie/${movieId}?append_to_response=videos`,
            API_OPTIONS
          );
          const movieDetails = await detailsRes.json();
          setPopularMovie(movieDetails);
        }
      } catch (err) {
        console.error("Error fetching popular movie:", err);
      }
    };

    if (!selectedMovie) fetchPopularMovie();
  }, [selectedMovie]);

  const displayMovie = selectedMovie || popularMovie;

  const handleWatchMovie = () => {
    if (!displayMovie) return;
    navigate(`/watch/${displayMovie.id}`, { state: displayMovie });
  };

  return (
    <motion.section
      key={displayMovie ? displayMovie.id : "default-hero"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      id="hero"
      className="relative flex flex-col justify-end min-h-[70vh] sm:h-screen bg-black"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5)), url(${
          displayMovie
            ? `${IMAGE_BASE_URL}${
                displayMovie.backdrop_path || displayMovie.poster_path
              }`
            : "/hero.jpg"
        })`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

      <div className="relative z-0 px-4 sm:px-6 md:px-6 pb-16 sm:pb-24">
        <motion.div
          className="max-w-3xl space-y-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight text-white drop-shadow-md">
            {displayMovie ? displayMovie.title : "Loading..."}
          </h1>

          <div className="flex items-center flex-wrap gap-3 text-gray-300 text-sm sm:text-base">
            {displayMovie && (
              <>
                <span className="text-emerald-400 font-semibold">
                  {Math.round(displayMovie.vote_average * 10)}% Match
                </span>
                <span className="opacity-70">
                  {displayMovie.release_date?.split("-")[0]}
                </span>
                {displayMovie.runtime && (
                  <span className="opacity-70">
                    {Math.floor(displayMovie.runtime / 60)}h{" "}
                    {displayMovie.runtime % 60}m
                  </span>
                )}
              </>
            )}
          </div>

          <p className="max-w-2xl text-gray-300 text-sm sm:text-base leading-relaxed">
            {displayMovie
              ? displayMovie.overview
              : "Fetching your cinematic experience..."}
          </p>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <button
              onClick={handleWatchMovie}
              className="group flex items-center gap-2 px-6 py-3 mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-all duration-300 focus-visible:outline-none"
            >
              <FaPlay className="group-hover:scale-110 transition-transform" />
              <span>Play</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;
