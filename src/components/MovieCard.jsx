import React from 'react'

const MovieCard = ({ movie, onSelectMovie }) => {
  const { 
    title, 
    name,
    vote_average, 
    poster_path, 
    release_date, 
    first_air_date,
    original_language,
    media_type
  } = movie

  const displayTitle = title || name;
  const displayDate = release_date || first_air_date;

  return (
    <div 
      onClick={() => {
        onSelectMovie(movie);
        document.getElementById('hero').scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }} 
      className="flex flex-col gap-2 sm:gap-3 hover:scale-95 duration-300 ease-linear cursor-pointer"
    >
      <img 
        className="w-full aspect-[2/3] rounded-xl object-cover bg-center" 
        src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no_movie.png'} 
        alt={title}
        loading="lazy"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      />
      
      <div className="px-1">
        <p className="text-sm sm:text-base md:text-lg font-semibold line-clamp-1">
          {displayTitle}
        </p>

        <div className="flex flex-wrap items-center gap-x-1 text-xs sm:text-sm text-gray-400">
          <p>{displayDate ? displayDate.slice(0, 4) : 'Unknown'} ·</p>
          <p>{vote_average ? vote_average.toFixed(1) : 'Unknown'} ·</p>
          <p className="uppercase">{original_language || 'Unknown'}</p>
          <p className="bg-gray-800 px-1.5 py-0.5 rounded text-xs uppercase ml-1">
            {media_type || 'movie'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default MovieCard
