import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const GenresContext = createContext()

export function GenresProvider({ children }) {
  const [genres, setGenres] = useState([])

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/genre/movie/list?api_key=10698e56c6a47821c5503f7c223f54b5'
        )
        setGenres(response.data.genres)
      } catch (error) {
        console.error('Error fetching genres:', error)
      }
    }
    fetchGenres()
  }, [])

  return <GenresContext.Provider value={genres}>{children}</GenresContext.Provider>
}

export function useGenres() {
  return useContext(GenresContext)
}
