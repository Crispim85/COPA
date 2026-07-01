import React from 'react';
import MatchBox from './MatchBox';

const BracketColumn = ({ title, matchIds, matches, onAdvance }) => {
  return (
    <div className="bracket-column">
      {title && <h2>{title}</h2>}
      {matchIds.map(id => (
        <MatchBox 
          key={id} 
          matchId={id} 
          matchData={matches[id]} 
          onAdvance={onAdvance} 
        />
      ))}
    </div>
  );
};

export default BracketColumn;
