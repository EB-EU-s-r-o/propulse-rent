import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const ALLOWED_METHODS = new Set([
  'crm.item.list',
  'crm.item.update',
  'crm.lead.list',
  'crm.lead.update',
  'crm.deal.add',
])

const WRITE_METHODS = new Set(['crm.item.update', 'crm.lead.update', 'crm.deal.add'])

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Reject anything that isn't a primitive / flat structure of primitives
function isSafeValue(value: unknown, depth = 0): boolean {
  if (depth > 3) return false
  if (value === null) return true
  const t = typeof value
  if (t === 'string') return (value as string).length <= 512
  if (t === 'number' || t === 'boolean') return true
  if (Array.isArray(value)) return value.length <= 100 && value.every((v) => isSafeValue(v, depth + 1))
  if (isPlainObject(value)) {
    const entries = Object.entries(value)
    if (entries.length > 50) return false
    return entries.every(([k, v]) => /^[A-Za-z0-9_.*@<>=%-]{1,64}$/.test(k) && isSafeValue(v, depth + 1))
  }
  return false
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)

  // --- Authentication ---
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return json({ error: 'Unauthorized' }, 401)

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  )

  const token = authHeader.replace('Bearer ', '')
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token)
  if (claimsError || !claimsData?.claims) return json({ error: 'Unauthorized' }, 401)
  const userId = claimsData.claims.sub as string

  // --- Authorization: any assigned role may read, only admin/manager may write ---
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)

  if (rolesError) {
    console.error('role lookup failed', rolesError)
    return json({ error: 'Authorization check failed' }, 500)
  }
  const roleSet = new Set((roles ?? []).map((r: { role: string }) => r.role))
  if (roleSet.size === 0) return json({ error: 'Forbidden' }, 403)

  // --- Input validation ---
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }
  if (!isPlainObject(payload)) return json({ error: 'Invalid request body' }, 400)

  const url = new URL(req.url)
  const method = (payload.endpoint as string) ?? url.searchParams.get('endpoint') ?? ''
  if (typeof method !== 'string' || !ALLOWED_METHODS.has(method)) {
    return json({ error: 'Invalid endpoint' }, 400)
  }
  if (WRITE_METHODS.has(method) && !roleSet.has('admin') && !roleSet.has('manager')) {
    return json({ error: 'Forbidden' }, 403)
  }

  const { endpoint: _omit, ...params } = payload as Record<string, unknown>
  if (!isSafeValue(params)) return json({ error: 'Invalid parameters' }, 400)
  if (params.entityTypeId !== undefined && !/^\d{1,10}$/.test(String(params.entityTypeId))) {
    return json({ error: 'Invalid entityTypeId' }, 400)
  }
  if (params.id !== undefined && !/^[A-Za-z0-9_-]{1,64}$/.test(String(params.id))) {
    return json({ error: 'Invalid id' }, 400)
  }

  // --- Server-side secret ---
  const webhookUrl = Deno.env.get('BITRIX_WEBHOOK_URL')
  if (!webhookUrl) {
    console.error('BITRIX_WEBHOOK_URL is not configured')
    return json({ error: 'Integration not configured' }, 503)
  }

  console.log(JSON.stringify({ audit: 'bitrix_proxy', userId, method, at: new Date().toISOString() }))

  try {
    const target = `${webhookUrl.replace(/\/+$/, '')}/${method}.json`
    const upstream = await fetch(target, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(20_000),
    })

    const data = await upstream.json().catch(() => null)
    if (!upstream.ok || (data && data.error)) {
      console.error('bitrix upstream error', upstream.status, data?.error)
      return json({ error: 'Upstream request failed' }, 502)
    }
    return json({ result: data?.result ?? null })
  } catch (err) {
    console.error('bitrix proxy failure', err)
    return json({ error: 'Request failed' }, 502)
  }
})
