import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from './InfoBar';
import Input from './Input';
import Messages from './Messages';
import TextContainer from './TextContainer'


import '../css/Chat.css'

let socket;



const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [users, setUsers] = useState([]);
    const ENDPOINT = 'localhost:5000'


    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        //create conneciton
        socket = io(ENDPOINT)
        console.log('SOCKET', socket)

        setName(name)
        setRoom(room)

        socket.emit('join', { name, room }, (error) => {
            if(error) {
                alert(error);
              }
        });

        return () => {
            socket.emit('disconnect');
            
            socket.off();
        }

    }, [ENDPOINT, location.search]);

    //handle messages and roomdata
    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        })

        socket.on('roomData', ({users}) => {
            console.log('userssss', users)
            setUsers(users)
        })
    }, [messages, users]);

    //function for sending messages

    const sendMessage = (ev) => {
        ev.preventDefault();
        if(message){
            socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    return(
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
            </div>
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat;