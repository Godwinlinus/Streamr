import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { AiOutlineArrowLeft } from 'react-icons/ai';
import { motion } from 'framer-motion';

const Watch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [movieData, setMovieData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.selectedTrailer) {
      setMovieData(location.state);
    } else {
      setError("No trailer available for this movie");
      setTimeout(() => navigate(-1), 3000);
    }
  }, [location.state, navigate]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (!movieData?.selectedTrailer) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="w-8 h-8 border-4 border-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-screen bg-black"
    >
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white mb-4 hover:text-red-600 transition-colors"
        >
          <AiOutlineArrowLeft size={24} className="mr-2" />
          Back
        </button>
        
        <div className="relative pt-[56.25%]">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${movieData.selectedTrailer.key}?autoplay=1`}
            title={movieData.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        <div className="mt-6 text-white">
          <h1 className="text-sm font-bold mb-2">{movieData.title}</h1>
          <p className="text-gray-400 mb-4">{movieData.overview}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <p>Release Date: {movieData.release_date}</p>
            <p>Rating: {movieData.vote_average.toFixed(1)}/10</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Watch;