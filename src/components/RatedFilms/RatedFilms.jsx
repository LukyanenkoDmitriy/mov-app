import { useEffect, useState } from 'react'
import axios from 'axios'
import { Spin } from 'antd'

import ListFilms from '../ListFilms/ListFilms'

export default function RatedFilms({ guestSessionToken }) {
  const [ratedFilms, setRatedFilms] = useState([])
  const itemsPerPage = 10

  useEffect(() => {
    const fetchRatedFilms = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/guest_session/${guestSessionToken}/rated/movies?api_key=10698e56c6a47821c5503f7c223f54b5`
        )
        setRatedFilms(response.data.results)
      } catch (error) {
        console.error('Error fetching rated films:', error)
      }
    }

    fetchRatedFilms()
  }, [])

  return (
    <Spin spinning={!ratedFilms.length}>
      <ListFilms
        dataFilms={ratedFilms}
        searchFlag={false}
        currentPage={1}
        itemsPerPage={itemsPerPage}
        setCurrentPage={() => {}}
        totalResults={ratedFilms.length}
        handleSearch={() => {}}
        searchValue=""
      />
    </Spin>
  )
}
