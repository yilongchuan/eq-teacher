# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server on port 3000
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint checks

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: React hooks (no external state library)
- **Backend**: Next.js API routes (Edge Runtime)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **AI Integration**: OpenRouter API (using OpenAI SDK with custom baseURL)
- **Animations**: Framer Motion

### Core Functionality
This is an EQ (Emotional Intelligence) training application where users practice communication skills through AI-powered role-playing scenarios.

### Key Workflow
1. **Scenario Generation**: Dynamic scenarios created via `/api/generate-scenario`
2. **Chat Interface**: 3-turn conversations with AI characters via `/api/chat` 
3. **Evaluation**: AI assessment of emotional intelligence via `/api/eval`
4. **User Management**: Supabase auth with middleware protection

### Database Schema
Key tables in Supabase:
- `scenarios_dynamic` - Generated training scenarios with character info
- `sessions` - Chat session data with messages and evaluation scores
- `profiles` - User profile information

### API Architecture
- **OpenRouter Integration**: Uses OpenAI SDK with `baseURL: "https://openrouter.ai/api/v1"`
- **Model Selection**: `openai/gpt-4o-mini` for chat, `anthropic/claude-3-sonnet` for evaluation
- **Edge Runtime**: All API routes run on Vercel Edge for performance

### Key Components
- `ChatInterface.tsx` - Main chat UI with message history and evaluation display
- `ScenarioSelector.tsx` - Interface for choosing training scenarios
- Middleware handles auth routing and session management

### Environment Variables Required
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `OPENAI_API_KEY` - OpenRouter API key (not OpenAI direct)

### Path Structure
- `/app` - Authenticated dashboard and play areas
- `/auth/*` - Authentication pages (login, register)
- `/api/*` - Backend API routes
- `/play/[scenarioId]` - Individual training sessions

### Character System
Scenarios include character definitions with:
- `name` - Character's name
- `role` - Their role/position
- `personality` - Personality traits affecting responses
- `avatar` - Emoji representation

### Session Flow
1. User selects/generates scenario
2. AI character sends opening message
3. 3-turn conversation with real-time responses
4. Automatic evaluation and scoring
5. Feedback with improvement suggestions

When working on this codebase, pay attention to the Chinese language content and character-based role-playing system.