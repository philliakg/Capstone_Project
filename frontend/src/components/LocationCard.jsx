const LocationCard = ({ name, image, distance, tone }) => {
  return (
    <div className={'location-card ' + (tone || '')}>
      <div className="location-card-photo">
        <img src={image} alt="" />
      </div>
      <div className="location-card-text">
        <h3>{name}</h3>
        {distance && <p>{distance}</p>}
      </div>
    </div>
  )
}

export default LocationCard