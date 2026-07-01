import React from 'react';

const TeamFlag = ({ team, isWinner, onClick }) => {
  if (!team) {
    return (
      <div className={`team-slot empty`} onClick={onClick}>
        <div className="team-code"></div>
        <div className="team-flag placeholder" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
        <div className="team-name"></div>
      </div>
    );
  }

  return (
    <div className={`team-slot ${isWinner ? 'winner' : ''}`} onClick={onClick}>
      <div className="team-code">{team.code}</div>
      <img 
        src={`https://flagcdn.com/w40/${team.country}.png`} 
        alt={team.name} 
        className="team-flag" 
        crossOrigin="anonymous"
      />
      <div className="team-name">{team.name}</div>
    </div>
  );
};

export default TeamFlag;
