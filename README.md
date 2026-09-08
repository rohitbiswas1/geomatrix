# GEOMATRIX — Land Acquisition AI

Predictive Intelligence for Smarter Infrastructure.

Smart India Hackathon 2026 prototype for Problem Statement 26017: Predictive Analytics System for Early Detection of Land Acquisition Delays.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local`.
3. Add required environment values.
4. `npm run dev`
5. Open `http://localhost:3000/login`.

This prototype uses deterministic synthetic data and a mock risk/explanation engine. Do not treat demo metrics as trained government-data performance.

## Deployment
Vercel hosts the Next.js app. Add secrets only through Vercel Environment Variables. Never commit API keys, OAuth secrets, or database credentials.
