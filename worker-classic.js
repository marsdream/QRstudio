// Cloudflare Worker: CORS image proxy for QR StarCode ChromaCode

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

async function handleRequest(request) {
  const url = new URL(request.url);

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const target = url.searchParams.get('url');
  if (!target) {
    return new Response(JSON.stringify({ error: 'Missing ?url= parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    new URL(target);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const resp = await fetch(target, {
      headers: {
        'User-Agent': 'QRStudio-Favicon-Proxy/1.0',
        'Accept': 'image/*,*/*;q=0.8',
      },
      redirect: 'follow',
    });

    if (!resp.ok) {
      return new Response(JSON.stringify({ error: 'Upstream returned ' + resp.status }), {
        status: resp.status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const ct = resp.headers.get('content-type') || '';
    if (!ct.includes('image') && !ct.includes('octet-stream') && !ct.includes('icon')) {
      return new Response(JSON.stringify({ error: 'Not an image' }), {
        status: 415,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const body = await resp.arrayBuffer();
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': ct,
        'Cache-Control': 'public, max-age=86400',
        ...corsHeaders,
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Fetch failed: ' + err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}
