import React from 'react';
import MatchBox from './MatchBox';

const BracketColumn = ({ title, matchIds, matches, onAdvance }) => {
  return (
    <div className="bracket-column">
      <div className="matches-container">
        {matchIds.map((id, index) => (
          <MatchBox 
            key={id} 
            matchId={id} 
            matchData={matches[id]} 
            onAdvance={onAdvance} 
            title={index === 0 ? title : null}
          />
        ))}
      </div>
    </div>
  );
};

export default BracketColumn;
