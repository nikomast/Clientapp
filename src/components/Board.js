import React, { useState, useEffect } from 'react';
import './Board.css';

function PongBoard() {
    const [gameState, setGameState] = useState(null);
    const [playerName, setPlayerName] = useState("");
    const [isGameEnded, setIsGameEnded] = useState(false);
    const [highScores, setHighScores] = useState([]);


    async function fetchGameState() {
        const response = await fetch('https://localhost:7295/api/game/state');
        const data = await response.json();
        if (data && !data.state.value) {
           setIsGameEnded(true); // Set game ended status here
           fetchHighScores();
        } else {
            setIsGameEnded(false); 
        }
        setGameState(data);
    }

    async function updateBallAndFetchState() {
        await fetch('https://localhost:7295/api/game/updateBall', { method: 'POST' });
        fetchGameState();
    }

    useEffect(() => {
        if (!isGameEnded) {
            const interval = setInterval(updateBallAndFetchState, 50);
            return () => clearInterval(interval);  // Clean up on unmount
        }
    }, [isGameEnded]);

    const handleKeyDown = async (event) => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            const direction = { Up: event.key === 'ArrowUp', Down: event.key === 'ArrowDown' };
            await fetch('https://localhost:7295/api/game/movePlayer1', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(direction)
            });
            fetchGameState();
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);  // Clean up on unmount
    }, []);

    const handleRestart = async () => {
        try {
            const response = await fetch('https://localhost:7295/api/game/reset', {
                method: 'POST'
            });
    
            const data = await response.text();
    
            if (data === "Game reset.") {
                // Here, reset the game state or refetch the initial game state
                setIsGameEnded(false);
                fetchGameState();
            }
        } catch (error) {
            console.error("Error restarting game:", error);
        }
    };

    async function fetchHighScores() {
        try {
            const response = await fetch('https://localhost:7295/api/highscores/top/5');
            if (response.ok) {
                const scores = await response.json();
                setHighScores(scores);
                console.log(highScores[0]);
            } else {
                console.error('Failed to fetch high scores:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching high scores:', error);
        }
    }
    

    if (!gameState) return "Loading...";

    return (
        <div className='pong-container'>
             <p className="player-score">Score: {gameState.player1.score}</p>
        <div className="pong-board">
            <div className="pong-paddle left-paddle" style={{top: gameState.player1.yPosition + "px"}}></div>
            <div className="pong-paddle right-paddle" style={{top: gameState.player2.yPosition + "px"}}></div>
            <div className="pong-ball" style={{left: gameState.ball.xPosition + "px", top: gameState.ball.yPosition + "px"}}></div>
        </div>
        <button onClick={handleRestart} className="restart-button">Restart</button>
        {gameState && !gameState.state.value ? (
        <div className="player-input">
    <input 
        type="text" 
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
    />
    <button onClick={() => console.log("Player's name:", playerName, "Players Score: ", gameState.player1.score)}>Submit</button>
    <div className="high-scores">
        <h2>High Scores</h2>
            <pre>{JSON.stringify(highScores, null, 2)}</pre>
        </div>

    </div>
        ) : null}
        </div>
    );
}

export default PongBoard;
