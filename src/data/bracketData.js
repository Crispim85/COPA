export const initialTeams = {
  leftTop: [
    { id: 'l1', code: '1E', country: 'de', name: 'Germany' },
    { id: 'l2', code: '3º', country: 'py', name: 'Paraguay' },
    { id: 'l3', code: '1I', country: 'fr', name: 'France' },
    { id: 'l4', code: '3º', country: 'se', name: 'Sweden' },
    { id: 'l5', code: '2A', country: 'za', name: 'South Africa' },
    { id: 'l6', code: '2B', country: 'ca', name: 'Canada' },
    { id: 'l7', code: '1F', country: 'nl', name: 'Netherlands' },
    { id: 'l8', code: '2C', country: 'ma', name: 'Morocco' },
  ],
  leftBottom: [
    { id: 'l9', code: '2K', country: 'pt', name: 'Portugal' },
    { id: 'l10', code: '2L', country: 'hr', name: 'Croatia' },
    { id: 'l11', code: '1H', country: 'es', name: 'Spain' },
    { id: 'l12', code: '2J', country: 'at', name: 'Austria' },
    { id: 'l13', code: '1D', country: 'us', name: 'USA' },
    { id: 'l14', code: '3º', country: 'ba', name: 'Bosnia and Herzegovina' },
    { id: 'l15', code: '1G', country: 'be', name: 'Belgium' },
    { id: 'l16', code: '3º', country: 'sn', name: 'Senegal' },
  ],
  rightTop: [
    { id: 'r1', code: '1C', country: 'br', name: 'Brazil' },
    { id: 'r2', code: '2F', country: 'jp', name: 'Japan' },
    { id: 'r3', code: '2E', country: 'ci', name: 'Ivory Coast' },
    { id: 'r4', code: '2I', country: 'no', name: 'Norway' },
    { id: 'r5', code: '1A', country: 'mx', name: 'Mexico' },
    { id: 'r6', code: '3º', country: 'ec', name: 'Ecuador' },
    { id: 'r7', code: '1L', country: 'gb-eng', name: 'England' },
    { id: 'r8', code: '3º', country: 'cd', name: 'DR Congo' },
  ],
  rightBottom: [
    { id: 'r9', code: '1J', country: 'ar', name: 'Argentina' },
    { id: 'r10', code: '2H', country: 'cv', name: 'Cape Verde' },
    { id: 'r11', code: '2D', country: 'au', name: 'Australia' },
    { id: 'r12', code: '2G', country: 'eg', name: 'Egypt' },
    { id: 'r13', code: '1B', country: 'ch', name: 'Switzerland' },
    { id: 'r14', code: '3º', country: 'dz', name: 'Algeria' },
    { id: 'r15', code: '1K', country: 'co', name: 'Colombia' },
    { id: 'r16', code: '3º', country: 'gh', name: 'Ghana' },
  ]
};

// Helper function to create an empty bracket structure
export const generateInitialMatches = () => {
  const matches = {};
  
  // Helper to init round
  const initRound = (prefix, count) => {
    for (let i = 1; i <= count; i++) {
      matches[`${prefix}${i}`] = { team1: null, team2: null, winner: null };
    }
  };

  // 2ª Fase (Round of 32 equivalent, 16 matches)
  // L1-L8, R1-R8
  
  // Left 2a Fase
  for (let i = 0; i < 4; i++) {
    matches[`L_32_${i+1}`] = { team1: initialTeams.leftTop[i*2], team2: initialTeams.leftTop[i*2+1], winner: null };
  }
  for (let i = 0; i < 4; i++) {
    matches[`L_32_${i+5}`] = { team1: initialTeams.leftBottom[i*2], team2: initialTeams.leftBottom[i*2+1], winner: null };
  }

  // Right 2a Fase
  for (let i = 0; i < 4; i++) {
    matches[`R_32_${i+1}`] = { team1: initialTeams.rightTop[i*2], team2: initialTeams.rightTop[i*2+1], winner: null };
  }
  for (let i = 0; i < 4; i++) {
    matches[`R_32_${i+5}`] = { team1: initialTeams.rightBottom[i*2], team2: initialTeams.rightBottom[i*2+1], winner: null };
  }

  // Oitavas (8 matches)
  initRound('L_16_', 4);
  initRound('R_16_', 4);

  // Quartas (4 matches)
  initRound('L_8_', 2);
  initRound('R_8_', 2);

  // Semi (2 matches)
  initRound('L_4_', 1);
  initRound('R_4_', 1);

  // Final & 3rd place
  matches['FINAL'] = { team1: null, team2: null, winner: null };
  matches['THIRD'] = { team1: null, team2: null, winner: null };

  return matches;
};
