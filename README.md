# AI Business Operations Management Platform

## Deployment architecture

- `ui/` is the React/Vite application deployed to Vercel.
- `backend/` is the Django REST API deployed to Render.
- Supabase provides PostgreSQL to the Django API. Supabase service credentials are never sent to the browser.

## Vercel

Set the project root directory to `ui` and configure:

- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_BASE_URL=https://<render-service>.onrender.com/api`

## Render

The included `render.yaml` deploys the Django API. Set `ALLOWED_HOSTS` to the Render hostname and `CORS_ALLOWED_ORIGINS` to the Vercel deployment URL. Configure the Supabase PostgreSQL connection with `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `DB_SSLMODE=require`.

Health check: `/api/health/`

Never commit `.env` files or expose a Supabase service-role key in Vercel.