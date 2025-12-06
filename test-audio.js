/**
 * Quick test script to verify Gemini audio transcription
 * Run with: node test-audio.js
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testAudioTranscription() {
  console.log('Testing Gemini audio transcription...\n');

  // Check API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in .env');
    process.exit(1);
  }
  console.log('✓ API key found');

  // Initialize client
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // Test with gemini-1.5-pro (supports audio)
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  console.log('✓ Model initialized: gemini-1.5-pro\n');

  // Create a simple test audio (silent WebM - just for testing the API)
  // In real usage, this would be actual audio from MediaRecorder
  const testAudioBase64 = 'GkXfo59ChoEBQveBAULygQRC84EIQoKEd2VibUKHgQRChYECGFOAZwH/////////FUmpZpkq17GDD0JATYCGQ2hyb21lV0GGQ2hyb21lFlSua7+uvdeBAXPFh4EBc8WHgQF1woeBAXfCh4EBd8KHgQF1wodYU4BnC///////////sOVmZhBg';

  try {
    console.log('Sending test audio to Gemini...');
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: 'audio/webm',
          data: testAudioBase64,
        },
      },
      {
        text: 'Transcribe the audio to text. Return ONLY the transcribed text, nothing else.',
      },
    ]);

    const response = result.response;
    const transcript = response.text();
    
    console.log('✓ Transcription successful!');
    console.log('Result:', transcript);
    console.log('\n✅ Audio transcription is working!\n');
  } catch (error) {
    console.error('\n❌ Transcription failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.error('\nYour API key appears to be invalid. Get a new one at: https://ai.google.dev/');
    } else if (error.message.includes('quota')) {
      console.error('\nAPI quota exceeded. Check your usage at: https://aistudio.google.com/');
    } else if (error.message.includes('model')) {
      console.error('\nModel not available. Gemini 1.5 Flash might not be available in your region.');
    }
    
    process.exit(1);
  }
}

testAudioTranscription();
