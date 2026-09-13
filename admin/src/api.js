export const API_URL = 'http://localhost:4000'

export const imgUrl = (path) => {
  if (!path) return API_URL + '/images/RoomImage1.png'
  if (path.startsWith('http')) return path
  if (path.startsWith('/uploads') || path.startsWith('/images')) return API_URL + path
  return path
}
