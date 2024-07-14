import React from 'react';

const PlayerList = (props) => {
    const players = props.players.filter((player, index, self) => 
        index === self.findIndex(p => p.name === player.name)
    );
    
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
