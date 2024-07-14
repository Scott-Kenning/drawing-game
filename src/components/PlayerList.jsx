import React from 'react';

const PlayerList = () => {
    const players = [
        { id: 1, name: 'Player 1', score: 300 },
        { id: 2, name: 'Player 2', score: 50 },
        { id: 3, name: 'Player 3', score: 120 },
        { id: 4, name: 'Player 4', score: 0 },
    ];

    return (
        <div className="flex flex-col h-full rounded-lg shadow border border-gray-300">
            <h2 className="text-2xl text-center p-4 border-b-2 border-gray-500">Players</h2>
            <ul className="flex-1 overflow-y-auto">
                {players.sort((a, b) => b.score - a.score).map(player => (
                    <li key={player.id} className="border-b-2 border-gray-500 flex justify-between p-2">
                        <span className='font-bold'>{player.name}</span>
                        <span>{player.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
