/**
 * Test different Gemini model names to find which one works
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const MODELS_TO_TRY = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.0-pro',
  'gemini-1.0-pro-latest',
];

async function testModel(modelName) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const result = await model.generateContent('Say "hello"');
    const response = await result.response;
    const text = response.text();
    
    return { success: true, text };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function findWorkingModel() {
  console.log('🔍 Testing Gemini models...\n');

  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in .env');
    process.exit(1);
  }

  console.log('✓ API key found\n');

  for (const modelName of MODELS_TO_TRY) {
    process.stdout.write(`Testing ${modelName.padEnd(30)} ... `);
    
    const result = await testModel(modelName);
    
    if (result.success) {
      console.log('✅ WORKS!');
      console.log(`   Response: "${result.text.substring(0, 50)}..."\n`);
    } else {
      console.log('❌ Failed');
      if (result.error.includes('404')) {
        console.log('   Error: Model not found\n');
      } else if (result.error.includes('API_KEY')) {
        console.log('   Error: Invalid API key\n');
        break;
      } else {
        console.log(`   Error: ${result.error.substring(0, 80)}...\n`);
      }
    }
  }

  console.log('\n✅ Test complete!');
  console.log('\nUpdate src/lib/gemini.ts with the working model name.');
}

findWorkingModel();
