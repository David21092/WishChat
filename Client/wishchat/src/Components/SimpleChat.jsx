import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../Styles/AllChats.css'
import profilePic from '../Images/TempProfilepic.jpeg'
export function SimpleChat() {
    const location = useLocation();
    const currentPath = location.pathname;
    const pathSegments = currentPath.split('/').filter(segment => segment !== "");
    const userName = pathSegments[0];

    let navigate = useNavigate();

    const [wantToChatWith, setWantToChatWith] = useState()
    const handleChattingWithChange = (event) => {
        setWantToChatWith(event.target.value);
    };

    function newChat() {
        navigate(`${wantToChatWith}`);

    }

    const [messagesArray, setMessagesArray] = useState([]);
    const database = getDatabase();

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

    const filteredChatsWith = messagesArray.filter(
        message => message.name === userName || message.recipient === userName
    );

    console.log(filteredChatsWith);
    const uniqueConversations = new Map();

    filteredChatsWith.forEach(message => {
        const isMyMessage = message.name === userName;
        const key = isMyMessage ? message.recipient : message.name;
        let content = message.message;

        if (content.length > 30) {
            content = content.substring(0, 30) + '...';
        }

        if (!uniqueConversations.has(key) || message.sentDate > uniqueConversations.get(key).sentDate) {
            uniqueConversations.set(key, { name: key, message: content, sentDate: message.sentDate });
        }
    });

    const latestMessages = Array.from(uniqueConversations.values());



    return (
        <div className='AllChatsContainer2'>
            <div className='AllChatsContainer'>
                <div>
                    <div className="YourName"></div>
                    <div className="uniqueChatBoxContainer noLinkStyling" >
                        <div className="ProfilePicAllChats">
                            <img className="ProfilePicSmall" src={profilePic} alt="" />
                        </div>
                        <div className="noLinkStyling" >
                            <div className="singleChatLinkContainer">
                                Your Username: {userName}
                            </div>
                        </div>
                    </div>

                    {latestMessages.map((message, index) => (
                        <Link className="uniqueChatBoxContainer noLinkStyling" to={`${message.name}`}>
                            <div className="ProfilePicAllChats">
                                <img className="ProfilePicSmall" src={profilePic} alt="" />
                            </div>
                            <div className="noLinkStyling" >
                                <div className="singleChatLinkContainer" key={index}>
                                    <strong>{message.name} </strong> <div className="newestMessage">{message.message}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    <hr />
                    <form className='addNewFriend'>
                        <div className="subtitle">Add a new Friend</div>
                        <input
                            className='AccountInput'
                            placeholder='Their Username...'
                            type="text"
                            id="name"
                            name="name"
                            value={wantToChatWith}
                            onChange={handleChattingWithChange}
                            required={true}
                        />
                    </form>
                    <div
                        className="buttonContainer"
                    >
                        <button
                            onClick={newChat}
                            className={`newChatButton ${!wantToChatWith ? 'disabledButton' : ''}`}
                            disabled={!wantToChatWith}
                        >
                            +
                        </button>
                    </div>


                </div>
            </div>
        </div>
    );
}
