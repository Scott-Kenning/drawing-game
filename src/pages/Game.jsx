import React, { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import PlayerList from '../components/PlayerList';
import '../sunburst.css'; // Make sure this path is correct
import Canvas from '../components/Canvas';
import { GameManager, GameState } from '../GameManager';
import Waiting from './Waiting';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const Game = () => {
    const [gameManager] = useState(new GameManager(10));
    const [players, setPlayers] = useState(gameManager.players);
    const [gameState, setGameState] = useState(gameManager.gameState);

    useEffect(() => {
        const updatePlayers = () => {
            setPlayers([...gameManager.players]);
        };

        const originalAddPlayer = gameManager.addPlayer.bind(gameManager);
        const originalStartGame = gameManager.startGame.bind(gameManager);

        gameManager.addPlayer = (id, name) => {
            originalAddPlayer(id, name);
            updatePlayers();
        };

        gameManager.startGame = () => {
            originalStartGame();
            setGameState(gameManager.gameState);
        };

        // Cleanup
        return () => {
            gameManager.addPlayer = originalAddPlayer;
            gameManager.startGame = originalStartGame;
        };
    }, [gameManager]);

    const handleGameStart = () => {
        setGameState(GameState.ACTIVE);
    };

    console.log(gameManager);

    return (
        <main className="h-[100vh] w-screen p-[5vh] sunburst-background">
            <div className="grid grid-cols-4 w-full h-full">
                {/* Player List */}
                <div className="w-full h-[90vh] p-4 pl-12">
                    <div className="rounded-lg bg-white shadow w-full h-full border border-4 border-gray-800">
                        <PlayerList players={players} />
                    </div>
                </div>
                {/* Drawing board side */}
                <div className="w-full h-full col-span-2 p-4">
                    <div className="rounded-lg shadow w-full h-full border border-4 border-gray-800">
                        {/* Drawing board */}
                        {gameState === GameState.WAITING ? (
                            <Waiting gameManager={gameManager} onGameStart={handleGameStart} />
                        ) : (
                            <div className="h-full w-full bg-white">
                                <Canvas socket={socket}/>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-full h-[90vh] p-4 pr-12">
                    {/* Chat */}
                    <div className="rounded-lg bg-white shadow w-full h-full border border-4 border-gray-800">
                        <Chat socket={socket}/>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Game;
