import { useEffect, useState } from 'react'
import axios from 'axios'
import { Alert, Input, Spin, Tabs } from 'antd'
import _debounce from 'lodash/debounce'

import { GenresProvider } from '../../context/context'
import ListFilms from '../ListFilms/ListFilms'
import RatedFilms from '../RatedFilms/RatedFilms'

import './App.css'

const { TabPane } = Tabs
export default function App() {
  const [movies, setMovies] = useState([])
  const [searchFlag, setSearchFlag] = useState(true)
  const [loading, setLoading] = useState(false)
  const [offline, setOffline] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [searchValue, setSearchValue] = useState('')
  const [guestSessionToken, setGuestSessionToken] = useState(null)
  const itemsPerPage = 10

  useEffect(() => {
    createGuestSession()
  }, [])

  useEffect(() => {
    const handleOffline = () => {
      setOffline(!navigator.onLine)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOffline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOffline)
    }
  }, [])

  const handleSearch = async (value, page = 1) => {
    setOffline(false)
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=10698e56c6a47821c5503f7c223f54b5&query=${value}&page=${page}&guest_session_id=${guestSessionToken}`
      )
      setSearchFlag(false)
      setMovies(response.data.results)
      setCurrentPage(page)
      setTotalResults(Math.floor(response.data.total_results / 2))
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
    setLoading(false)
  }

  const handleDebouncedSearch = _debounce(handleSearch, 600)

  const handleInputChange = (value) => {
    setLoading(true)
    setSearchValue(value)
    handleDebouncedSearch(value)
  }

  const createGuestSession = async () => {
    try {
      const response = await axios.get(
        'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=10698e56c6a47821c5503f7c223f54b5'
      )
      setGuestSessionToken(response.data.guest_session_id)
    } catch (err) {
      console.error('Error creating guest session:', err)
    }
  }

  return (
    <GenresProvider>
      <div>
        <Tabs defaultActiveKey="search" className="tabs">
          <TabPane tab="Search" key="search" className="search-panele">
            <div className="app-container">
              <Input.Search
                placeholder="Введите название фильма"
                onChange={(e) => handleInputChange(e.target.value)}
                className="search-input"
              />
            </div>
            {offline ? (
              <Alert message="У вас нет интернета" type="error" showIcon className="offline-error" />
            ) : (
              <Spin spinning={loading}>
                <ListFilms
                  dataFilms={movies}
                  searchFlag={searchFlag}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  setCurrentPage={setCurrentPage}
                  totalResults={totalResults}
                  handleSearch={handleSearch}
                  searchValue={searchValue}
                  guestSessionToken={guestSessionToken}
                />
              </Spin>
            )}
          </TabPane>
          <TabPane tab="Rated" key="rated">
            <RatedFilms guestSessionToken={guestSessionToken} />
          </TabPane>
        </Tabs>
      </div>
    </GenresProvider>
  )
}
