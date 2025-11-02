import React from 'react'
import Hero from '../components/Hero'
import TrendingMovies from '../components/TrendingMovies'
import AllMovies from '../components/AllMovies'

const Home = ({ selectedMovie, trendingMovies, moviesList, isLoading, errorMessage, onSelectMovie }) => {
  return (
    <div className="w-full">
      <Hero selectedMovie={selectedMovie} />
      <div className="w-full space-y-12">
        <TrendingMovies trendingMovies={trendingMovies} onSelectMovie={onSelectMovie} />
        <AllMovies 
          moviesList={moviesList}
          isLoading={isLoading}
          errorMessage={errorMessage}
          onSelectMovie={onSelectMovie}
        />
      </div>
    </div>
  )
}

export default Home