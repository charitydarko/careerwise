require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  console.log('Testing gemini-2.0-flash...\n');

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  try {
    const result = await model.generateContent('Explain React in 2 sentences.');
    const response = await result.response;
    const text = response.text();

    console.log('✅ Success!\n');
    console.log('Response:', text);
  } catch (error) {
    console.error('❌ Failed:', error.message);
  }
}

testGemini();
