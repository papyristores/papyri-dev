const ALLOWED_KEYS = ['expenditure', 'revenue', 'balance']

export default {
  async fetch(request, env) {
    const allowedOrigins = env.ALLOWED_ORIGIN.split(',').map((o) => o.trim())
    const requestOrigin = request.headers.get('Origin')
    const corsHeaders = {
      'Access-Control-Allow-Origin': allowedOrigins.includes(requestOrigin)
        ? requestOrigin
        : allowedOrigins[0],
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Dashboard-Token',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders })
    }

    const token = request.headers.get('X-Dashboard-Token')
    if (!token || token !== env.DASHBOARD_TOKEN) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return new Response('Invalid JSON', { status: 400, headers: corsHeaders })
    }

    const stats = {}
    for (const key of ALLOWED_KEYS) {
      const value = body[key]
      if (typeof value !== 'string' || value.length === 0 || value.length > 32) {
        return new Response(`Invalid value for "${key}"`, { status: 400, headers: corsHeaders })
      }
      stats[key] = value
    }

    const apiUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${env.STATS_PATH}`
    const ghHeaders = {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'User-Agent': 'papyri-stats-proxy',
      Accept: 'application/vnd.github+json',
    }

    const getRes = await fetch(`${apiUrl}?ref=${env.GITHUB_BRANCH}`, { headers: ghHeaders })
    if (!getRes.ok) {
      const errText = await getRes.text()
      return new Response(`Failed to read current stats.json from GitHub: ${errText}`, {
        status: 502,
        headers: corsHeaders,
      })
    }
    const current = await getRes.json()

    const content = `${JSON.stringify(stats, null, 2)}\n`
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Update dashboard stats',
        content: base64Encode(content),
        sha: current.sha,
        branch: env.GITHUB_BRANCH,
      }),
    })

    if (!putRes.ok) {
      const errText = await putRes.text()
      return new Response(`Failed to commit stats.json: ${errText}`, {
        status: 502,
        headers: corsHeaders,
      })
    }

    return new Response('OK', { status: 200, headers: corsHeaders })
  },
}

function base64Encode(str) {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary)
}
