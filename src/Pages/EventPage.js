import React, { useEffect, useState } from "react";
import EventCard from "../Components/EventCard";
import ErrorBlock from "../Components/ErrorBlock";
import "../Styles/EventPage.css";
import { useNavigate } from "react-router-dom";

function EventPage() {
  const [eventsList, setEventsList] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEventIds, setSelectedEventIds] = useState(new Set());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("Token is not available");
          setError("You must be logged in to view events.");
          return;
        }

        const response = await fetch('http://localhost:8080/api/events/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error('Failed to fetch events');
        }

        const data = await response.json();
        setEventsList(data);

        const registeredResponse = await fetch(`http://localhost:8080/api/events/registered?username=${localStorage.getItem('username')}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!registeredResponse.ok) {
          const errorMessage = await registeredResponse.text();
          throw new Error(`Failed to fetch registered events: ${errorMessage}`);
        }
        const registeredData = await registeredResponse.json();
        setRegisteredEvents(registeredData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSelect = async (event) => {
    if (registeredEvents.length >= 3) {
      setError("You can only register a maximum of 3 events.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      const response = await fetch('http://localhost:8080/api/events/register?username=yourUsername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, event })
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to register event: ${errorMessage}`);
      }

      setRegisteredEvents([...registeredEvents, event]);
      setSelectedEventIds(prev => new Set(prev).add(event.id));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const isOverlapping = (event1, event2) => {
    return (
      (event1.startTime < event2.endTime && event1.endTime > event2.startTime)
    );
  };

  const handleDeselect = async (event) => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      const response = await fetch('http://localhost:8080/api/events/unregister?username=yourUsername', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, event })
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to unregister event: ${errorMessage}`);
      }

      setRegisteredEvents(registeredEvents.filter(regEvent => regEvent.id !== event.id));
      setSelectedEventIds(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(event.id);
        return newSelected;
      });
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    fetch("http://localhost:8080/api/users/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        localStorage.removeItem("token");
        window.location.href = "/";
      })
      .catch(error => {
        console.error("There was a problem with your fetch operation:", error);
      });
  };

  if (loading) {
    return <p>Loading events...</p>;
  }

  const isEventDisabled = (event) => {
    return registeredEvents.some(registeredEvent => isOverlapping(registeredEvent, event));
  };

  return (
    <div>
      <div>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="event-page">
        <div className="events-list">
          <h2>All Events</h2>
          <ErrorBlock message={error} />
          <div className="cards-container">
            {eventsList
              .filter(event => !registeredEvents.some(registeredEvent => registeredEvent.id === event.id))
              .map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onSelect={() => handleSelect(event)}
                  isDisabled={isEventDisabled(event)}
                />
              ))}
          </div>
        </div>
        <div className="registered-events">
          <h2>Registered Events</h2>
          <div className="cards-container">
            {registeredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isRegistered={true}
                onDeselect={() => handleDeselect(event)}
                isDisabled={false} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventPage;