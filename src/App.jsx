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
        
        // Force the layout to stack vertically specifically for the export
        element.classList.add('export-916');
        
        // Wait briefly for the browser to recalculate layout
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(element, {
          backgroundColor: null,
          scale: 2,
          useCORS: true,
        });
        
        // Remove the vertical layout class to restore normal UI
        element.classList.remove('export-916');
        
        let targetWidth = canvas.width;
        let targetHeight = canvas.height;
        const currentRatio = targetWidth / targetHeight;
        const desiredRatio = 9 / 16;

        if (currentRatio > desiredRatio) {
          // É mais largo que 9:16, então aumentamos a altura
          targetHeight = targetWidth / desiredRatio;
        } else {
          // É mais alto que 9:16, então aumentamos a largura
          targetWidth = targetHeight * desiredRatio;
        }

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = targetWidth;
        finalCanvas.height = targetHeight;
        const ctx = finalCanvas.getContext('2d');
        
        // Cria o mesmo degradê radial do site para o fundo do canvas final
        const gradient = ctx.createRadialGradient(
          targetWidth / 2, targetHeight / 2, 0,
          targetWidth / 2, targetHeight / 2, Math.max(targetWidth, targetHeight)
        );
        gradient.addColorStop(0, '#002395'); // var(--bg-light)
        gradient.addColorStop(1, '#000836'); // var(--bg-dark)
        
        // Preenche o fundo
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        
        // Desenha o canvas original centralizado
        const xOffset = (targetWidth - canvas.width) / 2;
        const yOffset = (targetHeight - canvas.height) / 2;
        ctx.drawImage(canvas, xOffset, yOffset);

        const image = finalCanvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = "chaveamento-copa.png";
        link.click();
      } catch (error) {
        console.error("Erro ao gerar imagem", error);
        alert("Ocorreu um erro ao gerar a imagem.");
        if (bracketRef.current) {
          bracketRef.current.classList.remove('export-916');
        }
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
