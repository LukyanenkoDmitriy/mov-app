import { useState } from 'react'
import { Card, message, Rate, Typography } from 'antd'
import axios from 'axios'

import { formatDate, getGenresNames } from '../../utils/utils'
import './ItemFilm.css'

export default function ItemFilm({ film, genres, guestSessionToken }) {
  const { Text } = Typography

  const date = formatDate(film.release_date)
  const genresList = getGenresNames(film.genre_ids, genres)

  const [localRating, setLocalRating] = useState(film.rating || 0)

  const handleRate = async (rating) => {
    try {
      await axios.post(
        `https://api.themoviedb.org/3/movie/${film.id}/rating?api_key=10698e56c6a47821c5503f7c223f54b5&guest_session_id=${guestSessionToken}`,
        { value: rating }
      )
      setLocalRating(rating)
    } catch (err) {
      console.error('Error setting rating:', err)
      message.error('Ошибка при установке рейтинга')
    }
  }

  const splicedOverview = (text, lengthValue) => {
    let shortenText
    if (text.length > lengthValue) {
      shortenText = text.slice(0, lengthValue).split(' ')
    }
    return shortenText ? `${shortenText.join(' ')}...` : text
  }

  const calculateRatingColor = (rating) => {
    if (rating >= 7) {
      return '#66E900'
    } else if (rating >= 5) {
      return '#E9D100'
    } else if (rating >= 3) {
      return '#E97E00'
    } else {
      return '#E90000'
    }
  }

  const ratingColor = calculateRatingColor(localRating)

  return (
    <Card className="film-card">
      {}
      <div
        className="rating-circle"
        style={{
          backgroundColor: ratingColor,
          color: '#fff',
          textAlign: 'center',
          padding: '8px 12px',
          borderRadius: '50%',
          position: 'absolute',
          top: '10px',
          right: '10px',
        }}
      >
        {localRating.toFixed(1)}
      </div>
      <div className="img-wrapper">
        {film.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w200${film.poster_path}`}
            alt={film.title}
            className="film-card__image"
          />
        ) : (
          <div alt={film.title} className="no-image">
            <span>Sorry, no image</span>
          </div>
        )}
      </div>
      <div className="info-wrapper">
        <h2 className="film-card__title">{film.title}</h2>
        <Text className="film-card__release-date">{date}</Text>
        <Text className="film-card__genres">{genresList}</Text>
        <Text className="film-card__description movie-description">{splicedOverview(film.overview, 250)}</Text>
        <div className="rate-wrapper">
          <Rate allowHalf count={10} value={localRating} onChange={handleRate} />
        </div>
      </div>
    </Card>
  )
}
