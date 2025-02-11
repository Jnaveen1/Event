import './index.css'

const Event = (props) =>{
    const {event, key, eventId, rejectEvent, approveEvent, registerEvent } = props 
    const {title, location, event_date} = event

    const onclickEventApprove = () =>{
        approveEvent(eventId)
    }

    const onclickEventRegister = () =>{
        registerEvent(eventId, title) 
    }

    return(
        <div>
            <li key={event.id}  >
              <strong>Event Name : {title}</strong><br/>Location : {location} on {event_date}
              {event.status === 'pending' ? <button onClick={onclickEventApprove} type = "button">Approve</button> : <button  onClick={onclickEventRegister} type = "button">Register</button>}
            </li>
        </div>
    )
}

export default Event ;