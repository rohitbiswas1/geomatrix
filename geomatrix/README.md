# GEOMATRIX — Land Acquisition AI

**Predictive Intelligence for Smarter Infrastructure**

Smart India Hackathon 2026 prototype for Problem Statement 26017: Predictive Analytics System for Early Detection of Land Acquisition Delays.

## Demo workflow
Login → Command Center → Critical Project → Project Intelligence → Stage-wise Risk → Explainable AI → GIS → Recommendations → Alert → Intervention → return to Command Center.

## Stack
Next.js App Router, TypeScript, React, CSS, Recharts, Lucide, Google Maps JavaScript API, Prisma/PostgreSQL/PostGIS-ready schema.

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env.local`.
3. For the local prototype, keep `DEMO_MODE=true`; for Google OAuth, add the required values below. Never commit secrets. Demo mode uses a local-only fallback session secret when `AUTH_SECRET` is empty.
4. `npm run dev`
5. Open `http://localhost:3000/login`.

## Google OAuth setup
Required environment variables:

- `GOOGLE_CLIENT_ID` — the Google OAuth web client ID.
- `GOOGLE_CLIENT_SECRET` — server-only Google OAuth client secret.
- `AUTH_SECRET` — long random server-only Auth.js session secret.
- `NEXT_PUBLIC_APP_URL` — local value is `http://localhost:3000`.
- `DATABASE_URL` — optional for the prototype; when configured, Google users are upserted into the existing Prisma `User` model with the default `VIEWER` role.
- `ADMIN_EMAILS` — optional comma-separated emails to seed as `ADMIN` when first created.

Set `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true` only when Google OAuth is configured. For production, set both demo-mode variables to `false`.

Local Google callback URI:

`http://localhost:3000/api/auth/callback/google`

In Google Cloud Console, add test accounts under **Google Auth Platform → Audience → Test users**. Google OAuth remains subject to the test-user restrictions configured for the application.

For production, set `NEXT_PUBLIC_APP_URL` to the deployed URL and register `${NEXT_PUBLIC_APP_URL}/api/auth/callback/google` as an authorized redirect URI. Keep `GOOGLE_CLIENT_SECRET` and `AUTH_SECRET` in Vercel/server environment variables only; never use `NEXT_PUBLIC_` for either secret.

Auth.js protects the dashboard, project, GIS, alert, analytics, report, data, settings, admin, and sensitive API routes. New authenticated users default to `VIEWER`; promote an account to `ADMIN` in the database or through the configured `ADMIN_EMAILS` bootstrap list. Logout clears the Auth.js session and returns to `/login`.

After installing dependencies, generate the existing Prisma client with `npx prisma generate`. No Auth.js migration is required because this integration uses signed JWT sessions and reuses the existing `User` model. If you connect a new PostgreSQL database, apply the existing schema with your normal Prisma migration/deploy workflow before enabling user persistence.

## Google Maps
Create a Google Maps browser key with the Maps JavaScript API enabled and put it only in `.env.local` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...`. If the key is missing, `/map` shows **Map configuration required** instead of crashing.

## Demo accounts
- Administrator: `admin@geomatrix.gov.in` / `Admin@123`
- Project Officer: `officer@geomatrix.gov.in` / `Officer@123`
- Policy Maker: `policymaker@geomatrix.gov.in` / `Policy@123`

Authentication is deliberately demo-only. Replace with production SSO/JWT/session authentication before real deployment.

## Mock AI architecture
`lib/data.ts` contains deterministic synthetic projects. `calcRisk()` is a rule-based stand-in for the future XGBoost model. `explain()` is a SHAP-style contribution engine. `recommendations()` is the intervention engine. These are isolated behind API routes so a Python/FastAPI service can replace them later.

The prototype does **not** claim that predictions or model metrics are trained/validated on government data. Settings labels simulated validation metrics accordingly.

## API
- GET/POST `/api/projects`
- GET/PUT `/api/projects/:id`
- GET `/api/projects/:id/risk`
- GET `/api/projects/:id/explanation`
- GET `/api/projects/:id/recommendations`
- GET `/api/map/projects`
- GET `/api/map/geojson`
- GET `/api/alerts`
- GET `/api/analytics/overview`
- GET `/api/analytics/stages`
- GET `/api/analytics/drivers`
- POST `/api/predict`
- GET `/api/reports`

## Database
`prisma/schema.prisma` defines User, Project, LandParcel, AcquisitionStage, CompensationCase, LegalCase, Approval, Document, RiskPrediction, RiskFactor, Recommendation, Alert, AuditLog, District and State. PostgreSQL + PostGIS is the target production database.

## Deployment
Vercel can host the Next.js app and route handlers. Set environment variables in the deployment settings. For production, connect Neon/Supabase/PostgreSQL with PostGIS and move model inference to a Python/FastAPI service via `MODEL_API_URL`.

## Future production integration
- XGBoost/Random Forest model + SHAP
- OCR/NER/document classification
- Government GIS/data connectors
- SSO/RBAC and full audit controls
- Real PostGIS parcel polygons and spatial layers
- Redis/API caching
- PDF report generation service
