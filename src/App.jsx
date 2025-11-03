
import React, { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'


import Search from './components/Search'
import Footer from './components/Footer'
import SideBar from './components/SideBar'
import NavBar from './components/NavBar'
import Preloader from './components/Preloader'
import SignIn from './components/auth/SignIn'


import Home from './pages/Home'
import Profile from './pages/Profile'
import SignUp from './pages/SignUp'
import TVShows from './pages/TVShows'
import Trending from './pages/Trending'
import MovieDetail from './pages/MovieDetail'
import Feed from './pages/Feed'
import Watch from './pages/Watch'
import Favourite from './pages/Favourite'
import Wrapper from './pages/Wrapper'

import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite'

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
}

const AppContent = () => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [moviesList, setMoviesList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(false)
  const [trendingMovies, setTrendingMovies] = useState([])
  const [isAppLoading, setIsAppLoading] = useState(true)

  const location = useLocation()

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm])

  const fetchMovies = async (query = '') => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const response = await fetch(endpoint, API_OPTIONS)
      if (!response.ok) throw new Error("Network response was not ok")
      const data = await response.json()

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies")
        setMoviesList([])
        return
      }

      setMoviesList(data.results || [])

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0])
        setSelectedMovie(data.results[0])
      } else if (!query && data.results.length > 0) {
        setSelectedMovie(data.results[0])
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`)
      setErrorMessage("Error fetching movies. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies()
      setTrendingMovies(movies)
    } catch (error) {
      console.error(`Error loading trending movies: ${error}`)
    }
  }

  useEffect(() => { fetchMovies(debouncedSearchTerm) }, [debouncedSearchTerm])
  useEffect(() => { loadTrendingMovies() }, [])
  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isAppLoading) {
    return (
      <AnimatePresence mode="wait">
        <Preloader />
      </AnimatePresence>
    )
  }

  const shouldHideSearch = ['/profile', '/favourite', '/trending', '/tv-shows', '/feed', '/watch', '/dashboard', '/signup']
    .some(p => location.pathname === p || location.pathname.startsWith(`${p}/`))
  const shouldHideFooter = ['/profile', '/favourite']
    .some(p => location.pathname === p || location.pathname.startsWith(`${p}/`))

  return (
    <div className="flex flex-col min-h-screen text-white bg-black scroll-smooth font-tracking-normal">
      <div className="flex-1 flex w-full">
        <SideBar />
        <div className="flex flex-col flex-1 md:ml-16 bg-black min-h-screen text-white">
          <header className="sticky top-0 z-10 bg-black w-full py-4 px-2 sm:px-3 md:px-4">
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="w-full block md:inline-block">
                <NavBar />
              </div>
              {!shouldHideSearch && (
                <div className="w-full md:w-auto mt-3 md:mt-0">
                  <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </div>
              )}
            </div>
          </header>

          <main className="flex-1 flex flex-col gap-12">
            <Routes>
              <Route
                path="/"
                element={
                  <Home
                    selectedMovie={selectedMovie}
                    trendingMovies={trendingMovies}
                    moviesList={moviesList}
                    isLoading={isLoading}
                    errorMessage={errorMessage}
                    onSelectMovie={setSelectedMovie}
                  />
                }
              />
              <Route path="/auth/signin" element={<SignIn />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/tv-shows" element={<TVShows />} />
              <Route path="/trending" element={<Trending />} />
              <Route 
                path="/favourite" 
                element={
                  <Wrapper>
                    <Favourite /> 
                  </Wrapper>     
                } 
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/watch/:id" element={<Watch />} />
            </Routes>
          </main>
        </div>
      </div>
      {!shouldHideFooter && <Footer />}
    </div>
  )
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App
