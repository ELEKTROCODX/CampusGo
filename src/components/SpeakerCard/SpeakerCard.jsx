import React from 'react';
import './SpeakerCard.css';

function SpeakerCard({ name, role, imgSrc, style }) {
  return (
    <div className="SpeakerCard" style={style}>
      <img src={imgSrc} alt={name} className="SpeakerCard__img" />
      <div className="SpeakerCard__info">
        <span className="SpeakerCard__name">{name}</span>
        <span className="SpeakerCard__role">{role}</span>
      </div>
    </div>
  );
}

export default SpeakerCard;