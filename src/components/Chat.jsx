import React, { useState, useEffect } from 'react';

const Chat = (props) => {
    const socket = props.socket;

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const [user] = useState({ id: Date.now(), name: 'User' + Math.floor(Math.random() * 1000000), text: '' });

    // socket handling of chat messages
    useEffect(() => {
        // get chat history
        socket.on('currentChat', (chatMessages) => {
          setMessages(chatMessages);
        });
    
        socket.on('chatMessage', (message) => {
          setMessages((prevMessages) => [...prevMessages, message]);
        });
    
        return () => {
          socket.off('currentChat');
          socket.off('chatMessage');
        };
      }, []);

    const handleSend = () => {
        if (input.trim()) {
            const newMessage = { id: messages.length + 1, text: input, sender: user.name };
            // setMessages([...messages, newMessage]);
            socket.emit('chatMessage', newMessage);
            console.log(newMessage);
            setInput('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map(message => (
                    <div key={message.id} className={`mb-2 ${message.sender === 'system' ? 'text-blue-700' : 'text-black'}`}>
                        <span className="font-bold">{message.sender === user.name ? 'You: ' : message.sender + ': '}</span>
                        {message.text}
                    </div>
                ))}
            </div>
            <div className="flex p-2 border-t border-gray-300">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 p-2 border border-gray-400 rounded-l-lg"
                    placeholder="Type your message..."
                />
                <button
                    onClick={handleSend}
                    className="p-2 bg-blue-500 text-white rounded-r-lg"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
