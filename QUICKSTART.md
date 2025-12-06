# 🚀 Quick Start Guide - Voice-First AI Mentor

**Ready to test in 2 minutes!**

## Step 1: Add Your Gemini API Key

```bash
# Copy the example environment file
cp .env.example .env

# Open .env and add your Gemini API key
# Get one here: https://ai.google.dev/
```

Your `.env` should look like:
```env
DATABASE_URL="postgresql://..."
GEMINI_API_KEY="AIzaSy..."  # ← Add your key here
RESEND_API_KEY="..."
```

## Step 2: Start the Development Server

```bash
npm run dev
```

Server will start at: **http://localhost:3000**

## Step 3: Test the Voice Mentor

1. **Open Dashboard:**
   - Navigate to http://localhost:3000/dashboard

2. **Grant Microphone Permission:**
   - Browser will ask for microphone access
   - Click "Allow"

3. **Start Talking:**
   - **Hold** the large green button
   - **Speak** clearly: "Tell me about data science"
   - **Release** the button
   - Wait ~3-4 seconds

4. **Listen to Response:**
   - Your speech is transcribed
   - AI generates response
   - Response is spoken back to you
   - Conversation appears as text

## What You'll See

### Voice Panel Features:
- 🎤 **Header**: "Voice Chat with Spark" (or Alex, Luna, etc.)
- 📊 **Status**: "Listening...", "Processing...", "Speaking..."
- 💬 **Messages**: Scrollable conversation history
- 🔊 **Visualization**: 20 animated bars while recording
- 🟢 **Button**: Green (idle) → Red (recording)
- 📝 **Instructions**: "Hold to speak" / "Release to send"

## Test Conversations

Try these voice commands:

### Getting Started
- "Tell me about frontend development"
- "What should I learn first?"
- "How do I get started with React?"

### Asking Questions
- "Explain React hooks"
- "What is state management?"
- "How does CSS flexbox work?"

### Getting Help
- "I'm stuck on this task"
- "Can you explain this differently?"
- "What's a real-world example?"

## Features to Test

### ✅ Basic Flow
1. [ ] Hold button to record
2. [ ] See audio visualization
3. [ ] Release to send
4. [ ] Message shows "Transcribing..."
5. [ ] Transcript updates
6. [ ] AI response appears
7. [ ] Response is spoken aloud

### ✅ Error Handling
1. [ ] Try with microphone denied
2. [ ] Try very short recording
3. [ ] Try switching to text chat

### ✅ Conversation
1. [ ] Ask a question
2. [ ] Ask a follow-up
3. [ ] Check if context is maintained

## System Requirements

**Browser:** Chrome, Edge, or Safari (for Speech Recognition API)
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Safari (macOS/iOS)
- ❌ Firefox (limited support)

## How It Works

The voice system uses **browser-native APIs** for speed and reliability:

1. **Speech Recognition**: Browser's built-in speech-to-text (Chrome Web Speech API)
2. **AI Response**: Google Gemini generates mentor response
3. **Text-to-Speech**: Browser's speech synthesis speaks the response

**No audio uploads to server** - transcription happens instantly in your browser!

## Troubleshooting

### "Speech recognition not supported"
- **Solution**: Use Chrome, Edge, or Safari
- Firefox has limited Web Speech API support

### "Microphone access denied"
- Check browser permissions in settings
- Look for microphone icon in address bar
- Reload the page and allow when prompted

### "AI service not configured"
- Verify `GEMINI_API_KEY` is in `.env`
- Restart the dev server with `npm run dev`
- Check the terminal for errors

### No audio playback
- Check your speakers/volume
- Verify browser TTS works: open browser console and run `speechSynthesis.speak(new SpeechSynthesisUtterance('test'))`
- Try a different browser

### Transcription not accurate
- Speak clearly and at normal pace
- Reduce background noise
- Try shorter phrases (works better for natural conversation)
- Check microphone input levels in system settings

## Performance Expectations

- **Transcription**: ~1 second
- **AI Response**: ~2 seconds
- **Total Time**: ~4 seconds from stop → response

## Voice Mentor Personas

The mentor changes based on selected track:

| Track | Mentor | Personality |
|-------|--------|-------------|
| Data Sprint | **Spark** | Analytical, professional |
| Frontend Sprint | **Alex** | Energetic, creative |
| Cloud/DevOps | **Cloud** | Calm, pragmatic |
| UX Design | **Luna** | Empathetic, friendly |
| Backend | **Core** | Logical, architectural |

## Switching Career Tracks

Change plans in the dashboard to hear different mentors:
1. Use "Plan version" dropdown
2. Select "Frontend Sprint" for Alex
3. Select "Data Sprint" for Spark

## Text Chat Fallback

If voice doesn't work:
1. Click "Switch to Text" button
2. Falls back to text chat mode
3. Still AI-powered responses

## API Endpoint

Voice API is available at:
```
POST http://localhost:3000/api/voice/chat
```

Request format:
```json
{
  "audio": "base64_audio_data",
  "context": {
    "userId": "user123",
    "careerTrack": "data",
    "learningLevel": "beginner",
    "currentPhase": "fundamentals"
  }
}
```

## Next Steps

### For Development:
- Check `VOICE_MVP_READY.md` for full documentation
- See `VOICE_FIRST_ARCHITECTURE.md` for architecture details
- Review `src/components/voice/voice-panel.tsx` for component code

### For Testing:
- Test on mobile browsers
- Try longer conversations
- Test error recovery
- Measure latency

### For Production:
- Add database conversation storage
- Implement Gemini native TTS
- Add WebSocket streaming
- Optimize performance

## Getting Help

**Documentation:**
- `WARP.md` - Project overview
- `VOICE_MVP_READY.md` - Complete feature list
- `VOICE_FIRST_ARCHITECTURE.md` - Technical design

**Key Files:**
- Voice API: `src/app/api/voice/chat/route.ts`
- Voice Component: `src/components/voice/voice-panel.tsx`
- Voice Service: `src/lib/voice-service.ts`
- Voice Types: `src/types/voice.ts`

---

## 🎉 You're Ready!

The voice-first AI mentor is now running. Hold the button, speak naturally, and enjoy conversing with your AI mentor!

**Questions to try:**
- "What is {career track}?"
- "How do I learn {skill}?"
- "Explain {concept} simply"
- "What should I do next?"

Have fun! 🎤✨
