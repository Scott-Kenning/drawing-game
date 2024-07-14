import React, { useState, useEffect } from 'react';
import Chat from '../components/Chat';
import PlayerList from '../components/PlayerList';
import Canvas from '../components/Canvas';
import { GameState } from '../GameManager';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const Game = () => {
    const [players, setPlayers] = useState([]);
    const [gameState, setGameState] = useState(GameState.WAITING);
    const [currentPrompt, setCurrentPrompt] = useState('');
    const [turnStartTime, setTurnStartTime] = useState(new Date());
    const [messages, setMessages] = useState([]);

    // Handle a guess
    const makeGuess = (playerId, guess) => {
        if (gameState === GameState.ACTIVE && guess.toLowerCase() === currentPrompt) {
            const timeTaken = new Date() - turnStartTime;
            const score = 100 * (60000 - timeTaken) / 60000;
            setPlayers(prevPlayers => prevPlayers.map(player =>
                player.id === playerId ? { ...player, score: player.score + Math.max(0, score) } : player
            ));
        }
    };

    // WebSocket listeners
    useEffect(() => {
        socket.on('newPlayer', (players) => {
            setPlayers(players);
        });

        socket.on('newPrompt', (prompt) => {
            console.log("new prompt: ", prompt);
            setCurrentPrompt(prompt);
            setTurnStartTime(new Date());
            setGameState(GameState.ACTIVE);
        });

        socket.on('gameFinished', () => {
            setGameState(GameState.FINISHED);
            console.log('Game Finished');
        });

        socket.on('userDisconnect', (playerId) => {
            setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== playerId));
        });

        socket.on('guess', (data) => {
            console.log("Guess received: ", data, "Current Prompt: ", currentPrompt);
            makeGuess(data.id, data.text);
        });

        // socket.on('chatMessage', (message) => {
        //     console.log("Chat message received: ", message);
        //     setMessages(prev => [...prev, message]);
        // });

        return () => {
            socket.off('newPlayer');
            socket.off('newPrompt');
            socket.off('gameFinished');
            socket.off('userDisconnect');
            socket.off('guess');
            // socket.off('chatMessage');
        };
    }, []);

    return (
        <main className="h-[100vh] w-screen p-[5vh] sunburst-background">
            <div className="grid grid-cols-4 w-full h-full">
                <div className="w-full h-[90vh] p-4 pl-12">
                    <div className="rounded-lg bg-white shadow w-full h-full border border-4 border-gray-800">
                        <PlayerList players={players} />
                    </div>
                </div>
                <div className="w-full h-full col-span-2 p-4">
                    <div className="rounded-lg shadow w-full h-full border border-4 border-gray-800">
                        
                    <div className="h-full w-full bg-white">
                        <Canvas socket={socket} players={players} currentPrompt={currentPrompt} />
                        </div>
                    </div>
                </div>
                <div className="w-full h-[90vh] p-4 pr-12">
                    <div className="rounded-lg bg-white shadow w-full h-full border border-4 border-gray-800">
                        <Chat socket={socket} messages={messages} />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Game;
