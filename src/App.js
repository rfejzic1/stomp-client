import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

const SERVER_URL = 'http://localhost:8080/ws';
let socket;
let stompClient;

const App = () => {
  const [response, setResponse] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const onConnect = () => {
      stompClient.subscribe(`/topic/news`, msg => {
        setResponse([msg.body, ...response]);
      });
    }

    socket = new SockJS(SERVER_URL);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnect, err => console.error(err));

    return () => stompClient.disconnect();
  }, [response]);

  const handleHi = e => {
    if((e.key && e.key !== 'Enter') || e.target.value === '') {
      return;
    }
    stompClient.send('/app/news', {}, message);
    setMessage('');
  }

  const handleInput = e => setMessage(e.target.value);

  return (
    <div className="App">
      <h1>Lols</h1>
      <input type="text" name="message" value={message} onChange={handleInput} onKeyDown={handleHi} />
      <input type="button" value="Send" onClick={handleHi} />
      <ul>
        {response.map(line => {
          const data = JSON.parse(line);
          return <li key={data.id}>{data.message}</li>
        })}
      </ul>
    </div>
  );
}

export default App;
