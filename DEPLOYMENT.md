# Deployment (Render + GitHub)

This repo is configured for Render using `render.yaml` at the repository root.

## 1) Push to GitHub

```bash
git push origin <your-branch>
```

## 2) Create service on Render

1. Go to Render → **New +** → **Blueprint**.
2. Connect your GitHub repository.
3. Render will detect `render.yaml` and prefill settings.
4. Review and add required environment variables (if any).
5. Click **Apply**.

## 3) Confirm build settings

The blueprint uses:

- **Root Directory:** `Ground-Operations-Optimizer`
- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm run start`

## 4) Add your public link on GitHub

After deployment, copy your Render URL (for example `https://ground-operations-optimizer.onrender.com`) and add it in GitHub:

- Repo page → **About** → gear icon → **Website** → paste URL → Save.

## 5) Optional runtime environment variables

Set these on Render only when needed:

- `PORT` (Render provides this automatically)
- database/API secrets used by your server
