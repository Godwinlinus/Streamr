import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../components/MovieCard';
import Spinner from '../components/Spinner';
import { useNavigate } from "react-router-dom";

const TVShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  useEffect(() => {
    const fetchTVShows = async () => {
      try {
        if (fetchedRef.current) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1",
          API_OPTIONS
        );
        const data = await response.json();

        setTvShows(data.results || []);
        fetchedRef.current = true;
        setIsLoading(false);
      } catch (err) {
        setError("Error fetching TV shows");
        setIsLoading(false);
      }
    };

    fetchTVShows();
  }, []);

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const handleSelectShow = (show) => {
    navigate(`/watch/${show.id}`, {
      state: {
        ...show,
        media_type: "tv", // crucial: tells Watch page to fetch TV data
        title: show.name,
        release_date: show.first_air_date
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-8">Popular TV Shows</h2>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {tvShows.map((show) => (
          <MovieCard
            key={show.id}
            movie={{
              ...show,
              title: show.name,
              release_date: show.first_air_date,
              media_type: "tv"
            }}
            onSelectMovie={() => handleSelectShow(show)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default TVShows;
