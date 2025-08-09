// Simple SVG-based notation service
function createNotation(musicalExample, instrument) {
  try {
    // Create a simple SVG staff with basic notation
    const svg = createSimpleStaffSVG(musicalExample, instrument);
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  } catch (error) {
    console.error('Error creating notation:', error);
    return createFallbackNotation(instrument);
  }
}

function createSimpleStaffSVG(musicalExample, instrument) {
  const width = 400;
  const height = 150;
  
  // Parse musical example (format: "C4/4, D4/4, E4/4, F4/4, G4/4")
  const notes = parseMusicalExample(musicalExample);
  
  // Create SVG content
  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
  
  // Background
  svg += `<rect width="${width}" height="${height}" fill="white"/>`;
  
  // Staff lines
  for (let i = 0; i < 5; i++) {
    const y = 30 + i * 15;
    svg += `<line x1="20" y1="${y}" x2="${width - 20}" y2="${y}" stroke="black" stroke-width="1"/>`;
  }
  
  // Treble clef
  svg += `<text x="30" y="60" font-family="Arial" font-size="24" fill="black">𝄞</text>`;
  
  // Time signature
  svg += `<text x="80" y="45" font-family="Arial" font-size="16" fill="black">4</text>`;
  svg += `<text x="80" y="65" font-family="Arial" font-size="16" fill="black">4</text>`;
  
  // Notes
  const noteSymbols = ['♩', '♪', '♫', '♬'];
  notes.forEach((note, index) => {
    const x = 120 + index * 40;
    const y = 60;
    svg += `<text x="${x}" y="${y}" font-family="Arial" font-size="20" fill="black">${noteSymbols[index % noteSymbols.length]}</text>`;
  });
  
  svg += '</svg>';
  return svg;
}

function parseMusicalExample(example) {
  // Parse format like "C4/4, D4/4, E4/4, F4/4, G4/4"
  if (!example) return ['C4/4', 'D4/4', 'E4/4', 'F4/4'];
  
  const notes = example.split(',').map(note => note.trim());
  return notes.length > 0 ? notes : ['C4/4', 'D4/4', 'E4/4', 'F4/4'];
}

function createFallbackNotation(instrument) {
  // Create a simple fallback SVG
  const svg = `<svg width="400" height="150" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="150" fill="white"/>
    <text x="150" y="75" font-family="Arial" font-size="16" fill="black" text-anchor="middle">
      Musical Notation for ${instrument}
    </text>
  </svg>`;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Alternative notation using MusicXML-like format
function createMusicXMLNotation(musicalExample, instrument) {
  const notes = parseMusicalExample(musicalExample);
  
  // Create a simple MusicXML-like structure
  const musicXML = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="3.1">
  <part-list>
    <score-part id="P1">
      <part-name>${instrument}</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>1</divisions>
        <key>
          <fifths>0</fifths>
        </key>
        <time>
          <beats>4</beats>
          <beat-type>4</beat-type>
        </time>
        <clef>
          <sign>G</sign>
          <line>2</line>
        </clef>
      </attributes>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>1</duration>
        <type>quarter</type>
      </note>
    </measure>
  </part>
</score-partwise>`;
  
  return musicXML;
}

module.exports = {
  createNotation,
  createFallbackNotation,
  createMusicXMLNotation
}; 