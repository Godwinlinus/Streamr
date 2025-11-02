import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { motion } from 'framer-motion';

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default function Watch() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialMovie = location.state;
  const [movie, setMovie] = useState(initialMovie);
  const [credits, setCredits] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!movie) {
          // Try fetching as a movie first
          const movieRes = await fetch(
            `${API_BASE_URL}/movie/${id}?append_to_response=videos`,
            API_OPTIONS
          );

          if (movieRes.ok) {
            const data = await movieRes.json();
            if (data.success === false) {
              throw new Error('Movie not found');
            }
            setMovie(data);
            // Fetch movie credits
            const creditRes = await fetch(`${API_BASE_URL}/movie/${id}/credits`, API_OPTIONS);
            if (creditRes.ok) {
              const creditData = await creditRes.json();
              setCredits(creditData);
            }
          } else {
            // If movie fetch fails, try as a TV show
            const tvRes = await fetch(
              `${API_BASE_URL}/tv/${id}?append_to_response=videos`,
              API_OPTIONS
            );
            
            if (!tvRes.ok) {
              throw new Error('Content not found');
            }
            
            const tvData = await tvRes.json();
            if (tvData.success === false) {
              throw new Error('TV Show not found');
            }
            
            // Convert TV show data to match movie data structure
            const processedTvData = {
              ...tvData,
              title: tvData.name,
              release_date: tvData.first_air_date,
              runtime: tvData.episode_run_time?.[0] || null
            };
            
            setMovie(processedTvData);
            
            // Fetch TV credits
            const tvCreditRes = await fetch(`${API_BASE_URL}/tv/${id}/credits`, API_OPTIONS);
            if (tvCreditRes.ok) {
              const creditData = await tvCreditRes.json();
              setCredits(creditData);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError('Unable to load content. Redirecting...');
        setTimeout(() => navigate(-1), 3000);
      }
    };

    fetchData();
  }, [id, movie, navigate]);

  if (error) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="bg-black min-h-screen text-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const trailer =
    movie.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
    movie.videos?.results?.find((v) => v.type === "Teaser" && v.site === "YouTube");

  const director = credits?.crew?.find((c) => c.job === "Director");
  const writers = credits?.crew?.filter(
    (c) => c.job === "Writer" || c.job === "Screenplay"
  );
  const topCast = credits?.cast?.slice(0, 8);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-black min-h-screen text-white"
    >
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white mb-4 hover:text-red-600 transition-colors"
        >
          <AiOutlineArrowLeft size={24} className="mr-2" />
          Back
        </button>

        {/* Video */}
        {trailer ? (
          <iframe
            className="w-full h-[65vh] rounded-lg"
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1`}
            title={movie.title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-[60vh] bg-gray-800 rounded-lg flex items-center justify-center">
            No Trailer Available
          </div>
        )}

        {/* Title + Tagline */}
        <div>
          <h1 className="text-xl font-extrabold">{movie.title}</h1>
          {movie.tagline && (
            <p className="italic text-gray-400 mt-1">{movie.tagline}</p>
          )}
        </div>

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <span>{movie.release_date?.split("-")[0]}</span>
          <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
          <span className="font-semibold text-emerald-400">
            {(movie.vote_average * 10).toFixed(0)}% Match
          </span>
          <span>{movie.original_language?.toUpperCase()}</span>
          <span>
            ⭐ {movie.vote_average.toFixed(1)} ({movie.vote_count} votes)
          </span>
        </div>

        {/* Overview */}
        <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

        {/* Credits */}
        <div className="text-sm md:text-xl text-gray-400 space-y-1">
          {director && <p><span className="font-semibold text-white">Director:</span> {director.name}</p>}
          {writers?.length > 0 && (
            <p>
              <span className="font-semibold text-white">Writers:</span>{" "}
              {writers.map((w) => w.name).join(", ")}
            </p>
          )}
          <p>
            <span className="font-semibold text-white">Genres:</span>{" "}
            {movie.genres?.map((g) => g.name).join(", ")}
          </p>
          <p>
            <span className="font-semibold text-white">Budget:</span> ${movie.budget?.toLocaleString()}
          </p>
          <p>
            <span className="font-semibold text-white">Revenue:</span> ${movie.revenue?.toLocaleString()}
          </p>
        </div>

        {/* Cast */}
        <div className="mt-6">
          <h2 className="text-md md:text-xl font-semibold mb-3">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {topCast?.map((actor) => (
              <div key={actor.id} className="text-center">
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "/no-profile.png"
                  }
                  alt={actor.name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <p className="text-sm font-semibold">{actor.name}</p>
                <p className="text-xs text-gray-400">{actor.character}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="mt-6 border-t border-gray-700 pt-4">
          <h2 className="text-md md:text-xl font-bold mb-2">Comments</h2>
          <p className="text-gray-500 text-sm">
            No comments yet...
          </p>
        </div>
      </div>
    </motion.div>
  );
}
