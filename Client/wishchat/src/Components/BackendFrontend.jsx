import React, { useEffect, useState } from 'react';

function MessageDisplay() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/messages') 
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      <h1>Messages</h1>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            <p>
              <strong>Name: {message.name}</strong>
            </p>
            <p>Recipient: {message.recipient}</p>
            <p>Message: {message.message}</p>
            <p>Sent Date: {message.sentDate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageDisplay;
