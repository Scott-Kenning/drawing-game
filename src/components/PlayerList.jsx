import React from 'react';

const PlayerList = (props) => {
    const players = props.players.filter((player, index, self) => 
        index === self.findIndex(p => p.name === player.name)
    );
    
    return (
        <div className="flex flex-col h-full p-4 bg-gray-200 rounded-lg shadow border border-gray-300">
            <h2 className="text-2xl mb-4 text-center">Players</h2>
            <ul className="flex-1 overflow-y-auto">
                {players.sort((a, b) => b.score - a.score).map(player => (
                    <li key={player.id} className="mb-2 flex justify-between p-2 rounded shadow bg-white">
                        <span>{player.name}</span>
                        <span>{player.score}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlayerList;
