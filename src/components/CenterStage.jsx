import React from 'react';
import MatchBox from './MatchBox';
import tacaImage from '../assets/taca.png';

const CenterStage = ({ matches, onAdvance, onReset, onShare }) => {
  return (
    <div className="center-stage">
      <h1>Caminho <br/> Até a Final</h1>
      
      <div className="action-buttons" data-html2canvas-ignore="true">
        <button className="share-button" onClick={onShare} title="Compartilhar como Imagem">
          Compartilhar
        </button>
        <button className="reset-button" onClick={onReset} title="Reiniciar chaveamento">
          Reiniciar
        </button>
      </div>

      <div className="final-label">FINAL</div>
      <div className="final-match">
        <MatchBox 
          matchId="FINAL" 
          matchData={matches['FINAL']} 
          onAdvance={onAdvance} 
        />
      </div>

      <img 
        src={tacaImage} 
        alt="Taça Real" 
        className="trophy-image" 
      />

      <div className="third-place-label">3º LUGAR</div>
      <div className="third-place-match">
        <MatchBox 
          matchId="THIRD" 
          matchData={matches['THIRD']} 
          onAdvance={onAdvance} 
        />
      </div>
    </div>
  );
};

export default CenterStage;
