import React from 'react';
import TeamFlag from './TeamFlag';

const MatchBox = ({ matchId, matchData, onAdvance }) => {
  const { team1, team2, winner } = matchData;

  return (
    <div className="match-wrapper">
      <div className="match-box">
        <TeamFlag 
          team={team1} 
          isWinner={winner && winner.id === team1?.id} 
          onClick={() => team1 && onAdvance(matchId, team1)} 
        />
        <TeamFlag 
          team={team2} 
          isWinner={winner && winner.id === team2?.id} 
          onClick={() => team2 && onAdvance(matchId, team2)} 
        />
      </div>
    </div>
  );
};

export default MatchBox;
