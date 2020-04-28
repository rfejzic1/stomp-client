# Stomp Client

## Dependencies

Install ``sockjs-client`` and ``stompjs`` packages with npm. Find more about the stompjs client [here](https://stomp-js.github.io/stomp-websocket/codo/class/Client.html).

## Example

Create a new socket and an instance of the stomp client:

```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);
```

Use the connect method to connect the client. The onConnect callback function is called if the connection has been successfully established. Pass an empty object ``{}`` if no headers are required.

```javascript
stompClient.connect(headers, onConnect, onError);
```

Once connected (in the onConnect callback) subscribe to the desired topics:

```javascript
stompClient.subscribe(`/topic/news`, onSubscribe);
```

Use the send method to send a message to the server. Pass an empty object ``{}`` if no headers are required.

```javascript
stompClient.send('/app/news', headers, 'This is a message');
```
