import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../sunburst.css'; // Make sure this path is correct

const Join = () => {
    const [name, setName] = useState('');
    const [gameCode, setGameCode] = useState('');
    const navigate = useNavigate();

    const handlePlay = () => {

        if (gameCode.length !== 6) {
            alert('Game code must be 6 characters long');
            return;
        }
        
        navigate(`/${gameCode}`);
    };

    const handleCreatePrivateGame = () => {
        console.log('Create Private Game button clicked', { name });
        // Add your logic for creating a private game here
    };

    return (
        <main className="h-screen w-screen sunburst-background flex items-center justify-center">
            <div className="w-1/3 rounded bg-blue-600 opacity-95 p-8 shadow-xl">
                <h1 className="text-3xl text-white text-center mb-8">DuoDraw</h1>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 rounded border border-gray-300"
                    />
                    <input
                        type="text"
                        placeholder="Enter game code"
                        value={gameCode}
                        onChange={(e) => setGameCode(e.target.value)}
                        className="p-2 rounded border border-gray-300"
                    />
                    <button
                        onClick={handlePlay}
                        className="p-2 bg-green-500 text-white rounded"
                    >
                        Join Game
                    </button>
                    <button
                        onClick={handleCreatePrivateGame}
                        className="p-2 bg-orange-500 text-white rounded"
                    >
                        Create Game
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Join;
