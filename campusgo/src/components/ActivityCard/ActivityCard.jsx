import React from 'react';
import './ActivityCard.css';
import LocationIcon from '../../assets/icons/location.png';

// El 'index' (1, 2, 3, 4) se usa para el color del tag
function ActivityCard({ station, index }) {
  const isDone = station.status === 'Visitado';

  return (
    <div className={`card ActivityCard ${isDone ? 'ActivityCard--done' : ''}`}>
      <div className="ActivityCard__header">
        <h3 className="ActivityCard__title">{station.name}</h3>
        <div className={`LocationTag LocationTag--${index + 1}`}>
          <img src={LocationIcon} alt="Ubicación" className="LocationTag__icon" />
          <span>{station.location}</span>
        </div>
      </div>
      <div className="ActivityCard__checkbox">
        {isDone ? '✔' : ' '}
      </div>
    </div>
  );
}

export default ActivityCard;