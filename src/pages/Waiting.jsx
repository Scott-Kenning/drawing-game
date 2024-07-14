import React, { useState } from 'react';

const Waiting = ({ gameManager, onGameStart }) => {
    const [name, setName] = useState('');
    const [playerAdded, setPlayerAdded] = useState(false);
    const gameCode = '1234-ABCD'; // Hard-coded game code for now

    const handleAddPlayer = () => {
        if (name.trim()) {
            const playerId = Date.now(); // Example player ID, you might want to use a different logic
            gameManager.addPlayer(playerId, name);
            setPlayerAdded(true);
            console.log(`Player added: ${name}`);
        }
    };

    const handleStartGame = () => {
        console.log('Start Game button clicked');
        gameManager.startGame();
        onGameStart();
    };

    return (
        <div className="h-full w-full bg-white opacity-90 text-black flex flex-col items-center justify-center gap-4">
            <h1 className="text-3xl text-center">Waiting Room</h1>
            {!playerAdded ? (
                <div className="flex flex-col items-center gap-4">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="p-2 rounded border border-gray-300"
                    />
                    <button
                        onClick={handleAddPlayer}
                        className="p-2 bg-blue-500 rounded text-white"
                    >
                        Add Player
                    </button>
                </div>
            ) : (
                <>
                    <div className="text-black text-lg">
                        Game Code: <span className="font-bold">{gameCode}</span>
                    </div>
                    <button
                        onClick={handleStartGame}
                        className="p-2 bg-green-500 rounded text-white"
                    >
                        Start Game
                    </button>
                </>
            )}
        </div>
    );
};

export default Waiting;
