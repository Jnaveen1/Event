import React, { use, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import EventForm from '../EventForm';
import Event from '../Event';
import Header from '../Header';
import RegistrationModal from '../RegistrationModal';
import Cookies from 'js-cookie';

function Home() {
  const token = Cookies.get('jwtToken');
  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;
  const [isAllow, setAllow] = useState(false) ; 
  const [eventDetails , setEventData] = useState([]) ;
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEventId, setSelectedEvent] = useState(null); 
  const [selectedEventTitle, setSelectedEventTitle] = useState(null); 
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          setEventData(data)

        } else {
          console.error("Failed to fetch events: ", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching events: ", error);
      }
    };
  
    fetchEvents();
  }, []);
  

  const handleCreateEvent = () => {
    if (userRole === 'organizer') {
      setAllow(true)
    } else {
      alert('Access Denied: Only organizers can create events.');
    }
  };

  const approveEvent = async (eventId) =>{
      const detalis = {
        status : "approved"
      }
      const options = {
        method : "PUT", 
        headers : {"Content-Type" : "application/json"}, 
        body : JSON.stringify(detalis)
      }
      const result = await fetch(`http://localhost:3000/${eventId}`, options)
      if(result.ok){
        const data =await result.json()
        // console.log(data)
      }
  }

  const rejectEvent = async (eventId) =>{
    const options = {
      method : "DELETE", 
      headers : {"Content-Type" : "application/json"}, 
    }

    const result = await fetch(`http://localhost:3000/reject-event/${eventId}`, options);
    if(result.ok){
      const data = await result.json()
      // console.log(data)
      return
    }
  }

  const onRegister = async (id, data) => {
    try {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data) 
        };

        const response = await fetch(`http://localhost:3000/register-event/${id}`, options);
        console.log(response)
        const responseData = await response.json();
        if (response.ok) {
            alert("Registered Successfully.....")
            console.log("Registration successful", responseData);
        } else {
            alert(responseData.message);
        }
    } catch (error) {
        console.error("Error registering for event:", error);
        alert("An error occurred while registering. Please try again.");
    }
  };

  const handleRegisterButtonClick = (id, title) => {
    console.log(title)
    if (registeredEvents.includes(id)) {
      alert('You are already registered for this event.');
      return;
    }
    setSelectedEventTitle(title)
    console.log(id)
    setSelectedEvent(id); 
    setShowModal(true); 
  };

  return (
    <div>
      <Header />
      <h1>Welcome to the Home Page</h1>
      {userRole === 'admin' && (
        <div>
          <h2>Pending Events</h2>
              {eventDetails.filter(event => event.status === 'pending').length > 0 ? (
                <ul>
                  {eventDetails
                    .filter(event => event.status === 'pending')
                    .map(event => (
                      <Event event={event} 
                            key={event.id} 
                            eventId={event.id} 
                            rejectEvent = {rejectEvent} 
                            approveEvent = {approveEvent} 
                            registerEvent = {handleRegisterButtonClick} 
                        />
                    ))}
                </ul>
              ) : (
                <h3>No pending events</h3>
              )}
            </div>
          )}
          <br/>
          <h2>All Events</h2>
          {eventDetails.length > 0 ? (
            <ul>
              {eventDetails
                .filter(event => event.status === 'approved')
                .map(event => (
                  <Event event={event} 
                        key={event.id} 
                        eventId={event.id} 
                        rejectEvent = {rejectEvent} 
                        approveEvent = {approveEvent} 
                        registerEvent  ={handleRegisterButtonClick} 
                    />
                ))}
            </ul>
          ) : (
            <p>No events are found</p>
          )}
          {!isAllow ? (
            <button onClick={handleCreateEvent}>Create Event</button>
          ) : (
            <EventForm />
          )}
          {/* {userRole == 'oraganizer' && <button onClick={handleCreateEvent}>Create Event</button>}
          {isAllow && } */}
          {showModal && (
            <RegistrationModal 
              eventId={selectedEventId} 
              eventTitle= {selectedEventTitle}
              onClose={() => setShowModal(false)} 
              onRegister={onRegister}
            />
          )}
        </div>
  );
}

export default Home;

