// Simple audio generator for browser-compatible audio
export function generateSimpleAudioDataURI(frequency: number = 440, duration: number = 2): string {
  const sampleRate = 44100;
  const samples = sampleRate * duration;
  
  // Create audio buffer
  const audioBuffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(audioBuffer);
  
  // WAV header
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
  
  // Generate sine wave
  let offset = 44;
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * frequency * t) * 0.3;
    const intSample = Math.round(sample * 32767);
    view.setInt16(offset, intSample, true);
    offset += 2;
  }
  
  // Convert to base64 - using a safer method
  const uint8Array = new Uint8Array(audioBuffer);
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
  return `data:audio/wav;base64,${base64}`;
}

export function generateMelodyDataURI(notes: string[] = ['C4', 'D4', 'E4', 'F4', 'G4']): string {
  // Create a simple melody without recursion
  const sampleRate = 44100;
  const duration = 2;
  const samples = sampleRate * duration;
  
  // Create audio buffer
  const audioBuffer = new ArrayBuffer(44 + samples * 2);
  const view = new DataView(audioBuffer);
  
  // WAV header
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
  
  // Generate simple melody
  let offset = 44;
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const noteIndex = Math.floor(t * 2) % 5; // Change note every 0.5 seconds
    const frequencies = [261.63, 293.66, 329.63, 349.23, 392.00]; // C4, D4, E4, F4, G4
    const frequency = frequencies[noteIndex] || 440;
    
    const sample = Math.sin(2 * Math.PI * frequency * t) * 0.3;
    const intSample = Math.round(sample * 32767);
    view.setInt16(offset, intSample, true);
    offset += 2;
  }
  
  // Convert to base64
  const uint8Array = new Uint8Array(audioBuffer);
  const base64 = btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
  return `data:audio/wav;base64,${base64}`;
}
