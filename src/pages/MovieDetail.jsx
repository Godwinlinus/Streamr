import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaStar, FaClock, FaCalendar } from 'react-icons/fa';
import Spinner from '../components/Spinner';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?append_to_response=videos,credits`,
          API_OPTIONS
        );

        if (!response.ok) {
          throw new Error('Movie not found');
        }

        const data = await response.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) return <Spinner />;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!movie) return null;

  const trailer = movie.videos?.results?.find(
    video => video.type === "Trailer" || video.type === "Teaser"
  );

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <div 
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base mb-6">
              <div className="flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaClock />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCalendar />
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
              {movie.genres.map(genre => (
                <span 
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="text-gray-300 max-w-2xl mb-8">{movie.overview}</p>

            {trailer && (
              <button 
                onClick={() => window.open(`https://www.youtube.com/watch?v=${trailer.key}`, '_blank')}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <FaPlay />
                <span>Watch Trailer</span>
              </button>
            )}
          </motion.div>
        </div>
      </div>

      {/* Cast Section */}
      <div className="container mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Cast</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movie.credits.cast.slice(0, 6).map(actor => (
            <div key={actor.id} className="text-center">
              <div 
                className="w-full aspect-[2/3] rounded-lg bg-cover bg-center mb-2"
                style={{
                  backgroundImage: actor.profile_path
                    ? `url(https://image.tmdb.org/t/p/w500${actor.profile_path})`
                    : 'none',
                  backgroundColor: !actor.profile_path ? '#1f1f1f' : undefined
                }}
              />
              <h3 className="font-medium">{actor.name}</h3>
              <p className="text-sm text-gray-400">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Movie Details */}
      <div className="container mx-auto px-8 pb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Details</h2>
            <div className="space-y-2 text-gray-300">
              <p><span className="text-white font-medium">Status:</span> {movie.status}</p>
              <p><span className="text-white font-medium">Release Date:</span> {movie.release_date}</p>
              <p><span className="text-white font-medium">Original Language:</span> {movie.original_language.toUpperCase()}</p>
              <p><span className="text-white font-medium">Budget:</span> ${movie.budget.toLocaleString()}</p>
              <p><span className="text-white font-medium">Revenue:</span> ${movie.revenue.toLocaleString()}</p>
            </div>
          </div>

          {movie.production_companies.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Production Companies</h2>
              <div className="flex flex-wrap gap-4">
                {movie.production_companies.map(company => (
                  company.logo_path && (
                    <img
                      key={company.id}
                      src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                      alt={company.name}
                      className="h-12 object-contain bg-white/10 rounded-lg p-2"
                    />
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;