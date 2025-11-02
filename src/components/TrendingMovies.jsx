import React from "react";
import { motion } from "framer-motion";

const TrendingMovies = ({ trendingMovies }) => {
  if (!trendingMovies || trendingMovies.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 w-full bg-black text-white py-10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-8 md:px-8">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          Trending Movies
        </h3>
        <div className="h-[2px] bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 flex-1 ml-4 opacity-70 rounded-full" />
      </div>

      {/* Responsive Grid */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 px-4 sm:px-8 md:px-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.06 },
          },
        }}
      >
        {trendingMovies.map((movie) => (
          <motion.div
            key={movie.$id}
            className="rounded-xl overflow-hidden bg-neutral-900"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="w-full h-full object-cover aspect-[2/3]"
              loading="lazy"
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default TrendingMovies;
