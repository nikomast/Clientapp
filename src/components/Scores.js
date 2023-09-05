import React, { useState, useEffect } from 'react';

function Scores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    fetch('/api/highscores/record')
      .then(response => response.json())
      .then(data => setScores(data))
      .catch(error => console.error('Error fetching scores:', error));
  }, []);

  return (
    <div>
      <h2>Top 10 Scores</h2>
      <ul>
        {scores.map(score => (
          <li key={score.ID}>{score.PlayerName}: {score.Score}</li>
        ))}
      </ul>
    </div>
  );
}

export default Scores;
