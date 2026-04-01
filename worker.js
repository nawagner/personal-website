export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === '/api/track-click' && request.method === 'POST') {
      // Clone request data before returning (can't read body after response)
      const ip = request.headers.get('cf-connecting-ip') || 'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      const referrer = request.headers.get('referer') || '';
      let clickSource = 'linkedin_contact_page';
      try {
        const body = await request.json();
        if (body.source) clickSource = body.source;
      } catch {
        // No body or non-JSON is fine
      }

      ctx.waitUntil(
        trackClick(env, { ip, userAgent, referrer, clickSource })
      );
      return new Response(null, { status: 204 });
    }

    return env.ASSETS.fetch(request);
  }
};

async function trackClick(env, { ip, userAgent, referrer, clickSource }) {
  const token = env.HUBSPOT_API_TOKEN;
  if (!token) {
    console.error('HUBSPOT_API_TOKEN not configured');
    return;
  }

  const now = new Date().toISOString();
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  try {
    // Search for existing contact by IP
    const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        filterGroups: [{
          filters: [{
            propertyName: 'ip_address',
            operator: 'EQ',
            value: ip
          }]
        }],
        properties: ['ip_address', 'click_count']
      })
    });

    const searchData = await searchRes.json();

    if (searchData.total > 0) {
      // Update existing contact
      const contact = searchData.results[0];
      const currentCount = parseInt(contact.properties.click_count || '0', 10);

      await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contact.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          properties: {
            last_click_timestamp: now,
            click_count: String(currentCount + 1),
            visitor_user_agent: userAgent,
            click_referrer: referrer
          }
        })
      });
    } else {
      // Create new contact
      await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          properties: {
            ip_address: ip,
            click_source: clickSource,
            visitor_user_agent: userAgent,
            click_referrer: referrer,
            first_click_timestamp: now,
            last_click_timestamp: now,
            click_count: '1'
          }
        })
      });
    }
  } catch (err) {
    console.error('HubSpot API error:', err);
  }
}
