import React, { useState } from 'react';

const Chat = () => {
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hello! Welcome to the game.', sender: 'system' },
        { id: 2, text: 'Thanks! Excited to play.', sender: 'user' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim()) {
            const newMessage = { id: messages.length + 1, text: input, sender: 'user' };
            setMessages([...messages, newMessage]);
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
                        <span className="font-bold">{message.sender === 'system' ? 'System: ' : 'You: '}</span>
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
