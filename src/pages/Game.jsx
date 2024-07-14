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
    const [messages, setMessages] = useState([]);
    const [user] = useState({ id: Date.now(), name: 'User' + Math.floor(Math.random() * 1000000) });
    const [artists, setArtists] = useState([]);
    const [currentPrompt, setCurrentPrompt] = useState();

    useEffect(() => {
        socket.emit('newPlayer', user);

        socket.on('newPlayerStored', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        socket.on('setArtists', (players) => {
            console.log("Setting artists: ", players);
            setArtists(players);
        });

        socket.on('newPrompt', (prompt) => {
            setCurrentPrompt(prompt);
            setGameState(GameState.ACTIVE);
        });

        socket.on('gameFinished', () => {
            setGameState(GameState.FINISHED);
        });

        socket.on('updatePlayers', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        socket.on('guess', (data) => {
            if (data.correct) {
                console.log("Correct guess: ", data);
            } else {
                console.log("Incorrect guess: ", data);
            }
        });

        return () => {
            socket.off('newPlayer');
            socket.off('newPrompt');
            socket.off('gameFinished');
            socket.off('updatePlayers');
            socket.off('guess');
        };
    }, []);

    return (
        <main className="h-[100vh] w-screen p-[5vh] sunburst-background">
            <div className="grid grid-cols-4 w-full h-full">
                <div className="w-full max-h-[90vh] p-4 pl-12 flex flex-col gap-[2vh]">
                    <p className='min-h-[5vh] bg-white rounded border-4 border-black font-semibold'>Turn 1/5</p>
                    <div className="rounded-lg bg-white shadow w-full h-full border border-4 border-gray-800">
                        <PlayerList players={players} />
                    </div>
                </div>
                <div className="w-full h-[90vh] col-span-2 p-4">
                    <div className="rounded-lg shadow w-full h-full border border-4 border-gray-800">
                        
                    <div className="w-full h-full bg-white relative">
                        {/* {(artists[0].id == user.id || artists[1].id == useDebugValue.id) && */}
                        <p className='absolute top-2 right-4'>Prompt: {currentPrompt}</p>
                        <Canvas socket={socket} players={players} />
                        </div>
                    </div>
                </div>
                <div className="w-full h-[90vh] p-4 pr-12">
                    <div className="rounded-lg bg-white shadow w-full h-full border border-4 border-gray-800">
                        <Chat socket={socket} messages={messages} user={user}/>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Game;
