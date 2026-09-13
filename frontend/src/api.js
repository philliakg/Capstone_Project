export const API_URL = 'http://localhost:4000'

export const imgUrl = (path) => {
  if (!path) return '/images/RoomImage1.png'
  if (path.startsWith('http')) return path
  if (path.startsWith('/uploads')) return API_URL + path
  return path
}
