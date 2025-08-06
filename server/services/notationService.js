const { createCanvas } = require('canvas');
const Vex = require('vexflow');

// Initialize VexFlow
const { Factory, EasyScore, Tools } = Vex.Flow;

function createNotation(musicalExample, instrument) {
  try {
    // Parse musical example (format: "C4/4, D4/4, E4/4, F4/4, G4/4")
    const notes = parseMusicalExample(musicalExample);
    
    // Create canvas
    const canvas = createCanvas(800, 200);
    const context = canvas.getContext('2d');
    
    // Initialize VexFlow
    const vf = new Factory({
      renderer: { elementId: null, width: 800, height: 200 }
    });
    
    const score = vf.EasyScore();
    const system = vf.System();
    
    // Create stave
    const stave = system
      .addStave({
        voices: [
          score.voice(score.notes(notes.join(', '), { time: '4/4' }))
        ]
      })
      .addClef('treble')
      .addTimeSignature('4/4');
    
    // Render
    vf.draw();
    
    // Convert canvas to base64
    const base64 = canvas.toDataURL('image/png');
    
    return base64;
    
  } catch (error) {
    console.error('Error creating notation:', error);
    return createFallbackNotation(instrument);
  }
}

function parseMusicalExample(example) {
  // Parse format like "C4/4, D4/4, E4/4, F4/4, G4/4"
  const notes = example.split(',').map(note => {
    const [pitch, duration] = note.trim().split('/');
    return `${pitch}/${duration}`;
  });
  
  return notes;
}

function createFallbackNotation(instrument) {
  // Create a simple fallback notation
  const canvas = createCanvas(400, 150);
  const ctx = canvas.getContext('2d');
  
  // Draw staff lines
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < 5; i++) {
    const y = 20 + i * 20;
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(350, y);
    ctx.stroke();
  }
  
  // Draw treble clef
  ctx.font = '48px Arial';
  ctx.fillStyle = '#000';
  ctx.fillText('𝄞', 60, 80);
  
  // Draw time signature
  ctx.font = '24px Arial';
  ctx.fillText('4', 120, 60);
  ctx.fillText('4', 120, 80);
  
  // Draw some notes
  ctx.font = '20px Arial';
  ctx.fillText('♩', 180, 70);
  ctx.fillText('♩', 220, 70);
  ctx.fillText('♩', 260, 70);
  ctx.fillText('♩', 300, 70);
  
  return canvas.toDataURL('image/png');
}

// Alternative notation using MusicXML-like format
function createMusicXMLNotation(musicalExample, instrument) {
  const notes = parseMusicalExample(musicalExample);
  
  // Create a simple MusicXML-like structure
  const musicXML = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 3.1 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
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
      ${notes.map(note => {
        const [pitch, duration] = note.split('/');
        return `<note><pitch><step>${pitch[0]}</step><octave>${pitch[1]}</octave></pitch><duration>${duration}</duration></note>`;
      }).join('')}
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