import React, { useState, useEffect } from 'react';
import { getDatabase, ref, push, onValue, off } from 'firebase/database';
import { useLocation, Link } from 'react-router-dom';

export function SimpleChat() {
    const location = useLocation();
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment !== "");
    const userName = pathSegments[0];

    const [wantToChatWith, setWantToChatWith] = useState()
    const handleChattingWithChange = (event) => {
        setWantToChatWith(event.target.value);
    };
    const [formData, setFormData] = useState({
        name: `${userName}`,
        message: '',
    });

    const [messagesArray, setMessagesArray] = useState([]);
    const database = getDatabase();

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const messagesRef = ref(database, 'messages');
        push(messagesRef, formData);

        setFormData({
            name: `${userName}`,
            message: '',
        });
    };

    useEffect(() => {
        const messagesRef = ref(database, 'messages');
        onValue(messagesRef, (snapshot) => {
            if (snapshot.exists()) {
                const messages = [];
                snapshot.forEach((childSnapshot) => {
                    const message = childSnapshot.val();
                    messages.push(message);
                });
                setMessagesArray(messages);
            }
        });

        return () => {

            off(messagesRef);
        };
    }, [database]);

    return (
        <div>
            UserName: {userName}

            <form >
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={wantToChatWith}
                    onChange={handleChattingWithChange}
                    required={true}
                />
            </form>
            <Link to={`${wantToChatWith}`}>
                <button>I want to chat With this person</button>
            </Link>
            <form onSubmit={handleSubmit}>

                <label htmlFor="message">Message:</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required={true}
                />

                <input type="submit" value="Submit" />
            </form>
            <div>
                <h2>Messages:</h2>
                <ul>
                    {messagesArray.map((message, index) => (
                        <li key={index}>
                            <strong>{message.name}:</strong> {message.message}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
