import React, { useState } from 'react';

const EventForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    eventLocation: '',
    eventDescription: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { eventName, eventDate, eventLocation, eventDescription } = formData;

    if (!eventName || !eventDate || !eventLocation || !eventDescription) {
      setError('All fields are required!');
      return;
    }

    const eventDetails = {
        title: eventName, 
        description: eventDescription,
        location: eventLocation, 
        event_date: eventDate
    };

    console.log(eventDetails);

    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventDetails),
    };

    try {
        const response = await fetch('http://localhost:3000/create-event', options);
        console.log(response)
        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.error || 'Event creation failed');
            return;
        }

        const successData = await response.json();
        setSuccess(successData.message || 'Event created successfully!');
        
        // Reset form fields after successful submission
        setFormData({
            eventName: '',
            eventDate: '',
            eventLocation: '',
            eventDescription: '',
        });



    } catch (err) {
        setError('Something went wrong, please try again later.');
        console.error('Error during event creation:', err);
    }
};

  return (
    <div>
      <h2>Create Event</h2>
      {error && <p style={{ color: 'red' }} >{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name:</label>
          <input
            type="text"
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Event Date:</label>
          <input
            type="date"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Event Location:</label>
          <input
            type="text"
            name="eventLocation"
            value={formData.eventLocation}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Event Description:</label>
          <textarea
            name="eventDescription"
            value={formData.eventDescription}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default EventForm;
