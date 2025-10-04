# Deploying Frontend to Forge

## Prerequisites

- Forge account
- Server with Node.js 18+
- Domain configured (ree.actor)

## Steps

### 1. Create Site in Forge

1. Go to your Forge server
2. Click **New Site**
3. Configure:
   - **Domain**: `ree.actor`
   - **Project Type**: Static HTML
   - **Web Directory**: `/public` (not used, but required)

### 2. Connect Repository

1. Go to **Apps** tab
2. Connect to `reactorhub-frontend` repository
3. **Branch**: `main`

### 3. Create Daemon for Next.js

1. Go to **Daemons** tab
2. Click **New Daemon**
3. Configure:
   ```
   Command: npm run start
   Directory: /home/forge/ree.actor/current
   User: forge
   Processes: 1
   ```
4. Check **Start on Boot**
5. Click **Create**

### 4. Configure Environment Variables

1. Go to **Environment** tab
2. Add:
   ```bash
   NEXT_PUBLIC_API_URL=https://api.ree.actor/api/v1
   ```
3. Save

### 5. Deploy

1. Click **Deploy Now**
2. Wait for build to complete
3. Daemon will start automatically

### 6. Verify

Visit https://ree.actor - should see the frontend!

## Troubleshooting

### 502 Bad Gateway
- Check daemon status: `sudo supervisorctl status`
- Check logs: `sudo supervisorctl tail -f reactorhub-frontend`

### Changes not reflecting
- Restart daemon: `sudo supervisorctl restart reactorhub-frontend`

### Build fails
- Check server has at least 2GB RAM for Next.js builds
- Check Node version: `node -v` (should be 18+)
