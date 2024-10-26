import React, { useState } from "react";
import '../Styles/EventCard.css';

function EventCard({ event, isRegistered, isDisabled, onSelect, onDeselect }) {
  const firstCharacter = event.eventName.charAt(0);

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleString([], options);
  };

  return (
    <div className={`event-card ${isDisabled ? 'disabled' : ''}`}>
      <div className="character-container">
        <h1>{firstCharacter}</h1>
      </div>
      <div className="divider"></div>
      <div className="details-container">
        <h3>{event.eventName}</h3>
        <p>({event.eventCategory})</p>
        <p>{formatTime(event.startTime)} - {formatTime(event.endTime)}</p>
        {isRegistered ? <button className="btn remove-btn" onClick={onDeselect}>REMOVE</button> :
          <button
            className="btn select-btn"
            onClick={onSelect}
            disabled={isDisabled}>SELECT</button>
        }
      </div>
    </div>
  );
}

export default EventCard;