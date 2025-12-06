/**
 * Verify Gemini API key is valid
 */

require('dotenv').config();

async function verifyApiKey() {
  console.log('🔑 Verifying Gemini API Key...\n');

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY not found in .env file');
    console.log('\n📝 To fix:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Get API key from https://ai.google.dev/');
    console.log('3. Add: GEMINI_API_KEY=your_key_here');
    process.exit(1);
  }

  console.log('✓ API key found in .env');
  console.log(`  Length: ${apiKey.length} characters`);
  console.log(`  Starts with: ${apiKey.substring(0, 10)}...`);
  console.log(`  Format looks valid: ${apiKey.startsWith('AIza') ? '✅' : '❌'}\n`);

  if (!apiKey.startsWith('AIza')) {
    console.error('⚠️  API key format looks incorrect');
    console.log('   Expected format: AIzaSy...');
    console.log('   Your key starts with:', apiKey.substring(0, 10));
    console.log('\n📝 Get a new key from: https://ai.google.dev/');
    process.exit(1);
  }

  // Test with a simple HTTP request
  console.log('🌐 Testing API connection...\n');

  const testUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(testUrl);
    const data = await response.json();

    if (!response.ok) {
      console.error('❌ API request failed');
      console.error('Status:', response.status, response.statusText);
      console.error('Response:', JSON.stringify(data, null, 2));
      
      if (response.status === 400 && data.error?.message?.includes('API_KEY_INVALID')) {
        console.log('\n📝 Your API key is invalid. Get a new one from:');
        console.log('   https://aistudio.google.com/apikey');
      }
      
      process.exit(1);
    }

    console.log('✅ API connection successful!\n');
    console.log('📋 Available models:');
    
    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        const modelName = model.name.replace('models/', '');
        const methods = model.supportedGenerationMethods || [];
        if (methods.includes('generateContent')) {
          console.log(`  ✓ ${modelName}`);
        }
      });

      console.log('\n✅ Use one of the models above in src/lib/gemini.ts');
      
      // Find a recommended model
      const recommendedModel = data.models.find(m => 
        m.name.includes('gemini') && 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      if (recommendedModel) {
        const modelName = recommendedModel.name.replace('models/', '');
        console.log(`\n💡 Recommended: ${modelName}`);
      }
    } else {
      console.log('  No models found');
    }

  } catch (error) {
    console.error('❌ Connection error:', error.message);
    console.log('\n📝 Possible issues:');
    console.log('  - Check your internet connection');
    console.log('  - Verify API key at https://aistudio.google.com/apikey');
    console.log('  - Make sure the key has Gemini API access enabled');
    process.exit(1);
  }
}

verifyApiKey();
