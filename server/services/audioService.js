// Simple audio service that generates working audio URLs
const crypto = require('crypto');

// Generate a simple audio data URI that browsers can play
function generateAudioDataURI(musicalExample, instrument) {
  try {
    // Parse musical example
    const notes = parseMusicalExample(musicalExample);
    
    // Create a simple audio buffer (sine wave)
    const sampleRate = 44100;
    const duration = 2; // 2 seconds
    const samples = sampleRate * duration;
    
    // Generate a simple melody
    const frequencies = notes.map(note => getFrequency(note.pitch)).slice(0, 4);
    const audioData = new Float32Array(samples);
    
    // Create a simple melody
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const noteIndex = Math.floor(t * 2) % frequencies.length; // Change note every 0.5 seconds
      const frequency = frequencies[noteIndex] || 440;
      
      // Create a simple sine wave with envelope
      const envelope = Math.exp(-t * 2); // Simple decay
      audioData[i] = Math.sin(2 * Math.PI * frequency * t) * 0.3 * envelope;
    }
    
    // Convert to 16-bit PCM
    const pcmData = new Int16Array(samples);
    for (let i = 0; i < samples; i++) {
      pcmData[i] = Math.round(audioData[i] * 32767);
    }
    
    // Create WAV header
    const wavHeader = createWAVHeader(samples, sampleRate);
    const wavData = new Uint8Array(wavHeader.length + pcmData.length * 2);
    wavData.set(wavHeader, 0);
    wavData.set(new Uint8Array(pcmData.buffer), wavHeader.length);
    
    // Convert to base64
    const base64 = Buffer.from(wavData).toString('base64');
    return `data:audio/wav;base64,${base64}`;
    
  } catch (error) {
    console.error('Error generating audio:', error);
    return createFallbackAudioDataURI(instrument);
  }
}

function parseMusicalExample(example) {
  // Parse format like "C4/4, D4/4, E4/4, F4/4, G4/4"
  if (!example) return [{ pitch: 'C4', duration: 1 }];
  
  return example.split(',').map(note => {
    const [pitch, duration] = note.trim().split('/');
    return { pitch, duration: parseInt(duration) || 1 };
  });
}

function getFrequency(pitch) {
  // Convert pitch to frequency
  const pitchMap = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
    'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
  };
  
  const note = pitch.slice(0, -1);
  const octave = parseInt(pitch.slice(-1));
  const baseFreq = pitchMap[note] || 261.63;
  
  return baseFreq * Math.pow(2, octave - 4);
}

function createWAVHeader(samples, sampleRate) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  
  // RIFF header
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + samples * 2, true); // File size
  view.setUint32(8, 0x57415645, false); // "WAVE"
  
  // fmt chunk
  view.setUint32(12, 0x666D7420, false); // "fmt "
  view.setUint32(16, 16, true); // Chunk size
  view.setUint16(20, 1, true); // Audio format (PCM)
  view.setUint16(22, 1, true); // Channels
  view.setUint32(24, sampleRate, true); // Sample rate
  view.setUint32(28, sampleRate * 2, true); // Byte rate
  view.setUint16(32, 2, true); // Block align
  view.setUint16(34, 16, true); // Bits per sample
  
  // data chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, samples * 2, true); // Data size
  
  return new Uint8Array(buffer);
}

function createFallbackAudioDataURI(instrument) {
  // Create a simple fallback audio (440Hz sine wave for 1 second)
  const sampleRate = 44100;
  const duration = 1;
  const samples = sampleRate * duration;
  
  const audioData = new Float32Array(samples);
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    audioData[i] = Math.sin(2 * Math.PI * 440 * t) * 0.3;
  }
  
  // Convert to 16-bit PCM
  const pcmData = new Int16Array(samples);
  for (let i = 0; i < samples; i++) {
    pcmData[i] = Math.round(audioData[i] * 32767);
  }
  
  // Create WAV header
  const wavHeader = createWAVHeader(samples, sampleRate);
  const wavData = new Uint8Array(wavHeader.length + pcmData.length * 2);
  wavData.set(wavHeader, 0);
  wavData.set(new Uint8Array(pcmData.buffer), wavHeader.length);
  
  // Convert to base64
  const base64 = Buffer.from(wavData).toString('base64');
  return `data:audio/wav;base64,${base64}`;
}

// Main audio generation function
async function generateAudio(musicalExample, instrument) {
  try {
    // Generate a unique ID for this audio
    const audioId = crypto.randomBytes(8).toString('hex');
    
    // Create the audio data URI
    const audioDataURI = generateAudioDataURI(musicalExample, instrument);
    
    // Return the data URI directly (no file system needed)
    return audioDataURI;
    
  } catch (error) {
    console.error('Error generating audio:', error);
    return createFallbackAudioDataURI(instrument);
  }
}

module.exports = {
  generateAudio,
  generateAudioDataURI,
  createFallbackAudioDataURI
}; 