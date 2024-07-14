import React, { useState } from 'react';
import '../sunburst.css'; // Make sure this path is correct

const Join = () => {
    const [name, setName] = useState('');
    const [gameCode, setGameCode] = useState('');

    const handlePlay = () => {
        console.log('Play button clicked', { name, gameCode });
        // Add your logic for joining the game here
    };

    const handleCreatePrivateGame = () => {
        console.log('Create Private Game button clicked', { name });
        // Add your logic for creating a private game here
    };

    return (
        <main className="h-screen w-screen sunburst-background flex items-center justify-center">
            <div className="w-1/3 rounded bg-blue-600 opacity-95 p-8 shadow-xl">
                <h1 className="text-3xl text-white text-center mb-8">Join Game</h1>
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
                        Play
                    </button>
                    <button
                        onClick={handleCreatePrivateGame}
                        className="p-2 bg-orange-500 text-white rounded"
                    >
                        Create Private Game
                    </button>
                </div>
            </div>
        </main>
    );
};

export default Join;
