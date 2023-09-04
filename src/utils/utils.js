import {format} from 'date-fns'

export const formatDate = (date) => {
  const fixedDate = Date.parse(date)
  return date ? format(new Date(fixedDate), 'MMMM d, yyyy') : 'NO_RELEASE_DATE'
}

export const getGenresNames = (genreIds, genres) => {
  const genreElements = genreIds.map((id) => {
    const genre = genres.find((g) => g.id === id)
    return genre ? (
      <li className="genre-list__item" key={genre.id}>
        {genre.name}
      </li>
    ) : null
  })
	
  return <ul className="genres-list">{genreElements}</ul>
}

