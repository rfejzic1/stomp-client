import React, { useState, useEffect } from 'react';
import './App.css';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';

// Endpoint for websockets
const SERVER_URL = 'http://stomp-test.herokuapp.com/ws';

// '/topic/news' is the endpoint for receiving messages (subscriptions)
// '/app/news' is the endpoint for sending messages

let stompClient;

const App = () => {
  const [response, setResponse] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Create new socket from endpoint
    const socket = new SockJS(SERVER_URL);

    // Create the stomp client instance from socket
    stompClient = Stomp.over(socket);

    // connect the stomp client
    // first arg is headers,
    // second arg is onConnected callback,
    // third arg is onError callback
    stompClient.connect({}, () => {
      stompClient.subscribe(`/topic/news`, msg => {
        setResponse(res => [msg.body, ...res]);
      });
    }, err => console.error(err));

    return () => stompClient.disconnect();
  }, []);

  const handleHi = e => {
    if((e.key && e.key !== 'Enter') || e.target.value === '') {
      return;
    }
    
    // Send message to the server:
    // first arg is the endpoint
    // second arg is the headers
    // third arg is the data to be sent; in this case a simple string
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
