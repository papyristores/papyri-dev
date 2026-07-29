const STAT_KEYS = ['expenditure', 'revenue', 'balance']

const VALIDATORS = {
  'stats.json': (data) => {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return null
    const stats = {}
    for (const key of STAT_KEYS) {
      const value = data[key]
      if (typeof value !== 'string' || value.length === 0 || value.length > 32) return null
      stats[key] = value
    }
    return stats
  },
  'stalls.json': (data) => {
    if (!Array.isArray(data) || data.length !== 4) return null
    const stalls = []
    for (const entry of data) {
      if (typeof entry !== 'object' || entry === null) return null
      const { date, place } = entry
      if (typeof date !== 'string' || date.length === 0 || date.length > 32) return null
      if (typeof place !== 'string' || place.length === 0 || place.length > 32) return null
      stalls.push({ date, place })
    }
    return stalls
  },
  'gst.json': (data) => {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) return null
    const { period, gstr1, gstr3b } = data
    if (typeof period !== 'string' || !/^\d{4}-\d{2}$/.test(period)) return null
    if (typeof gstr1 !== 'boolean' || typeof gstr3b !== 'boolean') return null
    return { period, gstr1, gstr3b }
  },
}

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

    const validator = VALIDATORS[body.file]
    if (!validator) {
      return new Response(`Unknown file "${body.file}"`, { status: 400, headers: corsHeaders })
    }
    const validated = validator(body.data)
    if (validated === null) {
      return new Response(`Invalid data for "${body.file}"`, { status: 400, headers: corsHeaders })
    }

    const apiUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/public/${body.file}`
    const ghHeaders = {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      'User-Agent': 'papyri-stats-proxy',
      Accept: 'application/vnd.github+json',
    }

    const getRes = await fetch(`${apiUrl}?ref=${env.GITHUB_BRANCH}`, { headers: ghHeaders })
    if (!getRes.ok) {
      const errText = await getRes.text()
      return new Response(`Failed to read current ${body.file} from GitHub: ${errText}`, {
        status: 502,
        headers: corsHeaders,
      })
    }
    const current = await getRes.json()

    const content = `${JSON.stringify(validated, null, 2)}\n`
    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Update dashboard ${body.file}`,
        content: base64Encode(content),
        sha: current.sha,
        branch: env.GITHUB_BRANCH,
      }),
    })

    if (!putRes.ok) {
      const errText = await putRes.text()
      return new Response(`Failed to commit ${body.file}: ${errText}`, {
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
