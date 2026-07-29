# papyri-stats-proxy

Cloudflare Worker that lets the dashboard commit updated stat values into
`public/stats.json` on GitHub. It holds the GitHub token server-side —
the browser never sees it — and every commit to `main` triggers the
existing `.github/workflows/deploy-pages.yml`, so the live site picks up
the new numbers automatically.

## One-time setup

1. Install Wrangler and log in:

   ```bash
   npm install -g wrangler
   wrangler login
   ```

2. Create a GitHub token with write access to *only this repo's contents*:
   GitHub → Settings → Developer settings → Fine-grained tokens → Generate
   new token → Repository access: `papyristores/papyri-dev` only →
   Permissions: **Contents: Read and write**. Nothing else.

3. From this `cloudflare-worker/` directory, set the two secrets:

   ```bash
   wrangler secret put GITHUB_TOKEN
   wrangler secret put DASHBOARD_TOKEN
   ```

   `GITHUB_TOKEN` is the token from step 2. `DASHBOARD_TOKEN` is any
   random string you make up — it's the shared secret the frontend sends
   to prove the request came from the dashboard, not a stranger who found
   the Worker URL.

4. Check `wrangler.toml` — `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`,
   and `ALLOWED_ORIGIN` are already filled in for this repo. Edit
   `ALLOWED_ORIGIN` if the site is ever served from a different domain.

5. Deploy:

   ```bash
   wrangler deploy
   ```

   Wrangler prints the Worker's URL, e.g.
   `https://papyri-stats-proxy.<your-subdomain>.workers.dev`.

## Wire it up to the frontend

In `src/App.jsx`, set:

- `STATS_API_URL` to `https://papyri-stats-proxy.<your-subdomain>.workers.dev/update-stats`
- `DASHBOARD_EDIT_TOKEN` to the same string you gave `DASHBOARD_TOKEN` in step 3

Then commit and push — the existing GitHub Actions workflow rebuilds and
redeploys the site with the new values wired in.

## Security note

`DASHBOARD_EDIT_TOKEN` ships in the frontend's public source, so anyone
who reads it can also call this Worker directly. That's an accepted
trade-off: the token only grants the ability to overwrite
`public/stats.json` with new numbers (which shows up as a normal commit
you can revert), never broader GitHub access — the real `GITHUB_TOKEN`
stays server-side in the Worker and is never exposed. If that's not an
acceptable risk, add stronger auth (e.g. Cloudflare Access) in front of
this Worker.
