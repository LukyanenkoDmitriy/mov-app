import { Alert, Pagination } from 'antd'

import ItemFilm from '../ItemFilm/ItemFilm'
import './ListFilms.css'
import { useGenres } from '../../context/context'

export default function ListFilms({
  dataFilms,
  searchFlag,
  currentPage,
  itemsPerPage,
  totalResults,
  handleSearch,
  searchValue,
  guestSessionToken,
}) {
  const genres = useGenres()

  let startIndex = (currentPage - 1) * itemsPerPage
  let endIndex = startIndex + itemsPerPage

  if (endIndex > dataFilms.length) {
    endIndex = dataFilms.length
    startIndex = Math.max(endIndex - itemsPerPage, 0)
  }

  const visibleFilms = dataFilms.slice(startIndex, endIndex)

  return (
    <div className="list-conteiner">
      {visibleFilms.length === 0 && !searchFlag ? (
        <Alert message="Фильмы не найдены" type="info" />
      ) : (
        <>
          <ul className="list-films">
            {visibleFilms.map((film) => (
              <li className="films-list" key={film.id}>
                <ItemFilm film={film} genres={genres} guestSessionToken={guestSessionToken} />
              </li>
            ))}
          </ul>
          {visibleFilms.length > 0 && (
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={totalResults}
              onChange={(page) => handleSearch(searchValue, page)}
              className="pagination"
            />
          )}
        </>
      )}
    </div>
  )
}
