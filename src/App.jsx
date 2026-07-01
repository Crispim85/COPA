import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import BracketColumn from './components/BracketColumn';
import CenterStage from './components/CenterStage';
import { generateInitialMatches } from './data/bracketData';

function App() {
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('copaBracketState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved bracket", e);
      }
    }
    return generateInitialMatches();
  });
  
  const bracketRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('copaBracketState', JSON.stringify(matches));
  }, [matches]);

  const getNextMatch = (matchId) => {
    const parts = matchId.split('_');
    if (parts.length === 3) {
      const side = parts[0]; // L or R
      const round = parseInt(parts[1], 10);
      const num = parseInt(parts[2], 10);

      const nextRound = round / 2;
      const nextNum = Math.ceil(num / 2);
      const isTeam1 = num % 2 !== 0; // Odd numbered match populates team1 of next match

      return {
        nextMatchId: `${side}_${nextRound}_${nextNum}`,
        isTeam1
      };
    } else if (matchId === 'L_4_1') {
      return { nextMatchId: 'FINAL', isTeam1: true };
    } else if (matchId === 'R_4_1') {
      return { nextMatchId: 'FINAL', isTeam1: false };
    }
    return null;
  };

  const getThirdPlaceMatch = (matchId) => {
    if (matchId === 'L_4_1') return { matchId: 'THIRD', isTeam1: true };
    if (matchId === 'R_4_1') return { matchId: 'THIRD', isTeam1: false };
    return null;
  }

  const handleAdvance = (matchId, winningTeam) => {
    setMatches(prev => {
      // Deep clone to safely mutate
      const newMatches = JSON.parse(JSON.stringify(prev));
      const currentMatch = newMatches[matchId];
      
      // Don't do anything if same winner
      if (currentMatch.winner?.id === winningTeam.id) return prev;

      // Set winner
      currentMatch.winner = winningTeam;
      
      // Helper to clear invalid winners forward
      const clearInvalidWinners = (mId) => {
         const m = newMatches[mId];
         if (m.winner && m.winner.id !== m.team1?.id && m.winner.id !== m.team2?.id) {
             m.winner = null;
             // Propagate the null to the next match
             const nInfo = getNextMatch(mId);
             if (nInfo) {
                 const nextM = newMatches[nInfo.nextMatchId];
                 if (nInfo.isTeam1) nextM.team1 = null;
                 else nextM.team2 = null;
                 clearInvalidWinners(nInfo.nextMatchId);
             }
         }
      };

      // Advance to next match
      const nextInfo = getNextMatch(matchId);
      if (nextInfo) {
        const { nextMatchId, isTeam1 } = nextInfo;
        const nextMatch = newMatches[nextMatchId];
        
        if (isTeam1) {
          nextMatch.team1 = winningTeam;
        } else {
          nextMatch.team2 = winningTeam;
        }
        // Check and clear if this invalidates subsequent rounds
        clearInvalidWinners(nextMatchId);
      }

      // Handle third place for semi-final losers
      const losingTeam = currentMatch.team1?.id === winningTeam.id ? currentMatch.team2 : currentMatch.team1;
      const thirdInfo = getThirdPlaceMatch(matchId);
      if (thirdInfo) {
        const thirdMatch = newMatches[thirdInfo.matchId];
        if (thirdInfo.isTeam1) {
          thirdMatch.team1 = losingTeam || null;
        } else {
          thirdMatch.team2 = losingTeam || null;
        }
        if (thirdMatch.winner && thirdMatch.winner.id !== thirdMatch.team1?.id && thirdMatch.winner.id !== thirdMatch.team2?.id) {
          thirdMatch.winner = null;
        }
      }

      return newMatches;
    });
  };

  // Define columns
  const left32 = ['L_32_1', 'L_32_2', 'L_32_3', 'L_32_4', 'L_32_5', 'L_32_6', 'L_32_7', 'L_32_8'];
  const left16 = ['L_16_1', 'L_16_2', 'L_16_3', 'L_16_4'];
  const left8 = ['L_8_1', 'L_8_2'];
  const left4 = ['L_4_1'];

  const right32 = ['R_32_1', 'R_32_2', 'R_32_3', 'R_32_4', 'R_32_5', 'R_32_6', 'R_32_7', 'R_32_8'];
  const right16 = ['R_16_1', 'R_16_2', 'R_16_3', 'R_16_4'];
  const right8 = ['R_8_1', 'R_8_2'];
  const right4 = ['R_4_1'];

  const handleReset = () => {
    if (window.confirm("Tem certeza que deseja reiniciar todo o chaveamento?")) {
      setMatches(generateInitialMatches());
      localStorage.removeItem('copaBracketState');
    }
  };
  const handleShare = async () => {
    if (bracketRef.current) {
      try {
        const element = bracketRef.current;
        const canvas = await html2canvas(element, {
          backgroundColor: '#001489',
          scale: 2,
          useCORS: true,
          width: element.scrollWidth,
          windowWidth: element.scrollWidth,
        });
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "chaveamento-copa.png";
        link.click();
      } catch (error) {
        console.error("Erro ao gerar imagem", error);
        alert("Ocorreu um erro ao gerar a imagem.");
      }
    }
  };

  return (
    <div className="bracket-container" ref={bracketRef} style={{ padding: '2rem' }}>
      <div className="bracket-half left">
        <BracketColumn title="2ª FASE" matchIds={left32} matches={matches} onAdvance={handleAdvance} />
        <BracketColumn title="OITAVAS" matchIds={left16} matches={matches} onAdvance={handleAdvance} />
        <BracketColumn title="QUARTAS" matchIds={left8} matches={matches} onAdvance={handleAdvance} />
        <BracketColumn title="SEMI" matchIds={left4} matches={matches} onAdvance={handleAdvance} />
      </div>
      
      <CenterStage matches={matches} onAdvance={handleAdvance} onReset={handleReset} onShare={handleShare} />
      
      <div className="bracket-half right">
        <BracketColumn title="2ª FASE" matchIds={right32} matches={matches} onAdvance={handleAdvance} />
        <BracketColumn title="OITAVAS" matchIds={right16} matches={matches} onAdvance={handleAdvance} />
        <BracketColumn title="QUARTAS" matchIds={right8} matches={matches} onAdvance={handleAdvance} />
        <BracketColumn title="SEMI" matchIds={right4} matches={matches} onAdvance={handleAdvance} />
      </div>
    </div>
  );
}

export default App;
