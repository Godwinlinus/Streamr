import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MovieCard from '../components/MovieCard';
import { HiOutlineHeart } from 'react-icons/hi';

const Favourite = () => {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <HiOutlineHeart className="text-3xl text-red-500" />
        <h1 className="text-3xl font-bold">My Favorites</h1>
      </div>

      {favorites.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <HiOutlineHeart className="text-6xl text-gray-600 mb-4" />
          <h2 className="text-xl text-gray-400 mb-2">No favorites yet</h2>
          <p className="text-gray-500">
            Start adding movies to your favorites by clicking the heart icon on any movie
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {favorites.map((movie) => (
            <motion.div
              key={movie.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <MovieCard
                movie={movie}
                onSelectMovie={() => {}}
                isFavorite={true}
                onToggleFavorite={(movie) => {
                  const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
                  setFavorites(updatedFavorites);
                  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Favourite;