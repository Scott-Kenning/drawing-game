import React from 'react';
import Chat from '../components/Chat';
import PlayerList from '../components/PlayerList';
import '../sunburst.css'; // Make sure this path is correct
import Canvas from '../components/Canvas';

const Game = () => {
    return (
        <main className="h-[100vh] w-screen p-[5vh] sunburst-background">
            <div className="grid grid-cols-4 w-full h-full">
                {/* Player List */}
                <div className="w-full h-[90vh] p-4 pl-12">

                    <div className="rounded-lg bg-white shadow w-full h-full border border-4 border-gray-800">
                        <PlayerList />
                    </div>
                </div>
                {/* Drawing board side */}
                <div className="w-full h-full col-span-2 p-4">
                    <div className="rounded-lg shadow w-full h-full border border-4 border-gray-800">
                        {/* Drawing board */}
                        <div className="h-full w-full bg-white">
                            <Canvas />
                        </div>
                    </div>
                </div>
                <div className="w-full h-[90vh] p-4 pr-12">
                    {/* Chat */}
                    <div className="rounded-lg bg-white shadow w-full h-full border border-4 border-gray-800">
                        <Chat />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Game;
