import React from 'react'

import '../css/Input.css'

function Input({ message, setMessage, sendMessage }) {
    return (
        <form className="form">
            <input 
            className="input"
            type="text"
            placeholder="Type a message..."
            value={message} onChange={(ev) => setMessage(ev.target.value)} onKeyPress={ev => ev.key === 'Enter' ? sendMessage(ev) : null}/>
            <button className="sendButton" onClick={(ev) => sendMessage(ev)}>Send</button>
        </form>
    )
}

export default Input
